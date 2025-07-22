import React from "react";
import { Notification as _Notification} from "@/app/lib/types/Notifications";

interface NotificationProps {
    notification:_Notification;
    markAsRead: (id:number) => Promise<void>;
}

const Notification = ({notification, markAsRead}:NotificationProps) => {
  return (
    <div
      key={notification.id}
      className={`rounded-xl border border-amber-500 p-4 shadow-md ${
        notification.is_read ? "opacity-70" : "bg-neutral-900"
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-white">{notification.title}</h3>
          <p className="text-gray-400 text-sm">{notification.message}</p>
          <p className="text-xs mt-1 text-amber-400">
            {new Date(notification.created_at).toLocaleString()}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1 ml-5">
          {!notification.is_read && (
            <span className="text-xs bg-amber-400 text-black px-2 py-0.5 rounded-full font-bold">
              NEW
            </span>
          )}
          <button
            onClick={() => markAsRead(notification.id)}
            className="text-xs text-amber-400 hover:underline cursor-pointer"
          >
            Mark as Read
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notification;
