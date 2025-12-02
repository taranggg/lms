"use client";
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter, useParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Calendar,
  FileText,
  PlayCircle,
  Users,
  BadgeCheck,
} from "lucide-react";
import type { Batch } from "@/types/student/type";
import { BatchmateList } from "@/components/student/BatchmateList";
import { students } from "@/mock/student/students_mock";
import { courses } from "@/mock/course/courses_mock";

export default function StudentBatchDetail() {
  type Student = {
    studentId: string;
    name: string;
    email: string;
    batches: string[]; // Array of batch IDs
    notifications: string[];
    recentActivity: string[];
  };
  const [studentData, setStudentData] = useState<Student | null>(null);
  const [batchDetails, setBatchDetails] = useState<Batch[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [tab, setTab] = useState("overview");
  const router = useRouter();
  const [showBatchmates, setShowBatchmates] = useState(false);
  const params = useParams();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const studentId = window.localStorage.getItem("student_logged_in");
      if (!studentId) {
        router.push("/student/login");
        return;
      }
      // Find student in mock array
      const student = students.find((s) => s.studentId === studentId) || null;
      setStudentData(student);
      // Find batch details from courses
      if (student) {
        const batchDetails: Batch[] = student.courses
          .map((courseId) => courses.find((c) => c.id === courseId))
          .filter(Boolean) as Batch[];
        setBatchDetails(batchDetails);
      }
    }
  }, [router]);

  // Set selectedBatch based on batchId from URL
  useEffect(() => {
    if (batchDetails.length > 0 && params?.batchId) {
      const batch = batchDetails.find(
        (b) => b.id === params.batchId || b.id === `batch${params.batchId}`
      );
      setSelectedBatch(batch || batchDetails[0]);
    }
  }, [batchDetails, params]);

  if (!studentData || !selectedBatch || batchDetails.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <span className="text-lg text-[var(--muted-foreground)]">
          Loading...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] p-4 flex flex-col gap-6">
      <div className="max-w-5xl mx-auto w-full">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-semibold flex items-center gap-2 text-[var(--card-foreground)]">
              {selectedBatch.name}
              <span className="ml-2 px-2 py-1 rounded-full bg-[var(--color-badge-active)] text-[var(--color-badge-active-text)] text-xs font-medium">
                {selectedBatch.status}
              </span>
            </h1>
            <div className="text-[var(--muted-foreground)] text-sm mt-1">
              {selectedBatch.code}
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
        {/* Batch selector if multiple batches */}
        {batchDetails.length > 1 && selectedBatch && (
          <div className="mb-4">
            <span className="text-sm mr-2">Select Batch:</span>
            <select
              className="px-2 py-1 rounded border border-[var(--muted)] bg-[var(--card)] text-[var(--card-foreground)]"
              value={selectedBatch.id}
              onChange={(e) => {
                const batchId = e.target.value;
                const batch = batchDetails.find((b) => b.id === batchId);
                if (batch) {
                  setSelectedBatch(batch);
                  // Update the URL to reflect the selected batch
                  router.push(`/student/batch-detail/${batchId}`);
                }
              }}
            >
              {batchDetails.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        )}
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
          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <Card className="col-span-2 bg-[var(--card)] text-[var(--card-foreground)]">
                <CardHeader>
                  <CardTitle>Batch Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Users size={16} /> <span>Trainer:</span>{" "}
                      <span className="font-medium ml-1">
                        {selectedBatch.trainer}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar size={16} /> <span>Schedule:</span>{" "}
                      <span className="font-medium ml-1">
                        {selectedBatch.schedule}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar size={16} /> <span>Duration:</span>{" "}
                      <span className="font-medium ml-1">
                        {selectedBatch.duration}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <PlayCircle size={16} /> <span>Total Sessions:</span>{" "}
                      <span className="font-medium ml-1">
                        {selectedBatch.totalSessions}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 text-sm">
                    <span className="font-medium">Description</span>
                    <div className="text-[var(--muted-foreground)]">
                      {selectedBatch.description}
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-[var(--card)] text-[var(--card-foreground)]">
                <CardHeader>
                  <CardTitle>Next Session</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center h-full">
                  <Calendar
                    size={32}
                    className="mb-2 text-[var(--muted-foreground)]"
                  />
                  <div className="text-[var(--muted-foreground)]">
                    {selectedBatch.nextSession ? (
                      <>
                        {selectedBatch.nextSession.date} -{" "}
                        {selectedBatch.nextSession.topic}
                      </>
                    ) : (
                      "No upcoming sessions"
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <Card className="bg-[var(--card)] text-[var(--card-foreground)] flex flex-col items-center justify-center">
                <div className="text-2xl font-bold">
                  {selectedBatch.stats.sessionsCompleted}
                </div>
                <div className="text-sm text-[var(--muted-foreground)]">
                  Sessions Completed
                </div>
              </Card>
              <Card className="bg-[var(--card)] text-[var(--card-foreground)] flex flex-col items-center justify-center">
                <div className="text-2xl font-bold">
                  {selectedBatch.stats.materialsAvailable}
                </div>
                <div className="text-sm text-[var(--muted-foreground)]">
                  Materials Available
                </div>
              </Card>
              <Card className="bg-[var(--card)] text-[var(--card-foreground)] flex flex-col items-center justify-center">
                <div className="text-2xl font-bold">
                  {selectedBatch.stats.attendancePercent}%
                </div>
                <div className="text-sm text-[var(--muted-foreground)]">
                  Attendance
                </div>
              </Card>
              {/* Batchmates Analytics Card - only if classmates exist */}
              {Array.isArray(selectedBatch.classmates) &&
                selectedBatch.classmates.length > 0 && (
                  <Card className="bg-[var(--card)] text-[var(--card-foreground)] flex flex-col items-center justify-center border-2 border-[var(--color-badge-active,#2563eb)] shadow-md">
                    <div className="flex items-center gap-2 mb-2">
                      <Users
                        size={24}
                        className="text-[var(--color-badge-active,#2563eb)]"
                      />
                      <span className="text-xl font-bold">
                        {selectedBatch.classmates.length}
                      </span>
                    </div>
                    <div className="text-base font-medium text-[var(--color-badge-active,#2563eb)] mb-1">
                      Batchmates Enrolled
                    </div>
                    <div className="text-xs text-[var(--muted-foreground)] mb-2">
                      See who else is learning with you
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-[var(--color-badge-active,#2563eb)] text-[var(--color-badge-active,#2563eb)]"
                      onClick={() => setShowBatchmates(true)}
                    >
                      View List
                    </Button>
                  </Card>
                )}
            </div>
            {/* Modal for batchmate list */}
            <BatchmateList
              classmates={selectedBatch.classmates}
              showModal={showBatchmates}
              onClose={() => setShowBatchmates(false)}
            />
          </TabsContent>
          {/* Materials Tab */}
          <TabsContent value="materials">
            <div className="mt-6">
              <div className="text-[var(--muted-foreground)] mb-2">
                {selectedBatch.resources.length} materials available
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedBatch.resources.map((res, idx) => (
                  <Card
                    key={idx}
                    className="bg-[var(--card)] text-[var(--card-foreground)]"
                  >
                    <CardHeader className="flex flex-row items-center gap-2">
                      {res.type === "pdf" ? (
                        <FileText className="text-red-500" size={20} />
                      ) : (
                        <PlayCircle className="text-purple-500" size={20} />
                      )}
                      <CardTitle className="text-base">{res.name}</CardTitle>
                      <span className="ml-auto px-2 py-1 rounded-full bg-[var(--color-badge-active,#18181b)] text-[var(--color-badge-active-text,#fff)] text-xs font-medium">
                        {res.type}
                      </span>
                    </CardHeader>
                    <CardContent>
                      <div className="text-[var(--muted-foreground)] text-sm mb-2">
                        {res.description}
                      </div>
                      <div className="text-xs text-[var(--muted-foreground)] mb-2">
                        Uploaded {res.uploaded} by {res.by}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                        <Button size="sm" variant="ghost">
                          Download
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
          {/* Sessions Tab */}
          <TabsContent value="sessions">
            <div className="mt-6">
              <div className="text-[var(--muted-foreground)] mb-2">
                {selectedBatch.sessions.length} sessions scheduled
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-[var(--muted)]">
                      <th className="py-2 px-4 text-left font-medium">Date</th>
                      <th className="py-2 px-4 text-left font-medium">Time</th>
                      <th className="py-2 px-4 text-left font-medium">Topic</th>
                      <th className="py-2 px-4 text-left font-medium">
                        Recording
                      </th>
                      <th className="py-2 px-4 text-left font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedBatch.sessions.map((session, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="py-2 px-4">{session.date}</td>
                        <td className="py-2 px-4">{session.time}</td>
                        <td className="py-2 px-4 font-medium">
                          {session.topic}
                        </td>
                        <td className="py-2 px-4">
                          {session.recording === "Available" ? (
                            <span className="px-2 py-1 rounded-full bg-[var(--color-badge-active,#18181b)] text-[var(--color-badge-active-text,#fff)] text-xs font-medium">
                              Available
                            </span>
                          ) : (
                            <span className="text-[var(--muted-foreground)]">
                              N/A
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-4">
                          {session.recording === "Available" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex items-center gap-1"
                            >
                              <PlayCircle size={16} />
                              View Recording
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
          {/* Attendance Tab */}
          <TabsContent value="attendance">
            <div className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="bg-[var(--card)] text-[var(--card-foreground)] flex flex-col items-center justify-center">
                  <div className="text-2xl font-bold">
                    {selectedBatch.stats.attendancePercent}%
                  </div>
                  <div className="text-sm text-[var(--muted-foreground)]">
                    Overall Attendance
                  </div>
                </Card>
                <Card className="bg-[var(--card)] text-[var(--card-foreground)] flex flex-col items-center justify-center">
                  <div className="text-2xl font-bold">
                    {
                      selectedBatch.attendance.filter(
                        (a) => a.status === "Present"
                      ).length
                    }
                  </div>
                  <div className="text-sm text-[var(--muted-foreground)]">
                    Sessions Present
                  </div>
                </Card>
                <Card className="bg-[var(--card)] text-[var(--card-foreground)] flex flex-col items-center justify-center">
                  <div className="text-2xl font-bold">
                    {
                      selectedBatch.attendance.filter(
                        (a) => a.status === "Absent"
                      ).length
                    }
                  </div>
                  <div className="text-sm text-[var(--muted-foreground)]">
                    Sessions Absent
                  </div>
                </Card>
              </div>
              <Card className="bg-[var(--card)] text-[var(--card-foreground)]">
                <CardHeader>
                  <CardTitle>Attendance Record</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="bg-[var(--muted)]">
                          <th className="py-2 px-4 text-left font-medium">
                            Date
                          </th>
                          <th className="py-2 px-4 text-left font-medium">
                            Topic
                          </th>
                          <th className="py-2 px-4 text-left font-medium">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedBatch.attendance.map((record, idx) => (
                          <tr key={idx} className="border-b">
                            <td className="py-2 px-4">{record.date}</td>
                            <td className="py-2 px-4">{record.topic}</td>
                            <td className="py-2 px-4">
                              {record.status === "Present" ? (
                                <span className="px-2 py-1 rounded-full bg-[var(--color-badge-active,#18181b)] text-[var(--color-badge-active-text,#fff)] text-xs font-medium flex items-center gap-1">
                                  <BadgeCheck size={14} />
                                  Present
                                </span>
                              ) : record.status === "Absent" ? (
                                <span className="px-2 py-1 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)] text-xs font-medium">
                                  Absent
                                </span>
                              ) : (
                                <span className="px-2 py-1 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)] text-xs font-medium">
                                  Not Marked
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button size="sm" variant="outline">
                      Export
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
