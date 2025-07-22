import { NextResponse, NextRequest } from "next/server";
import { fetchAnalytics, fetchCustomers, fetchDashboardData } from "@/app/lib/backend/services/AdminService";
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const service = searchParams.get("service");
const pageParam = searchParams.get("page");
  const limitParam = searchParams.get("limit");
  const searchTerm = searchParams.get("searchTerm");
  console.log({service})

    const page = parseInt(pageParam || "1", 10);
  const limit = parseInt(limitParam || "10", 10);

  const serviceMap: Record<string, () => Promise<any>> = {
    fetchDashboardData: () => fetchDashboardData(),
    fetchAnalytics: () => fetchAnalytics(),
    fetchCustomers: () => fetchCustomers(req, {page: page, limit:limit, searchTerm:searchTerm!})
  };

  const handler = serviceMap[service!];

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
