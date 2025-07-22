import React from "react";
import { FaBell, FaClock } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Notification } from "../lib/types/Notifications";
//

interface NotificationListProps {
  notifications: Notification[];
  onClose: () => void;
}

const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  onClose,
}) => {
  const router = useRouter();

  const handleViewAll = () => {
    onClose();
    router.push("/auth/notifications");
  };

  const markAsRead = async (id: number) => {
    try {
      // await fetch("/api/notifications/mark-read", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ notificationId: id, userId: user?.id }),
      // });
      // // Optimistically update state
      // setNotifications((prev) =>
      //   prev.map((n) =>
      //     n.id === id ? { ...n, is_read: 1 } : n
      //   )
      // );
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  return (
    <div className="absolute top-10 right-0 w-[300px] max-h-[400px] overflow-y-auto z-50 bg-black text-white shadow-lg rounded-xl border border-amber-600 p-4">
      <div className="font-bold text-lg mb-2 border-b border-amber-500 pb-1 text-amber-400 flex items-center gap-2">
        <FaBell /> Notifications
      </div>

      {notifications.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">
          No new notifications
        </p>
      ) : (
        <ul className="space-y-3">
          {notifications.slice(0, 5).map((notif) => (
            <li
              key={notif.id}
              className={`border-b border-gray-700 pb-2 cursor-pointer ${
                notif.is_read ? "opacity-50" : "hover:bg-neutral-900"
              }`}
              onClick={() => markAsRead(notif.id)}
            >
              <p className="font-semibold text-white">{notif.title}</p>
              <p className="text-sm text-gray-400">{notif.message}</p>
              <div className="text-xs flex items-center gap-1 mt-1 text-amber-400">
                <FaClock /> {new Date(notif.created_at).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={handleViewAll}
        className="block w-full mt-4 text-center text-sm font-semibold text-amber-400 hover:underline"
      >
        View All Notifications
      </button>
    </div>
  );
};

export default NotificationList;
