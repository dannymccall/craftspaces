import { NextRequest, NextResponse } from "next/server";
import { orderService } from "./OrderService";
import { getUserOrders } from "./OrderService";
import { Order, OrderRequestProps } from "../../types/Order";
import { makeRequest } from "../../helperFunctions";
import {
  addNotification,
  notificationService,
  notifyUser,
} from "./NotificationService";
import db from "@/app/lib/backend/db/db";
import { BaseService } from "./Baseservice";
import { Customer } from "../../types/Customer";

const customerService = new BaseService<Customer>("users");
export const getAllOrders = async (
  req: NextRequest,
  data: OrderRequestProps
) => {
  const { page, limit } = data;
  try {
    if (page && limit) {
      const orders = await getUserOrders(req, { page, limit });

      return NextResponse.json(orders);
    }
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 501 });
  }
};

export const deleteOrder = async (req: NextRequest, id: number) => {
  try {
    const deletedOrder = await orderService.delete(id);
    console.log({ deletedOrder });
    if (deletedOrder) {
      const res = await notifyUser(
        "20",
        "Your order has been Deleted, please check",
        "notify-user"
      );
      return NextResponse.json({ success: true, message: "Order Deleted" });
    }
  } catch (error: any) {
    console.log(error.message);
  }
};

type OrderProps = Omit<Order, "created_at" | "order_date">;

export const updateOrder = async (
  req: NextRequest,
  id: number,
  order: OrderProps
) => {
  try {
    const updatedOrder = await orderService.update(id, order);

    console.log({ updatedOrder });
    if (updatedOrder) {
      const message = `Your order orderID:${order.order_id} has been updated, please check`;
      await addNotification(
        order.user_id,
        "Order Updated",
        message,
        "info",
        "user"
      );
      const res = await notifyUser(
        order.user_id.toString(),
        message,
        "notify-user"
      );
      console.log({ res });
      return NextResponse.json({ success: true, message: "Order Updated" });
    }
  } catch (error: any) {
    console.log(error.message);
  }
};

export const fetchDashboardData = async () => {
  try {
    const [[{ totalOrders }]]: any = await db.query(
      "SELECT COUNT(*) AS totalOrders from orders"
    );
    const [[{ totalCustomers }]]: any = await db.query(
      `SELECT COUNT(*) AS totalCustomers from users WHERE role = "user"`
    );
    const [[{ totalProducts }]]: any = await db.query(
      "SELECT COUNT(*) AS totalProducts from products"
    );
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const [todayOrders] = await db.query(
      `SELECT * FROM orders WHERE created_at BETWEEN ? AND ?`,
      [start, end]
    );

    console.log({ totalCustomers, totalOrders, totalProducts });
    return NextResponse.json({
      items: {
        totalCustomers,
        totalOrders,
        totalProducts,
        todayOrders,
      },
    });
  } catch (error: any) {
    console.log(error.message);
  }
};

export const fetchAnalytics = async () => {
  try {
    const [rows]: any = await db.query(`
  SELECT 
    DATE_FORMAT(created_at, '%Y-%m') AS orders_month, 
    SUM(total_amount) AS totalAmount
  FROM orders
  GROUP BY orders_month
  ORDER BY orders_month DESC
`);

    const [mostBoughtItems]: any = await db.query(
      "SELECT title, quantity_bought FROM products ORDER BY quantity_bought DESC"
    );

    const mostBoughtItemsTitle = mostBoughtItems.map((item: any) => item.title);
    const mostBoughtItemsQuantity = mostBoughtItems.map(
      (item: any) => item.quantity_bought
    );
    console.log({ mostBoughtItemsTitle, mostBoughtItemsQuantity });
    const ordersByMonth = rows.map((order: any) => order.orders_month);
    const monthlyOrdersAmount = rows.map((order: any) => order.totalAmount);

    return NextResponse.json({
      items: {
        ordersByMonth,
        monthlyOrdersAmount,
        mostBoughtItemsTitle,
        mostBoughtItemsQuantity,
      },
    });
  } catch (error: any) {
    console.log(error.message);
  }
};

export async function fetchCustomers(
  req: NextRequest,
  data: OrderRequestProps
) {
  try {
    if (data.page && data.limit) {
      const search = data.searchTerm?.trim();
      const offset = (data.page - 1) * data.limit;

      const searchFields = ["email", "name", "role"];

      let totalCustomers = 0;
      let customers: any[] = [];

      if (search) {
        // Build WHERE clause dynamically
        const searchConditions = searchFields
          .map((field) => `${field} LIKE ?`)
          .join(" OR ");
        const searchValues = Array(searchFields.length).fill(`%${search}%`);

        // Count query
        const [countRows]: any = await db.query(
          `SELECT COUNT(*) AS total FROM users 
       WHERE (${searchConditions}) AND role = ?`,
          [...searchValues, "user"]
        );
        totalCustomers = countRows[0]?.total || 0;

        // Data query
        const [results]: any = await db.query(
          `SELECT * FROM users WHERE role = ? LIMIT ? OFFSET ?`,
          ["user", data.limit, offset]
        );

        customers = results;
      } else {
        // Count query without search
        const [countRows]: any = await db.query(
          `SELECT COUNT(*) AS total FROM users WHERE role = ?`,
          ["user"]
        );

        console.log(countRows);
        totalCustomers = countRows[0]?.total || 0;
        // const where = data.userId ? { user_id: data.userId } : {};
        // Data query without search
        customers = await customerService.findCustom({
          where: { role: "user" },
          limit: data.limit,
          offset,
        });
      }

      console.log({ customers, totalCustomers });
      // Return your response
      return NextResponse.json({
        items: customers,
        totalCustomers,
        totalPages: Math.ceil(totalCustomers / data.limit),
        currentPage: data.page,
      });
    }
  } catch (error) {
    console.log(error);
  }
}

// 

export const deleteCustomer = async (req: NextRequest, id:number) => {
  try {
    if (!id)
      return NextResponse.json({ success: false, message: "Invalid Request" });

    const deletedCustomer = await customerService.delete(id);

    if (deletedCustomer) {
      return NextResponse.json({ success: true, message: "Customer Deleted" });
    }
  } catch (error: any) {
    console.log(error);
  }
};
