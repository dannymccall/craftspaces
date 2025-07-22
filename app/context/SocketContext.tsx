// context/SocketContext.tsx
import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { useNotification } from "./NotificationContext";
import { User } from "../lib/types/User";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocketContext = () => useContext(SocketContext);

export const SocketProvider = ({ user, children }: { user: User | null; children: React.ReactNode }) => {
  const { showToast } = useNotification();
  const [isConnected, setIsConnected] = useState(false);

  const socketRef = useRef<Socket | null>(null);

  // init socket only once
  if (!socketRef.current) {
    socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_URL!, { autoConnect: false });
  }

  const socket = socketRef.current;

  useEffect(() => {
    if (!user || !socket) return;

    const { role, id } = user;

    const notify = (msg: string) => showToast(msg, "success");

    // general connection flags
    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));

    if (role === "admin") {
      socket.on("notifyAdmins", notify);
      socket.on("markedAsRead", notify)
    } else if (role === "user") {
      socket.on("connect", () => socket.emit("join", id));
      socket.on("notify-user", notify);
      socket.on("markedAsRead", notify)
    }else{
    }

    // auto-connect
    if (!socket.connected) socket.connect();

    return () => {
      socket.off();
      socket.disconnect();
      setIsConnected(false);
    };
  }, [user, socket, showToast]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
