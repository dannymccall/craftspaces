// /api/auth/me
import { cookies } from "next/headers";
import { verify } from "@/app/lib/helperFunctions";
import { NextRequest, NextResponse } from "next/server";
import { checkAndRefreshToken } from "@/app/lib/serverFunction";


export async function GET(req:NextRequest) {
//   const accessToken = cookies().get("session")?.value;
      // const _user = await checkAndRefreshToken(req);

const refreshToken =  req.cookies.get("refreshToken")?.value;
  if (!refreshToken) return new Response("Unauthorized", { status: 401 });

  try {
    const payload = verify(refreshToken, process.env.NEXT_PUBLIC_REFRESH_SECRET!);
    return Response.json({ success:true,  user: payload });
  } catch (err:any) {
    return NextResponse.json({success:false, message:err.message});
  }
}
