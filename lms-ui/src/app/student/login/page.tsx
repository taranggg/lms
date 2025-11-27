"use client";
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { School } from "lucide-react";

export default function StudentLogin() {
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    // Simulate login
    setTimeout(() => {
      setLoading(false);
      if (studentId.trim() === "" || password.trim() === "") {
        setError("Please enter both Student ID and Password.");
        return;
      }
      // Check if studentId exists in mock data
      const validIds = [
        "stu1",
        "stu2",
        "stu3",
        "stu4",
        "stu5",
        "stu6",
        "stu7",
        "stu8",
        "stu9",
        "stu10",
        "stu11",
        "stu12",
        "stu13",
        "stu14",
      ]; // Add more as needed
      if (!validIds.includes(studentId.trim())) {
        setError(
          "Invalid Student ID. Please use your actual Student ID (e.g., stu1)."
        );
        return;
      }
      window.localStorage.setItem("student_logged_in", studentId.trim());
      window.location.href = `/student/${studentId.trim()}`;
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 via-blue-300 to-blue-500">
      <Card className="w-full max-w-md p-8 shadow-xl rounded-2xl bg-white/90">
        <div className="flex flex-col items-center mb-6">
          <School size={40} className="text-blue-600 mb-2" />
          <h1 className="text-2xl font-bold text-blue-700 mb-1">
            Student Login
          </h1>
          <p className="text-sm text-gray-500">
            Welcome to the LMS Student Portal
          </p>
        </div>
        <form className="flex flex-col gap-4" onSubmit={handleLogin}>
          <div>
            <Label htmlFor="studentId" className="text-blue-700 font-medium">
              Student ID
            </Label>
            <Input
              id="studentId"
              type="text"
              placeholder="Enter your Student ID"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="mt-1"
              autoFocus
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-blue-700 font-medium">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1"
            />
          </div>
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg mt-4 transition-all duration-150"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
        <div className="mt-6 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} LMS Portal. All rights reserved.
        </div>
      </Card>
    </div>
  );
}
