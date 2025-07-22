import React from "react";
import { useMe } from "../hooks/useMe";
import { SocketProvider } from "../context/SocketContext";

const SocketProviderClient = ({ children }: { children: React.ReactNode }) => {
  const user = useMe();
  return <SocketProvider user={user!}>{children}</SocketProvider>;
};

export default SocketProviderClient;
