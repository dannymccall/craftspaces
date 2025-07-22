import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "../session/security";
import { verifyToken } from "../helperFunctions";
// const protectedRoutes = [
//   "/admin/add-product"
// ];
// const publicRoutes = ["/auth/auth-page"];
const adminRoutes = ["/admin/add-product"];
export async function adminMiddleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // const isProtectedRoute = protectedRoutes.includes(pathname);
  const isAdminRoute = adminRoutes.includes(pathname);

  //   // Fetch and decrypt session from cookies
  //   const cookie = req.cookies.get("session")?.value; // Updated: Use `req.cookies` directly
  //   const session = cookie ? decrypt(cookie) : null;

  // Redirect logged-out users trying to access protected routes
  // if (isProtectedRoute && !session) {
  //   return NextResponse.redirect(new URL("/", req.url));
  // }

  // Redirect authenticated users trying to access public routes
  const cookie = req.cookies.get("accessToken")?.value; // Updated: Use `req.cookies` directly
  // const session =  cookie ? decrypt(cookie) : null;
  const session = await verifyToken(
    cookie!,
    process.env.NEXT_PUBLIC_ACCESS_TOKEN_SECRET!
  );
  // const user = await getRefreshToken(req);
  console.log({session});
    if (isAdminRoute && !session) {
      return NextResponse.redirect(new URL("/auth/auth-page", req.url));
    }

  // Allow access
  return NextResponse.next();
}
