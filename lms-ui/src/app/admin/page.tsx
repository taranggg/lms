"use client";
import { UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminLanding() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f8ff] font-sans">
      <main className="flex flex-col items-center w-full py-24 px-4">
        <div className="flex flex-col items-center mb-12">
            <h1 className="text-3xl font-semibold text-[#3730a3] mb-2 text-center">
                Admin Access
            </h1>
        </div>
        <div className="w-full max-w-md">
            <div className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center">
                <span className="mb-4">
                  <UserCog size={56} strokeWidth={2} color="#4F46E5" />
                </span>
                <h2 className="text-xl font-semibold text-[#3730a3] mb-2">
                  Admin Portal
                </h2>
                <p className="text-center text-zinc-500 mb-6">
                  Manage users, batches, and system configuration
                </p>
                <Link href="/admin/login" className="w-full">
                  <Button className="w-full bg-[#18181b] text-white hover:bg-[#3730a3]">
                    Admin Login
                  </Button>
                </Link>
            </div>
        </div>
      </main>
    </div>
  );
}
