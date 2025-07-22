import { useEffect, useState } from "react";
import { makeRequest } from "../lib/helperFunctions";

export const useUser = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await makeRequest(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/auth?service=fetchUser`, {
          method: "GET",cache: "no-store"
        });

        console.log(response)
        if (response) {
          setUser(response);
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch user");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading, error };
};
