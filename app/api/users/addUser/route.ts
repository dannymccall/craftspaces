import { NextRequest, NextResponse } from "next/server";
import {
  userService,
  generateHashPassword,
} from "@/app/lib/backend/services/userService";
import { generateSecurePassword } from "@/app/lib/helperFunctions";
import { sendEmail, EmailPayload, checkAndRefreshToken } from "@/app/lib/serverFunction";

export async function POST(req: NextRequest) {
  const { email, role, name } = await req.json();
      const _user = await checkAndRefreshToken(req);

  if (!email.trim() && !role.trim())
    return NextResponse.json({
      success: false,
      message: "Missing required fields",
    });

  try {
    const user = await userService.findCustom({ where: { email } });
    console.log({ user });

    if (user[0])
      return NextResponse.json({
        success: false,
        message: "Email already exists",
      });

    const password = generateSecurePassword(8);

    const hashedPassword = await generateHashPassword(password);

    const savedUser = await userService.create({
      email: email.trim(),
      password: hashedPassword,
      role: role.trim(),
      name: name.trim()
    });

    console.log({savedUser})

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
          <div style="background-color: #007bff; color: #ffffff; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Welcome to CRAFTSPACES!</h1>
          </div>
          
          <!-- Body -->
          <div style="padding: 20px; color: #333333;">
            <p style="margin: 10px 0; line-height: 1.5;">Dear <strong> ${name}</strong>,</p>
            <p style="margin: 10px 0; line-height: 1.5;">Thank you for joining <strong>CRAFTSPACES</strong>. Below are your login credentials:</p>
            
            <!-- Credentials Section -->
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 4px; margin: 20px 0;">
              <p style="margin: 5px 0; font-size: 16px; color: #555555;"><strong>Email:</strong> ${email}</p>
              <p style="margin: 5px 0; font-size: 16px; color: #555555;"><strong>Password:</strong> ${password}</p>
            </div>
            
            <p style="margin: 10px 0; line-height: 1.5;">We recommend changing your password after your first login for security purposes.</p>
            <p style="margin: 10px 0; line-height: 1.5;">If you have any questions or need support, please don’t hesitate to <a href="mailto:support@yourapp.com" style="color: #007bff; text-decoration: none;">contact us</a>.</p>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #f4f4f4; padding: 10px; text-align: center; font-size: 14px; color: #888888;">
            <p>&copy; 2025 CRAFTSPACES. All rights reserved.</p>
            <p><a href="[YourWebsiteURL]" style="color: #007bff; text-decoration: none;">Visit our website</a></p>
          </div>
        </div>
      </body>
    </html>
    `;

    if(savedUser){
    const mailOptions: EmailPayload = {
        from: '"CRAFTSPACES" no-reply@gmail.com', // Sender address,
        to: email, // Recipient address
        subject: "Welcome on Board", // Subject line
        text: "", // Plain text body
        html: html, // HTML body (optional)
    };
    await sendEmail(mailOptions);

    }
    

    return NextResponse.json({ success: true, message: "User added successfully" });
  } catch (err: any) {
    console.log(err);
    return NextResponse.json({ success: false, message: err.message });
  }
}
