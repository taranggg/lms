"use client";
import React from "react";
import Sidebar, { SidebarItem } from "@/components/dashboard/Sidebar";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Users, BookOpen, GraduationCap } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  React.useEffect(() => {
    // Mock Authentication Check
    // In a real app, verify token validity with backend or use a robust auth context
    const token = localStorage.getItem("accessToken"); // or whatever key you use
    // For development convenience, we might want to skip this or strictly enforce it.
    // The user requested: "should not show me any dashboard until i am authenticated"
    if (!token) {
       router.push("/admin/login");
    }
  }, [router]);

  const items: SidebarItem[] = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      active: pathname === "/admin", // Updated to root /admin
      onClick: () => router.push("/admin"),
    },
    {
      label: "Batches",
      icon: <BookOpen size={20} />,
      active: pathname === "/admin/batches",
      onClick: () => router.push("/admin/batches"),
    },
    {
      label: "Trainers",
      icon: <Users size={20} />,
      active: pathname === "/admin/trainers",
      onClick: () => router.push("/admin/trainers"),
    },
    {
      label: "Students",
      icon: <GraduationCap size={20} />,
      active: pathname === "/admin/students",
      onClick: () => router.push("/admin/students"),
    },
  ];

  return (
    <div className="flex bg-[var(--background)] min-h-screen">
      <div className="shrink-0 z-20 h-screen sticky top-0">
        <Sidebar items={items} />
      </div>
      <main className="flex-1 p-4 overflow-y-auto h-screen">{children}</main>
    </div>
  );
}
