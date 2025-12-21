"use client";

import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import axiosInstance from "./Axiosinstance";

interface AuthResponse {
  role: "Trainer" | "Admin" | "Student";
  verified: boolean;
}

export const useAuthVerification = async (): Promise<AuthResponse | false> => {
  try {
    if (typeof window != "undefined") {
      const token = localStorage.getItem("socialMedia");
      if (token) {
        const ck = await axiosInstance.post("/auth/verify-token", { token });
        return ck.data;
      } else {
        return false;
      }
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

export const useAuthWrapper = (
  Component: React.ComponentType<any>,
  allowedRoles: string[]
) => {
  return function AuthProtected(props: any) {
    const router = useRouter();
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
      checkAuth();
    }, [pathname]);

    async function checkAuth() {
      try {
        const authData = await useAuthVerification();

        if (!authData) {
          // Not authenticated: Redirect based on the URL they tried to access
          if (pathname.startsWith("/trainer")) {
            router.replace("/trainer/login");
          } else if (pathname.startsWith("/student")) {
            router.replace("/student/login");
          } else if (pathname.startsWith("/admin")) {
            router.replace("/admin/login");
          } else {
            router.replace("/");
          }
        } else {
          // Authenticated: Check role
          if (allowedRoles.includes(authData.role)) {
            // Role allowed
            setIsAuthorized(true);
            setIsLoading(false);
          } else {
            // Role NOT allowed: Redirect to their own dashboard/login
            toast.error("Unauthorized! Redirecting to your portal.");
            if (authData.role === "Trainer") {
              router.replace("/trainer/login");
            } else if (authData.role === "Student") {
              router.replace("/student/login");
            } else if (authData.role === "Admin") {
              router.replace("/admin/login");
            } else {
              router.replace("/");
            }
          }
        }
      } catch (error) {
        toast.error("Authentication Error");
        router.replace("/");
      }
    }
    //// Add loader
    // if (isLoading) {
    //   return (
    //     <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-black z-50">
    //       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    //     </div>
    //   );
    // }

    return isAuthorized ? <Component {...props} /> : null;
  };
};
