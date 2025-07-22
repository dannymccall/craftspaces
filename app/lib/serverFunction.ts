"import server-only";
import nodemailer, { Transporter } from "nodemailer";
import { v2 as cloudinary } from "cloudinary";

export interface EmailPayload {
  from: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
}
import { cookies } from "next/headers";
import { generateToken } from "./helperFunctions";
export async function sendEmail(mailOptions: EmailPayload) {
  try {
    const transporter: Transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, // e.g., 'smtp.gmail.com'
      port: parseInt(process.env.SMTP_PORT || "465", 10), // Port (default: 587)
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER, // SMTP username
        pass: process.env.SMTP_PASS, // SMTP password
      },
    });

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info);
    return info;
  } catch (error: any) {
    console.error("Error sending email:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
}

export async function emailVerification(
  verificationtoken: string,
  name: string,
  email: string
) {
  const verificaionUrl = `${process.env.BASE_URL}/auth/verify-email?token=${verificationtoken}`;

  const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome Email</title>
        </head>
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
          <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
            <!-- Header -->
            <div style="background-color:#2a2a2a; color: #ffffff; padding: 20px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px;">Welcome to CRAFTSPACES!</h1>
            </div>
            
            <!-- Body -->
            <div style="padding: 20px; color: #333333;">
              <p style="margin: 10px 0; line-height: 1.5;">Dear <strong>${name}</strong>,</p>
              <p style="margin: 10px 0; line-height: 1.5;">Thank you for joining <strong>CRAFTSPACES</strong>. Please verify your email:</p>
              
              <!-- Credentials Section -->
              <div style="background-color: #f9f9f9; padding: 15px; border-radius: 4px; margin: 20px 0;">
                 Click <a href="${verificaionUrl}">here</a> to verify your email. This link is valid for 24 hours.</p>           
              </div>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f4f4f4; padding: 10px; text-align: center; font-size: 14px; color: #888888;">
              <p>&copy; ${new Date().getFullYear()} CRAFTSPACES. All rights reserved.</p>
              <p><a href="[YourWebsiteURL]" style="color: #007bff; text-decoration: none;">Visit our website</a></p>
            </div>
          </div>
        </body>
      </html>
      `;
  const mailOptions: EmailPayload = {
    from: '"CRAFTSPACES" no-reply@gmail.com', // Sender address,
    to: email, // Recipient address
    subject: "Welcome on Board", // Subject line
    text: "", // Plain text body
    html: html, // HTML body (optional)
  };
  await sendEmail(mailOptions);
}

export async function insertCookie(
  cookieName: string,
  session: string,
  expireAt: Date
) {
  const cookieStore = await cookies();
  cookieStore.set(cookieName, session, {
    httpOnly: true,
    secure: true,
    expires: expireAt,
    sameSite: "lax",
    path: "/",
  });
}

import { verifyToken } from "./helperFunctions";

import { NextRequest, NextResponse } from 'next/server';

export async function authMiddleware(req: NextRequest) {
  const cookieStore = await cookies();
 const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  console.log({accessToken, refreshToken})
  try {
    if (accessToken) {
      const user = await verifyToken(
        accessToken,
        process.env.NEXT_PUBLIC_ACCESS_TOKEN_SECRET!
      );
      return { user, response: null };
    }
  } catch (err: any) {
    // token expired
  }

  try {
    if (refreshToken) {
      const user: any = await verifyToken(
        refreshToken,
        process.env.NEXT_PUBLIC_REFRESH_SECRET!
      );
      const newAccessToken = generateToken(
        { id: user.id, email: user.email, role: user.role },
        "15m",
        process.env.NEXT_PUBLIC_ACCESS_TOKEN_SECRET!
      );

      const response = NextResponse.next();
      response.cookies.set("accessToken", newAccessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 15,
      });

      return { user, response };
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message });
  }

  return null;
}


cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (
  fileBuffer: Buffer,
  folder: string
) => {
  return new Promise(async (resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

export const getArrayBuffer = async (file: File): Promise<Buffer> => {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
};

export async function checkAndRefreshToken(req: NextRequest) {
  const result: any = await authMiddleware(req);
  if (!result) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }
  console.log({ result });

  const { user } = result;
  if (user && !user.rememberMe) {
    const refreshToken = generateToken(
      { email: user.email, id: user.id, role: user.role },
      "1h",
      process.env.NEXT_PUBLIC_REFRESH_SECRET!
    );
    const expiresIn1Hour = new Date(Date.now() + 60 * 60 * 1000);
    await insertCookie("refreshToken", refreshToken, expiresIn1Hour);
    return user;
  }

  return null
}

export const adminAuth =async (req: NextRequest) => {
   const result: any = await authMiddleware(req);
if (!result) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const { user } = result;
  if (user.role !== "admin") {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  return user;
}
