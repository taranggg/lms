"use client"
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import AdminStats from "@/components/admin/AdminStats";
import AdminRecentActivity from "@/components/admin/AdminRecentActivity";

export default function AdminDashboard() {
  // Dummy data for UI
  const admin = { name: "Admin User" };
  const stats = {
    students: 120,
    trainers: 10,
    batches: 8,
  };
  const recentActivity = [
    { type: "Student Added", detail: "Alice Smith joined Batch A." },
    { type: "Batch Updated", detail: "Batch B schedule changed." },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] p-4 flex flex-col gap-6">
      <Card className="max-w-2xl mx-auto w-full bg-[var(--card)] text-[var(--card-foreground)]">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome, {admin.name}!</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <AdminStats stats={stats} />
          <AdminRecentActivity activity={recentActivity} />
          <div className="flex flex-wrap gap-2 mt-6">
            <Link href="/admin/batches">
              <Button variant="outline">Manage Batches</Button>
            </Link>
            <Link href="/admin/trainers">
              <Button variant="outline">Manage Trainers</Button>
            </Link>
            <Link href="/admin/students">
              <Button variant="outline">Manage Students</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
