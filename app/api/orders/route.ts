import { NextRequest, NextResponse } from "next/server";
import {
  orderService,
  addOrder,
  getUserOrders,
  getOrderDetails,
} from "@/app/lib/backend/services/OrderService";
import { billingInfoSchema } from "@/app/lib/definitions";
import { generateSystemID, generateToken } from "@/app/lib/helperFunctions";
import {
  authMiddleware,
  checkAndRefreshToken,
  insertCookie,
} from "@/app/lib/serverFunction";
import { Order } from "@/app/lib/types/Order";

export async function GET(req: NextRequest) {
  const result: any = await authMiddleware(req);
      const _user = await checkAndRefreshToken(req);

  const searchParams = req.nextUrl.searchParams;
  const orderId = searchParams.get("orderId");
  const pageParam = searchParams.get("page");
  const limitParam = searchParams.get("limit");
  const searchTerm = searchParams.get("searchTerm");
  if (!result) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const { user } = result;

  if (orderId) {
    const orders = await getOrderDetails({
      userId: user.id,
      orderId: Number(orderId),
    });

    return NextResponse.json(orders);
  }

  const page = parseInt(pageParam || "1", 10);
  const limit = parseInt(limitParam || "10", 10);

  if (page && limit) {
    const orders = await getUserOrders(req, {
      userId: user.id,
      page: page,
      limit: limit,
      searchTerm:searchTerm!
    });
    return NextResponse.json(orders);
  }
  const orders = await getUserOrders(req, { userId: user.id });

  console.log({ orders });
  return NextResponse.json(orders);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const user = await checkAndRefreshToken(req);
    const parse = billingInfoSchema.safeParse(body);

    if (!parse.success) {
      return NextResponse.json({
        success: false,
        message: parse.error.flatten(),
      });
    }

    const order_id = generateSystemID("O");
    const orderDetails: Omit<Order, "created_at"> = {
      order_id: order_id,
      user_id: user.id,
      order_date: new Date(),
      status: "pending",
      total_amount: body.totalAmount,
      shipping_address: body.shippingAddress,
      billing_address: body.shippingAddress,
      payment_method: "Credit Card",
      payment_status: "paid",
    };

    console.log(orderDetails);
    return await addOrder(orderDetails, body.cartItems);
  } catch (error: any) {
    console.log(error);
  }
}
