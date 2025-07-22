import { NextResponse, NextRequest } from "next/server";
import {
  changePassword,
  changeProfilePicture,
  changeUserDetails,
  fetchUser,
  resetPassword,
  sendPasswordResetLink,
  signin,
  signout,
  signup,
  verifyEmail,
} from "@/app/lib/backend/services/userService";
import {
  authMiddleware,
  checkAndRefreshToken,
  emailVerification,
} from "@/app/lib/serverFunction";
import { TokenService } from "@/app/lib/backend/services/TokenService";
import { generateToken} from "@/app/lib/helperFunctions";
import { getNotifications, markAsRead } from "@/app/lib/backend/services/NotificationService";
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const service = searchParams.get("service");
  const limit = searchParams.get("limit");
  const page = searchParams.get("page");
  const _user = await checkAndRefreshToken(req);
  if (!service) {
    return NextResponse.json(
      { success: false, message: "Missing service parameter" },
      { status: 400 }
    );
  }

  const serviceMap: Record<string, () => Promise<NextResponse>> = {
    verifyEmail: () => verifyEmail(req),
    fetchUser: () => fetchUser(req),
    fetchNotifications: () =>
      getNotifications(parseInt(_user.id!), _user.role!, parseInt(limit!), parseInt(page!)),
  };

  const handler = serviceMap[service];

  if (!handler) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid service",
      },
      { status: 404 }
    );
  }

  try {
    return await handler();
  } catch (error: any) {
    console.error("Auth API error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}

type AuthBody = {
  email?: string;
  password?: string;
  rememberMe?: boolean;
  name?: string;
  oldPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
};

export async function POST(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const service = searchParams.get("service");
  const _user = await checkAndRefreshToken(req);

  // Reject early if method or service missing
  if (!service) {
    return NextResponse.json(
      { success: false, message: "Missing service parameter" },
      { status: 400 }
    );
  }

  const body: AuthBody = await req.json();
  const {
    email,
    password,
    rememberMe,
    name,
    oldPassword,
    newPassword,
    confirmPassword,
  } = body;

  const serviceMap: Record<string, () => Promise<NextResponse>> = {
    signin: () => signin(email!, password!, rememberMe!),
    signup: () => signup(email!, password!, name!),
    signout: () => signout(req),
    sendEmailVerification: async () => {
      const user: any = await authMiddleware(req); // You can strongly type this later
      const token = generateToken(
        { email: user[0].email },
        "1d",
        process.env.JWT_SECRET!
      );
      await emailVerification(token, user[0].name, user[0].email);
      return NextResponse.json({
        success: true,
        message: "Verification email sent",
      });
    },
    sendResetPasswordLink: () => sendPasswordResetLink(req, email!),
  };

  const handler = serviceMap[service];

  if (!handler) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid service",
      },
      { status: 404 }
    );
  }

  try {
    return await handler();
  } catch (error: any) {
    console.error("Auth API error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const service = searchParams.get("service");

  if (!service) {
    return NextResponse.json({ success: false, message: "Invalid Request" });
  }

  const serviceMap: Record<string, () => Promise<NextResponse | any>> = {
    resetPassword: () => resetPassword(req),
    changeProfilePicture: () => changeProfilePicture(req),
    changePassword: () => changePassword(req),
    changeUserDetails: () => changeUserDetails(req),
    markAsRead: () => markAsRead(req),

  };

  const handler = serviceMap[service];

  if (!handler) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid service",
      },
      { status: 404 }
    );
  }

  try {
    return await handler();
  } catch (error: any) {
    console.error("Auth API error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
