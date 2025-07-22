import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "../session/security";
import { TokenService } from "../backend/services/TokenService";
import { verify, verifyToken } from "../helperFunctions";
// const protectedRoutes = [
//   "/admin/add-product"
// ];
const publicRoutes = ["/auth/auth-page"];
const adminRoutes = ["/admin/add-product"];

export async function authMiddleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  console.log(pathname);
  const isPublicRoute = publicRoutes.includes(pathname);
  const isAdminRoute = adminRoutes.includes(pathname);

  const cookie = req.cookies.get("refreshToken")?.value; // Updated: Use `req.cookies` directly
  const session = await verifyToken(
    cookie!,
    process.env.NEXT_PUBLIC_REFRESH_SECRET!
  );


  if (isPublicRoute && session) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const isAdmin = session?.role === "admin";

  if (isAdminRoute && !isAdmin) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  // Allow access
  return NextResponse.next();
}
