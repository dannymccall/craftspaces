"import server-only";
import { BaseService } from "./Baseservice";
import { Token } from "../../types/Token";
import CryptoJS from "crypto-js";
import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";
import { userService } from "./userService";
import { getSession } from "../../session/sessions";
import { generateToken, verify } from "../../helperFunctions";
import jwt from "jsonwebtoken";
export const TokenService = new BaseService<Token>("refresh_tokens");



export async function insertRefreshToken(
  data: {
    email: string;
    id: number;
    role: string;
    email_verified: boolean;
    name: string;
    rememberMe:boolean
  },
  expireAt: string,
  rememberMe: boolean
) {
  const refreshToken = generateToken(
    data,
    expireAt,
    process.env.NEXT_PUBLIC_REFRESH_SECRET!
  );
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  // await TokenService.create({
  //   user_id,
  //   token: refreshToken,
  //   expires_at: expiresAt,
  // });
  if (rememberMe) {
    (await cookies()).set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      // maxAge: expires,
      expires: expires,
    });
  } else {
    (await cookies()).set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });
  }
}

// export async function getRefreshToken(req: NextRequest) {
//   const refreshToken = req.cookies.get("refreshToken")?.value;

//   if (!refreshToken) {
//     return NextResponse.json(
//       { success: false, message: "Missing token" },
//       { status: 401 }
//     );
//   }

//   // const result = await TokenService.findCustom({
//   //   where: { token: refreshToken },
//   // });
//   try{

//     const decoded = verify(refreshToken, process.env.NEXT_PUBLIC_REFRESH_SECRET!)

//     const tokenRecord = (decoded as {email:string, id:number, role:string});

//     if (!tokenRecord) {
//       return NextResponse.json(
//         { success: false, message: "Invalid token" },
//         { status: 401 }
//       );
//     }

//     const user = await userService.findCustom({where: {id: tokenRecord.id}});

//     if (!user) {
//       return NextResponse.json(
//         { success: false, message: "User not found" },
//         { status: 404 }
//       );
//     }

//     // const now = new Date();

//     // // Check if refresh token is expired
//     // const tokenExpired = new Date(tokenRecord.expires_at) < now;

//     // Check if session still exists (you can use your sessionService here)
//     const sessionStillValid = await getSession("session"); // <-- you need to implement this

//     if (tokenRecord && !sessionStillValid) {
//       // Token and session both dead: force login
//       await TokenService.delete(tokenRecord.id); // clean up
//       return NextResponse.json(
//         { success: false, message: "Session expired. Please login again." },
//         { status: 401 }
//       );
//     }

//     // If token expired but session is still valid — rotate refresh token
//     if (tokenExpired && sessionStillValid) {
//       const newRefreshToken = generateRefreshToken();
//       const newExpiry = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days

//       await TokenService.update(tokenRecord.id, {
//         token: newRefreshToken,
//         expires_at: newExpiry,
//       });

//       const response = NextResponse.json({
//         success: true,
//         message: "Refresh token rotated",
//       });

//       response.cookies.set("refreshToken", newRefreshToken, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production",
//         sameSite: "strict",
//         path: "/",
//         maxAge: 60 * 60 * 24 * 7,
//       });

//       return user;
//     }

//     // If token is still valid, reissue access token (optional)
//   //   const accessToken = generateAccessToken(user);

//     return user;
//   }catch(error:any){
//     return NextResponse.json({success:false, message:error.message})
//   }

// }
