import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/app/lib/middlewares/authorization.mw";
import { adminMiddleware } from "./app/lib/middlewares/admin.mw";
export function middleware(req: NextRequest) {
  // Auth middleware first
  const authResponse = authMiddleware(req);
  if (authResponse) return authResponse;

  // Admin middleware next
  const adminResponse = adminMiddleware(req);
  if (adminResponse) return adminResponse;

  // Analytics middleware (optional)
  // const analyticsResponse = analyticsMiddleware(req);
  // if (analyticsResponse) return analyticsResponse;

  return NextResponse.next();
}


// Specify which paths to apply the middleware to
// export const config = {
//   matcher: ["/","/dashboard"],
// };
