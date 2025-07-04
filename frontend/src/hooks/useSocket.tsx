"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";

const SOCKET_URL = "https://chat-app-tk-blg.fly.dev"; // Replace with your actual socket server URL

type SocketContextType = {
  socket: Socket | null;
  socketConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({ socket: null, socketConnected: false });

export const useSocketContext = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ userId?: number | string, children: React.ReactNode }> = ({ userId, children }) => {
  const [socketConnected, setSocketConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!userId) return;

    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    socketRef.current = io(SOCKET_URL, {
      query: { userId: userId.toString() },
      transports: ["websocket", "polling"],
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      timeout: 20000,
    });

    socketRef.current.on("connect", () => setSocketConnected(true));
    socketRef.current.on("disconnect", () => setSocketConnected(false));
    socketRef.current.on("connect_error", () => setSocketConnected(false));

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [userId]);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, socketConnected }}>
      {children}
    </SocketContext.Provider>
  );
};