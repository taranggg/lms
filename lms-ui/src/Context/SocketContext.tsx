"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/Context/AuthContext";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

// Should move this to a shared constant file ideally
const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:8000";

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    // Initialize Socket
    const newSocket = io(SOCKET_URL);

    newSocket.on("connect", () => {
      console.log("Global Socket Connected:", newSocket.id);
      setIsConnected(true);

      // --- SESSION TRACKING LOGIC ---
      if (user.role === "Trainer" && user.userId) {
        console.log("Emitting join_session for Trainer:", user.userId);
        newSocket.emit("join_session", { trainerId: user.userId });
      }
    });

    newSocket.on("disconnect", () => {
      console.log("Global Socket Disconnected");
      setIsConnected(false);
    });

    setSocket(newSocket);

    // --- HEARTBEAT LOOP ---
    // Keep session alive every 5 minutes
    const heartbeatInterval = setInterval(() => {
      if (user.role === "Trainer" && user.userId && newSocket.connected) {
        console.log("Sending Heartbeat...");
        newSocket.emit("heartbeat", { trainerId: user.userId });
      }
    }, 5 * 60 * 1000);

    // Cleanup
    return () => {
      clearInterval(heartbeatInterval);
      newSocket.disconnect();
    };
  }, [isAuthenticated, user?.userId]); // Re-run if user changes

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
