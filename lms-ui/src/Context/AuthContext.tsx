"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "@/Utils/Axiosinstance";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export interface User {
  userId: string;
  role: "Trainer" | "Admin" | "Student";
  email: string;
  verified: boolean;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => void;
  // Keep 'token' for backward compatibility during refactor, but it will be null usually or just a boolean flag equivalent
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check for existing session on mount
  useEffect(() => {
    const verifySession = async () => {
      try {
        const response = await axiosInstance.post("/auth/verify-token");
        if (response.data && response.data.verified) {
          setUser({
            userId: response.data.userId,
            role: response.data.role,
            email: response.data.email,
            verified: true,
          });
        }
      } catch (error) {
        console.log("No active session");
      } finally {
        setIsLoading(false);
      }
    };
    verifySession();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
      setUser(null);
      toast.success("Logged out successfully");
      router.push("/logout-success"); // Or login page
    } catch (e) {
      console.error("Logout failed", e);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
