import { NextRequest, NextResponse } from "next/server";
import { Order, OrderItem, OrderRequestProps } from "../../types/Order";
import { BaseService } from "./Baseservice";
import { productService } from "./ProductService";
import { Cart } from "../../types/Product";
import db from "@/app/lib/backend/db/db";
import { addNotification, notifyUser } from "./NotificationService";

export const orderService = new BaseService<Order>("orders");
export const orderDetails = new BaseService<OrderItem>("order_details");
type OrderProps = Omit<Order, "created_at" | "id">;

export const addOrder = async (data: OrderProps, cartItems: Cart[]) => {
  try {
    const order = await orderService.create(data);

    for (const item of cartItems) {
      const product = await productService.findCustom({
        where: { id: item.id },
      });

      if (!product[0]) {
        return NextResponse.json({
          success: false,
          message: "Product not found",
        });
      }

      const message = `A new order has been added orderID: ${data.order_id}`;
      const [createNotification, _, createOrderDetails, notify] =
        await Promise.all([
          orderDetails.create({
            order_id: order,
            product_id: item.id,
            quantity: item.quantity,
            price: item.price,
          }),
          await db.query(
            "UPDATE products SET quantity_bought = quantity_bought + ? WHERE product_id = ?",
            [item.quantity, item.id]
          ),
          addNotification(data.user_id, "New Order", message, "info", "admin"),
          notifyUser(null, message, "notify-admin"),
        ]);
    }

    return NextResponse.json({
      success: true,
      message: "Order made successfully",
    });
  } catch (error: any) {
    console.log(error.message);
  }
};

export async function getUserOrders(req: NextRequest, data: OrderRequestProps) {
  try {
    if (data.page && data.limit) {
      const search = data.searchTerm?.trim();
      const offset = (data.page - 1) * data.limit;

      const searchFields = [
        "billing_address",
        "payment_method",
        "payment_status",
        "status",
        "order_id",
        "shipping_address",
      ];

      let totalOrders = 0;
      let orders: any[] = [];

      if (search) {
        // Build WHERE clause dynamically
        const searchConditions = searchFields
          .map((field) => `${field} LIKE ?`)
          .join(" OR ");
        const searchValues = Array(searchFields.length).fill(`%${search}%`);

        // Count query
        const [countRows]: any = await db.query(
          `SELECT COUNT(*) AS total FROM orders 
       WHERE (${searchConditions}) AND user_id = ?`,
          [...searchValues, data.userId]
        );
        totalOrders = countRows[0]?.total || 0;

        // Data query
        const [results]: any = await db.query(
          `SELECT * FROM orders 
       WHERE (${searchConditions}) AND user_id = ?
       LIMIT ? OFFSET ?`,
          [...searchValues, data.userId, data.limit, offset]
        );

        orders = results;
      } else {
        // Count query without search
        const [countRows]: any = await db.query(
          data.userId
            ? `SELECT COUNT(*) AS total FROM orders WHERE user_id = ?`
            : "SELECT COUNT(*) AS total FROM orders",
          [data.userId]
        );

        console.log(countRows);
        totalOrders = countRows[0]?.total || 0;
        const where = data.userId ? { user_id: data.userId } : {};
        // Data query without search
        orders = await orderService.findCustom({
          where: where,
          limit: data.limit,
          offset,
        });
      }

      console.log({ orders, totalOrders });
      // Return your response
      return {
        items: orders,
        totalOrders,
        totalPages: Math.ceil(totalOrders / data.limit),
        currentPage: data.page,
      };
    }

    const orders = await orderService.findCustom({
      where: { user_id: data.userId },
    });

    if (orders) return orders;

    return null;
  } catch (error: any) {
    console.log(error);
  }
}

export async function getOrderDetails(data: {
  userId: number;
  orderId: number;
}) {
  try {
    const [rows] = await db.query(
      `SELECT o.*, od.*, p.*
      FROM orders o 
      JOIN order_details od ON o.id = od.order_id 
      JOIN products p ON od.product_id = p.id 
      WHERE o.id = ? AND o.user_id = ?`,
      [data.orderId, data.userId]
    );

    if (rows) return rows;
    return null;
  } catch (error: any) {
    console.error("Failed to fetch order details:", error);
    return null;
  }
}
