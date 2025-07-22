import { useEffect, useState } from "react";
import { User } from "../lib/types/User";
import { makeRequest } from "../lib/helperFunctions";
import { usePathname } from "next/navigation";
export const useSession = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await makeRequest("/api/users/auth/me", { method: "GET" });
        console.log(response)
        if (response.success) {
          setUser(response.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Session check failed:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [pathname]);

  return { user, loading };
};
