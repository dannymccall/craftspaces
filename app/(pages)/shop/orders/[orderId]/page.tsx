// app/orders/[orderId]/page.tsx
import React from "react";
import { cookies } from "next/headers"; // 👈 this is key
import OrderItems from "@/app/ui/Orders/OrdersDetail";
const fetchOrderDetails = async (orderId: number, cookieHeader: string) => {
  const response = await fetch(
    `${process.env.BASE_URL}/api/orders?orderId=${orderId}`,
    {
      headers: {
        Cookie: cookieHeader,
      },
      // If it's an internal API route, add this to keep cookies/session
      credentials: "include",
    }
  );

  if (!response.ok) throw new Error(response.statusText);

  const orders = await response.json();
  return orders;
};

const Page = async ({ params }: { params: Promise<{ orderId: number }> }) => {
  const cookieStore: any = await cookies(); // ✅ server-side cookies
  const cookieHeader = cookieStore
    .getAll()
    .map((c: any) => `${c.name}=${c.value}`)
    .join("; ");

  const orderId = Number((await params).orderId);
  const orders = await fetchOrderDetails(orderId, cookieHeader);

  console.log({ orders });

  return <OrderItems orderItems={orders}/>;
};

export default Page;
