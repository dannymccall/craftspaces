import React, { useEffect, useState } from "react";
import { makeRequest } from "../lib/helperFunctions";
import { User } from "../lib/types/User";

export const useMe = () => {
  const [user, setUser] = useState<User>();

  const me = async () => {
    const response = await makeRequest("/api/users/auth/me", { method: "GET" });
    if (response.success) setUser(response.user);
  };

  useEffect(() => {
    me();
  }, []);

  return user;
};
