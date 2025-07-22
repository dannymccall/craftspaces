// services/notificationService.ts
import { BaseService } from "./Baseservice";
import { Notification } from "../../types/Notifications";
import db from "@/app/lib/backend/db/db";
import { NextRequest, NextResponse } from "next/server";
import { makeRequest } from "../../helperFunctions";

export const notificationService = new BaseService<Notification>(
  "notifications"
);

export const getNotifications = async (
  userId: number,
  role?: string,
  limit?: number,
  page?: number
) => {
  let query = "";
  let countQuery = "";
  let queryParams: any[] = [];
  let countParams: any[] = [];

  //  const pageParam = parseInt(page || "1", 10);
  // const limitParam = parseInt(limit || "10", 10);
  const offset = (page! - 1) * limit!;

  if (role === "user") {
    query = `
    SELECT * FROM notifications 
    WHERE user_id = ? AND is_read = 0 AND role = ? 
    ORDER BY created_at DESC 
    LIMIT ? OFFSET ?
  `;
    countQuery = `
    SELECT COUNT(*) AS total 
    FROM notifications 
    WHERE user_id = ? AND is_read = 0 AND role = ?
  `;
    queryParams = [userId, role, limit, offset];
    countParams = [userId, role];
  } else {
    query = `
    SELECT * FROM notifications 
    WHERE is_read = 0 AND role = ? 
    ORDER BY created_at DESC 
    LIMIT ? OFFSET ?
  `;
    countQuery = `
    SELECT COUNT(*) AS total 
    FROM notifications 
    WHERE is_read = 0 AND role = ?
  `;
    queryParams = [role, limit, offset];
    countParams = [role];
  }

  const [[{ total }]]: any = await db.query(countQuery, countParams);
  const [rows]: any = await db.query(query, queryParams);



  return NextResponse.json({
    items: rows,
    totalNotifications: total,
    totalPages: Math.ceil(total / limit!),
    currentPage: page,
  });
};

export const addNotification = async (
  userId: number,
  title: string,
  message: string,
  type: "info" | "success" | "warning" | "error" = "info",
  role: string
) => {
  //   const [result]: any = await db.query(
  //     `INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)`,
  //     [userId, title, message, type]
  //   );

  const result: any = await notificationService.create({
    user_id: userId,
    title,
    message,
    type: "info",
    role,
  });
  return result;
};

export const markAsRead = async (req: NextRequest) => {
  try{
    console.log("marking as read..")
    const { notificationId } = await req.json();
    console.log({notificationId})
    const result = await notificationService.update(notificationId, {
      is_read: true,
    });

   
    // await notifyUser(null, "Marked as ready", "markAsRead")
    return NextResponse.json({ success: true, message:"" });
  }catch(error:any){
    console.log(error.message)
  }
};

export const notifyUser = async (
  user: string | null,
  message: string,
  endPoint: string
) => {
  try {
    const response = await makeRequest(
      `${process.env.NEXT_PUBLIC_SOCKET_URL}/api/sockets/${endPoint}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user, message }),
      }
    );

    return response;
  } catch (error: any) {
    console.log(error);
  }
};
