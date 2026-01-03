"use client";

import React, { useState } from "react";
import { SlideToLogin } from "@/components/ui/slide-to-login";
import { Input } from "@/components/ui/input";
import {
  GraduationCap,
  Eye,
  EyeOff,
  Sparkles,
  User,
  Lock,
  LogIn,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axiosInstance from "@/Utils/Axiosinstance";

export default function StudentLogin() {
  const router = useRouter();
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);

    const trimmedId = studentId.trim();

    if (trimmedId === "" || password.trim() === "") {
      toast.error("Please enter both Student ID and Password");
      setLoading(false);
      return;
    }

    // Real Login Call
    try {
      await axiosInstance.post("/auth/student/login", {
        studentId: trimmedId,
        password: password,
      });
      toast.success("Welcome back!");
      window.location.href = `/student/${trimmedId}`;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-gray-50 to-gray-100 dark:from-slate-900 dark:via-slate-950 dark:to-black relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] rounded-full bg-blue-400/20 blur-[100px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] rounded-full bg-cyan-400/20 blur-[100px] animate-pulse delay-1000" />

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="bg-white/50 dark:bg-black/50 backdrop-blur-xl border border-white/50 dark:border-white/10 p-10 md:p-12 flex flex-col items-center shadow-2xl rounded-3xl">
          {/* Logo & Branding */}
          <div className="space-y-4 flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20 mb-2 transform hover:scale-105 transition-transform duration-300">
              <GraduationCap className="text-white w-8 h-8" />
            </div>
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                Student Portal
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Access your courses, grades, and profile.
              </p>
            </div>
          </div>

          {/* Divider with Sparkle */}
          <div className="relative w-full flex items-center justify-center mb-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200 dark:border-gray-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white/50 dark:bg-black/50 backdrop-blur-sm px-2 text-muted-foreground flex items-center gap-1">
                <Sparkles size={12} /> Sign in
              </span>
            </div>
          </div>

          {/* Login Form */}
          <div className="w-full space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Student ID (e.g., stu1)"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="pl-10 h-11 bg-white/50 dark:bg-black/50 border-gray-200 dark:border-gray-800 focus:ring-blue-500"
                    autoFocus
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-11 bg-white/50 dark:bg-black/50 border-gray-200 dark:border-gray-800 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-2">
              <SlideToLogin
                onSuccess={handleLogin}
                isLoading={loading}
                text="Slide to Login"
                icon={<LogIn className="w-5 h-5 text-blue-600" />}
              />
            </div>
          </div>

          {/* Footer */}
          <p className="mt-8 text-xs text-muted-foreground opacity-60">
            &copy; {new Date().getFullYear()} Learninja LMS. All rights
            reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
