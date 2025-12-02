"use client";
import React from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Users, FileText, Calendar, BadgeCheck } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { courses } from "@/mock/course/courses_mock";
import type { Batch, AttendanceRecord } from "@/types/student/type";
import BatchOverview from "@/components/student/BatchOverview";
import BatchStats from "@/components/student/BatchStats";
import BatchMaterials from "@/components/student/BatchMaterials";
import BatchSessions from "@/components/student/BatchSessions";
import BatchAttendance from "@/components/student/BatchAttendance";

export default function StudentBatchDetail() {
  const router = useRouter();
  const params = useParams();
  const batchId = params?.id as string;
  const batch = courses.find((c) => c.id === batchId) || courses[0];
  const [tab, setTab] = React.useState("overview");
  React.useEffect(() => {
    if (
      typeof window !== "undefined" &&
      !window.localStorage.getItem("student_logged_in")
    ) {
      router.push("/student/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-[var(--background)] p-4 flex flex-col gap-6">
      <div className="max-w-5xl mx-auto w-full">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-semibold flex items-center gap-2">
              {batch.name}
              <span className="ml-2 px-2 py-1 rounded-full bg-[var(--color-badge-active,#18181b)] text-[var(--color-badge-active-text,#fff)] text-xs font-medium">
                {batch.status}
              </span>
            </h1>
            <div className="text-[var(--muted-foreground)] text-sm mt-1">
              {batch.code}
            </div>
          </div>
          <Button
            variant="ghost"
            className="text-[var(--muted-foreground)]"
            onClick={() => {
              window.localStorage.removeItem("student_logged_in");
              router.push("/student/login");
            }}
          >
            Logout
          </Button>
        </div>
        <Tabs value={tab} onValueChange={setTab} className="mt-4">
          <TabsList>
            <TabsTrigger value="overview">
              <Users className="mr-1" size={16} />
              Overview
            </TabsTrigger>
            <TabsTrigger value="materials">
              <FileText className="mr-1" size={16} />
              Materials
            </TabsTrigger>
            <TabsTrigger value="sessions">
              <Calendar className="mr-1" size={16} />
              Sessions
            </TabsTrigger>
            <TabsTrigger value="attendance">
              <BadgeCheck className="mr-1" size={16} />
              My Attendance
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <BatchOverview batch={batch} />
            <BatchStats stats={batch.stats} />
          </TabsContent>
          <TabsContent value="materials">
            <BatchMaterials resources={batch.resources} />
          </TabsContent>
          <TabsContent value="sessions">
            <BatchSessions sessions={batch.sessions} />
          </TabsContent>
          <TabsContent value="attendance">
            <BatchAttendance
              stats={{
                ...batch.stats,
                sessionsPresent: batch.attendance.filter(
                  (a) => a.status === "Present"
                ).length,
                sessionsAbsent: batch.attendance.filter(
                  (a) => a.status === "Absent"
                ).length,
              }}
              attendance={batch.attendance.map(
                (a): AttendanceRecord => ({
                  ...a,
                  status:
                    a.status === "Present"
                      ? "Present"
                      : a.status === "Absent"
                      ? "Absent"
                      : "Not Marked",
                })
              )}
            />
          </TabsContent>
        </Tabs>
        <div className="mt-6">
          <Button
            variant="outline"
            onClick={() => router.push("/student/dashboard")}
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
