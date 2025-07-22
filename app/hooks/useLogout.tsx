import { useState } from "react";
import { makeRequest } from "../lib/helperFunctions";
import { useNotification } from "../context/NotificationContext";
import { useAuth } from "../context/AuthContext";
import { usePathname, useRouter } from "next/navigation";

type LogoutResponse = {
  success: boolean;
  message: string;
};

export const useLogout = () => {
  const { showToast } = useNotification();
  const { logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      const res: LogoutResponse = await makeRequest(`/api/users/auth?service=signout`, {
        method: "POST",
        body: JSON.stringify({}),
      });

      if (!res.success) {
        showToast(res.message, "error");
        return;
      }

      showToast(res.message, "success");
      logout();
      router.replace("/");
    } catch (error: any) {
      showToast(error.message || "Logout failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return { handleLogout, loading };
};
