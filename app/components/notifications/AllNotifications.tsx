import React, { useEffect } from "react";
import ListComponent from "../ListComponent";
import Notification from "./Notification";
import { Notification as _Notification } from "@/app/lib/types/Notifications";
import { markAsRead as _markAsRead } from "@/app/lib/helperFunctions";
import { useSocketContext } from "@/app/context/SocketContext";
interface AllNotificationPops {
  notifications: _Notification[];
  onMarkAsRead: () => void;
}

const AllNotifications = ({
  notifications,
  onMarkAsRead,
}: AllNotificationPops) => {
  const { socket } = useSocketContext();

  const markAsRead = async (id: number) => {
    const response = await _markAsRead(id);
    console.log(response);
    if (!response.success) {
    }

    onMarkAsRead();
  };

  useEffect(() => {
    socket?.on("notify-user", () => onMarkAsRead());
  }, []);
  return (
    <div className="p-6 bg-black min-h-screen text-white">
      <h2 className="text-xl font-bold text-gold-400 mb-4">
        All Notifications
      </h2>
      <div className="space-y-4">
        <ListComponent
          data={notifications}
          renderItem={(notification) => (
            <Notification
              notification={notification}
              markAsRead={markAsRead}
              key={notification.id}
            />
          )}
        />
      </div>
    </div>
  );
};

export default AllNotifications;
