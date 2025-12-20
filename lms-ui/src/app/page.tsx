"use client"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { GraduationCap, Users, School } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f8ff] font-sans">
      <main className="flex flex-col items-center w-full py-24 px-4">
        <div className="flex flex-col items-center mb-12">
          <span className="text-5xl mb-4">
            <GraduationCap size={56} strokeWidth={2} color="#4F46E5" />
          </span>
          <h1 className="text-4xl font-semibold text-[#3730a3] mb-2 text-center">
            Learning Management System
          </h1>
          <p className="text-lg text-[#3730a3] mb-8 text-center">
            Select your portal to continue
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl justify-center">
          {/* Admin Portal Card */}

          {/* Trainer Portal Card */}
          <div className="flex-1 bg-white rounded-xl shadow-md p-8 flex flex-col items-center">
            <span className="mb-4">
              <Users size={40} strokeWidth={2} color="#16a34a" />
            </span>
            <h2 className="text-xl font-semibold text-[#16a34a] mb-2">
              Trainer Portal
            </h2>
            <p className="text-center text-zinc-500 mb-6">
              Manage batches, sessions, and track student progress
            </p>
            <Link href="/trainer/login" className="w-full">
              <Button className="w-full border border-[#16a34a] text-[#16a34a] bg-white hover:bg-[#e6f4ea]">
                Trainer Login
              </Button>
            </Link>
          </div>
          {/* Student Portal Card */}
          <div className="flex-1 bg-white rounded-xl shadow-md p-8 flex flex-col items-center">
            <span className="mb-4">
              <School size={40} strokeWidth={2} color="#2563eb" />
            </span>
            <h2 className="text-xl font-semibold text-[#2563eb] mb-2">
              Student Portal
            </h2>
            <p className="text-center text-zinc-500 mb-6">
              Access your batches, materials, and attendance
            </p>
            <Link href="/student/login" className="w-full">
              <Button className="w-full border border-[#2563eb] text-[#2563eb] bg-white hover:bg-[#e6f0fa]">
                Student Login
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-2 text-center text-sm text-zinc-500 mt-12">
          <span>Powered by Next.js & shadcn/ui</span>
        </div>
      </main>
    </div>
  );
}
