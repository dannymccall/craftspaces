"import server-only";

import { BaseService } from "./Baseservice";
import { User } from "@/app/lib/types/User";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { createSession, deleteSession } from "../../session/sessions";
import { insertRefreshToken, TokenService } from "./TokenService";
import { NextRequest } from "next/server";
import db from "../db/db";
import {
  authMiddleware,
  EmailPayload,
  emailVerification,
  getArrayBuffer,
  insertCookie,
  sendEmail,
  uploadToCloudinary,
} from "../../serverFunction";
import { generateToken } from "../../helperFunctions";
import jwt from "jsonwebtoken";
export const userService = new BaseService<User>("users");

export async function generateHashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

function sanitizeUser(user: User): Omit<User, "password"> {
  const { password, ...rest } = user;
  return rest;
}
export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function getUser(email: string) {
  const user = await userService.findCustom({ where: { email } });
  if (user) return user;
}

export async function signin(
  email: string,
  password: string,
  rememberMe: boolean
) {
  if (!email.trim() || !password.trim())
    return NextResponse.json({
      success: false,
      message: "All fields are required",
    });
  const user = await getUser(email);

  console.log({ user });
  if (!user![0])
    return NextResponse.json({
      success: false,
      message: "Invalid Credentials",
    });

  console.log(password);

  const passwordIsValid = await comparePassword(password, user![0]?.password!);

  console.log(passwordIsValid);
  if (!passwordIsValid)
    return NextResponse.json({
      success: false,
      message: "Invalid Credentials",
    });

  const userSession = sanitizeUser(user![0]!);

  // console.log({ userSession });
  // await createSession(userSession, rememberMe);

  const expireAt = rememberMe ? "30d" : "1h";
  const { name, email: useremail, role, id } = user![0];
  console.log(user![0]);
  const email_verified = Boolean(user![0].email_verified);
  await insertRefreshToken(
    { email: useremail, name, email_verified, id, role, rememberMe },
    expireAt,
    rememberMe
  );

  const accessToken = generateToken(
    { email: user![0].email, id: user![0].id, role: user![0].role },
    "15m",
    process.env.NEXT_PUBLIC_ACCESS_TOKEN_SECRET!
  );

  const expiresIn15Minutes = new Date(Date.now() + 15 * 60 * 1000);
  await insertCookie("accessToken", accessToken, expiresIn15Minutes);
  return NextResponse.json({
    success: true,
    message: "Login successful",
    user: sanitizeUser(user![0]!), // Optional: return user info
  });
}

export async function signup(email: string, password: string, name: string) {
  if (!email.trim() || !password.trim() || !name.trim())
    return NextResponse.json({
      success: false,
      message: "All fields are required",
    });

  const user = await getUser(email);

  console.log({ email, password, name });

  if (user![0]!)
    return NextResponse.json({
      success: false,
      message: "Email already taken",
    });

  const hashedPassword = await generateHashPassword(password);

  const newUser = await userService.create({
    email: email,
    password: hashedPassword,
    name,
    role: "user",
  });

  const verificationtoken = generateToken(
    { email: email },
    "1d",
    process.env.NEXT_PUBLIC_JWT_SECRET!
  );

  if (newUser) {
    await emailVerification(verificationtoken, name, email);
    return NextResponse.json({
      success: true,
      message: "Signup successful, Please check you email to verify your email",
    });
  }

  return NextResponse.json({ success: false, message: "Something happened" });
}

export async function signout(req: NextRequest) {
  const refreshToken = req.cookies.get("refreshToken")?.value;

  if (refreshToken) {
    const result = await TokenService.findCustom({
      where: { token: refreshToken },
    });

    if (result && result[0]) {
      await TokenService.delete(result[0].id);
    }
  }

  await deleteSession("session");

  const response = NextResponse.json({
    success: true,
    message: "Logout successful",
  });

  // Clear cookies
  response.cookies.set("refreshToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0),
    path: "/",
  });

  response.cookies.set("accessToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0),
    path: "/",
  });

  return response;
}

export async function verifyEmail(req: NextRequest) {
  const url = new URL(req.url);

  const searchParams = url.searchParams;

  const token = searchParams.get("token");

  console.log({ token });

  if (!token)
    return NextResponse.json({ success: false, message: "Invalid request" });

  const decoded = jwt.verify(
    token as string,
    process.env.NEXT_PUBLIC_JWT_SECRET!
  );

  const email = (decoded as { email: string }).email;

  const user = await userService.findCustom({ where: { email } });

  if (!user[0])
    return NextResponse.json({ success: false, message: "User not found" });

  if (user[0].email_verified)
    return NextResponse.json({
      success: false,
      message: "User already verified",
    });

  await userService.update(user[0].id, { email_verified: true });

  return NextResponse.json({ success: true, message: "Email Verified" });
}

export async function sendPasswordResetLink(req: NextRequest, email: string) {
  if (!email)
    return NextResponse.json({ success: false, message: "Email Required" });

  const user = await userService.findCustom({ where: { email: email } });

  if (!user)
    return NextResponse.json({ success: false, message: "User not found" });

  const token = generateToken(
    { email: email },
    "1d",
    process.env.NEXT_PUBLIC_RESET_PASSWORD_SECRET!
  );

  const resetUrl = `${process.env.BASE_URL}/auth/reset-password?token=${token}`;
  const html = `
      <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />
            <title>Password Reset</title>
          </head>
          <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 5px; padding: 20px;">
              <tr>
                <td style="text-align: center; background-color: #2a2a2a; color: #ffffff; padding: 15px; font-size: 20px;">
                  Reset Your Password
                </td>
              </tr>
              <tr>
                <td style="padding: 20px; color: #333333; font-size: 16px;">
                  <p style="margin: 0 0 10px 0;">Hi <strong>${
                    user[0].name
                  }</strong>,</p>
                  <p style="margin: 0 0 10px 0;">
                    We received a request to reset your password. If this was you, click the button below to create a new one.
                  </p>
                  <p style="margin: 20px 0; text-align: center;">
                    <a href="${resetUrl}" style="background-color: #007bff; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">
                      Reset Password
                    </a>
                  </p>
                  <p style="margin: 0 0 10px 0; font-size: 14px; color: #777777;">
                    If you didn’t request this, you can safely ignore this email.
                  </p>
                </td>
              </tr>
              <tr>
                <td style="text-align: center; font-size: 12px; color: #aaaaaa; padding: 10px;">
                  &copy; ${new Date().getFullYear()} CRAFTSPACES. All rights reserved.
                </td>
              </tr>
            </table>
          </body>
        </html>
`;

  const mailOptions: EmailPayload = {
    from: '"CRAFTSPACES" no-reply@gmail.com', // Sender address,
    to: user[0].email, // Recipient address
    subject: "Password Reset", // Subject line
    text: "", // Plain text body
    html: html,
  };
  await sendEmail(mailOptions);
  return NextResponse.json({
    success: true,
    message: "Reset Link send to you email, Please check",
  });
}

export async function resetPassword(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const token = searchParams.get("token");
  const { password } = await req.json();
  console.log(password);
  if (!password.trim()) {
    return NextResponse.json({ success: false, message: "Password needed" });
  }
  if (!token) {
    return NextResponse.json({ success: false, message: "Invalid Request" });
  }

  try {
    const decoded = jwt.verify(
      token as string,
      process.env.NEXT_PUBLIC_RESET_PASSWORD_SECRET!
    );

    if (!decoded) {
      return NextResponse.json({
        success: false,
        message: "Token expired, Please generate a new one",
      });
    }
    const email = (decoded as { email: string }).email;

    const user = await getUser(email);

    if (!user![0]) {
      return NextResponse.json({ success: false, message: "User not found" });
    }

    const hashedPassword = await generateHashPassword(password);

    const passwordUpdated = await userService.update(user![0].id, {
      password: hashedPassword,
    });

    return NextResponse.json({
      success: true,
      message: "Password reset complete",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message });
  }
}

export async function fetchUser(req: NextRequest) {
  try {
    const result: any = await authMiddleware(req);
    if (!result) {
      return NextResponse.json(
        { success: false, message: "Please login..." },
        { status: 401 }
      );
    }

    const { user } = result;

    const profile = await userService.findCustom({ where: { id: user.id } });

    console.log({ profile });
    return NextResponse.json(profile[0]);
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message });
  }
}

export async function changeProfilePicture(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id");

  console.log({ id });
  const result: any = await authMiddleware(req);
  const contentType = req.headers.get("content-type");

  if (!result) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }
  if (!contentType?.includes("multipart/form-data")) {
    return NextResponse.json(
      { success: false, message: "Unsupported Content-Type" },
      { status: 400 }
    );
  }

  const body = await req.formData();
  const avarta: File | null = body.get("profile-picture") as unknown as File;
  if (!avarta.name) {
    return NextResponse.json({
      success: false,
      message: "Please avarta required",
    });
  }
  try {
    const buffer = await getArrayBuffer(avarta);

    const upload = await uploadToCloudinary(buffer, "craftspaces");
    const newFileName = (upload as { secure_url: string }).secure_url;

    const updatedUser = await userService.update(Number(id), {
      avatar: newFileName,
    });

    const user = await userService.findCustom({ where: { id: id } });
    if (updatedUser) {
      return NextResponse.json({
        success: true,
        message: "Profile updated successfully",
        data: user![0].avatar,
      });
    }

    return NextResponse.json({ success: false, message: "Something happened" });
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json({ success: false, message: error.message });
  }
}

export async function changePassword(req: NextRequest) {
  const { oldPassword, newPassword, confirmPassword } = await req.json();

  if (!oldPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
    return NextResponse.json({
      success: false,
      message: "Please all fields required",
    });
  }

  if (newPassword !== confirmPassword) {
    return NextResponse.json({
      success: false,
      message: "Passwords do not match",
    });
  }
  const result: any = await authMiddleware(req);
  if (!result) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const { user } = result;
  console.log({ user });

  try {
    const authUser = await userService.findCustom({
      where: { id: user.id },
    });

    console.log({ authUser });
    const passwordIsValid = await comparePassword(
      oldPassword,
      authUser[0].password
    );

    console.log({ passwordIsValid });
    if (!passwordIsValid) {
      return NextResponse.json({
        success: false,
        message: "Old password is not valid",
      });
    }

    const hashedPassword = await generateHashPassword(newPassword);
    console.log(hashedPassword);
    const changePassword = await userService.update(authUser[0].id, {
      password: hashedPassword,
    });

    console.log({ changePassword });
    if (changePassword) {
      return NextResponse.json({
        success: true,
        message: "Password Successfully Changed",
      });
    }

    return NextResponse.json({
      success: false,
      message: "Something Happened, try again...",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message });
  }
}

type FormBody = {
  name?: string;
  email?: string;
  message?: string;
};
export async function changeUserDetails(req: NextRequest) {
  try {
    const body = (await req.json()) as FormBody;

    const emptyFields = Object.entries(body).filter(
      ([key, value]) => value.trim() === ""
    );

    if (emptyFields.length > 0) {
      return NextResponse.json({
        success: false,
        message: `The following fields are empty: ${emptyFields
          .map(([key]) => key)
          .join(", ")}`,
      });
    }

    const result: any = await authMiddleware(req);
    if (!result) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { user } = result;

    const authUser = await userService.findCustom({ where: { id: user.id } });

    if (!authUser) {
      return NextResponse.json({ success: false, message: "Cannot find user" });
    }

    const updateUser = await userService.update(user.id, {
      name: body.name,
    });

    const updatedUser =  await userService.findCustom({where:{id: user.id}});
    if (updateUser) {
      return NextResponse.json({
        success: true,
        message: "User Details updated",
        updatedUser
      });
    }

    return NextResponse.json({
      success: false,
      message: "Something happened, try again",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
