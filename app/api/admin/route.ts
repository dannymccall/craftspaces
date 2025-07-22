import { NextResponse, NextRequest } from "next/server";
import {
  getAllOrders,
  deleteOrder,
  updateOrder,
  deleteCustomer,
} from "@/app/lib/backend/services/AdminService";
import { addProductSchema } from "@/app/lib/definitions";
import {
  adminAuth,
  authMiddleware,
  checkAndRefreshToken,
  getArrayBuffer,
  uploadToCloudinary,
} from "@/app/lib/serverFunction";
import { generateSystemID } from "@/app/lib/helperFunctions";
import { addProduct } from "@/app/lib/backend/services/ProductService";
import { Order } from "@/app/lib/types/Order";

export async function GET(req: NextRequest) {
  const user = await adminAuth(req);
  const searchParams = req.nextUrl.searchParams;

  const pageParam = searchParams.get("page");

  const limitParam = searchParams.get("limit");

  const searchTerm = searchParams.get("searchTerm");

  const service = searchParams.get("service");
  console.log(pageParam, limitParam, service);
  const page = parseInt(pageParam || "1", 10);
  const limit = parseInt(limitParam || "10", 10);

  const serviceMap: Record<string, () => Promise<any>> = {
    fetchOrders: () =>
      getAllOrders(req, { page: page!, limit, searchTerm: searchTerm! }),
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

export async function POST(req: NextRequest) {
  const user = await adminAuth(req);
  const contentType = req.headers.get("content-type");

  if (!contentType?.includes("multipart/form-data")) {
    return NextResponse.json(
      { error: "Unsupported Content-Type" },
      { status: 400 }
    );
  }

  const body = await req.formData();
  try {
    const avarta: File | null = body.get("avarta") as unknown as File;
    if (!avarta.name) {
      return NextResponse.json({
        success: false,
        message: "Please avarta required",
      });
    }

    const rawData: Record<string, any> = {};
    for (const [key, value] of body.entries()) {
      rawData[key] = value;
    }

    const parsed = addProductSchema.safeParse(rawData);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.flatten() },
        { status: 400 }
      );
    }
    console.log("data:", rawData);
    const buffer = await getArrayBuffer(avarta);

    const result = await uploadToCloudinary(buffer, "craftspaces");
    const newFileName = (result as { secure_url: string }).secure_url;
    const productId = generateSystemID("P");

    const product = {
      title: rawData.title,
      description: rawData.description,
      price: parseFloat(rawData.price),
      category: rawData.category,
      avatar: newFileName,
      product_id: productId,
    };
    console.log({ product });
    return await addProduct(product);
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json({ success: false, message: error.message });
  }
}

export async function DELETE(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const service = searchParams.get("service");
  const id = searchParams.get("id");

  const serviceMap: Record<string, () => Promise<any>> = {
    deletedOrder: () => deleteOrder(req, parseInt(id!)),
    deleteCustomer: () => deleteCustomer(req, parseInt(id!)),
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

export async function PUT(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  const id = searchParams.get("id");
  if (!id)
    return NextResponse.json({ success: false, message: "Invalid Request" });

  const body = await req.json();
  try {
    const user = await checkAndRefreshToken(req);

    const orderDetails: Omit<Order, "created_at" | "order_date"> = {
      order_id: body.orderId,
      status: body.orderStatus,
      total_amount: body.totalAmount,
      shipping_address: body.shippingAddress,
      billing_address: body.shippingAddress,
      payment_method: body.paymentMethod,
      payment_status: body.paymentStatus,
      user_id: body.userId,
    };
    return await updateOrder(req, parseInt(id!), orderDetails);
  } catch (error: any) {
    console.log(error.message);
  }
}
