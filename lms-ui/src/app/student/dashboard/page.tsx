"use client";
import React from "react";
import type { Batch, Resource, Session } from "@/types/student/type";
import {
  School,
  LogOut,
  BookOpen,
  CalendarDays,
  Clock,
  FileVideo,
  FileText as FileTextIcon,
  Link as LinkIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function StudentDashboard() {
  const router = useRouter();
  type Student = {
    studentId: string;
    name: string;
    email: string;
    batches: Batch[];
    notifications: string[];
    recentActivity: string[];
  };
  const [student, setStudent] = React.useState<Student | null>(null);
  const [batches, setBatches] = React.useState<Batch[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadStudentAndBatches() {
      if (typeof window !== "undefined") {
        const studentId = window.localStorage.getItem("student_logged_in");
        if (!studentId) {
          router.push("/student/login");
          return;
        }
        const mod = await import(
          `@/mock/student/student${studentId.replace("stu", "")}.json`
        );
        const studentData = mod.default;
        setStudent(studentData);

        // Load batch details dynamically
        const batchIds = studentData.batches;
        const batchPromises = batchIds.map((id: string) =>
          import(`@/mock/batch/${id}.json`).then((b) => b.default)
        );
        const batchDetails = await Promise.all(batchPromises);
        setBatches(batchDetails);
        setLoading(false);
      }
    }
    loadStudentAndBatches();
  }, [router]);

  if (loading || !student) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-lg text-[var(--muted-foreground)]">
          Loading...
        </span>
      </div>
    );
  }

  // Helper: get today's classes from batches
  const today = new Date().toISOString().slice(0, 10);
  type TodaysClass = {
    time: string;
    status: string;
    topic: string;
    batch: string;
    duration: string;
    joinable: boolean;
  };
  const todaysClasses: TodaysClass[] = batches.flatMap((batch: Batch) =>
    batch.sessions
      .filter((session: Session) => session.date === today)
      .map((session: Session) => ({
        time: session.time,
        status: "ongoing", // You can add logic for status
        topic: session.topic,
        batch: batch.name,
        duration: "90 minutes", // Or use actual duration if available
        joinable: true,
      }))
  );

  // Helper: get recent materials from batches
  type RecentMaterial = {
    name: string;
    batch: string;
    type: string;
    date: string;
    icon: React.ReactElement;
  };
  const recentMaterials: RecentMaterial[] = batches.flatMap((batch: Batch) =>
    batch.resources.map((res: Resource) => ({
      name: res.name,
      batch: batch.name,
      type: res.type,
      date: res.uploaded,
      icon:
        res.type === "pdf" ? (
          <FileTextIcon size={18} className="text-blue-600" />
        ) : res.type === "video" ? (
          <FileVideo size={18} className="text-blue-600" />
        ) : res.type === "link" ? (
          <LinkIcon size={18} className="text-blue-600" />
        ) : (
          <FileTextIcon size={18} className="text-blue-600" />
        ),
    }))
  );

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[var(--color-dashboard-gradient-from)] to-[var(--color-dashboard-gradient-to)]">
      {/* Header */}
      <header className="bg-[var(--card)] text-[var(--card-foreground)] shadow-sm px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <School size={28} color="var(--color-dashboard-icon)" />
          <div>
            <span className="font-semibold text-lg text-[var(--color-dashboard-title)]">
              LMS Student Portal
            </span>
            <div className="text-xs text-[var(--muted-foreground)]">
              {student.email}
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-[var(--color-dashboard-logout)] flex gap-2"
        >
          <LogOut size={18} /> Logout
        </Button>
      </header>
      <main className="px-8 py-8">
        <div className="mb-6">
          <Button
            variant="secondary"
            className="rounded-full px-6 py-2 font-semibold text-base bg-[var(--color-dashboard-tab-bg,var(--secondary))] text-[var(--color-dashboard-tab-text,var(--secondary-foreground))]"
          >
            <BookOpen size={18} className="mr-2" /> Dashboard
          </Button>
        </div>
        <h1 className="text-2xl font-bold mb-1 text-[var(--color-dashboard-title,#222)]">
          Dashboard
        </h1>
        <p className="text-[var(--color-dashboard-subtitle,#6b7280)] mb-6">
          Welcome back! Here&apos;s what&apos;s happening today
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* My Batches */}
          {batches.map((batch: Batch) => (
            <Card
              key={batch.id}
              className="rounded-xl p-6 flex flex-col gap-2 bg-[var(--card)] text-[var(--card-foreground)]"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 rounded bg-[var(--color-batch-status-bg,#18181b)] text-[var(--color-batch-status-text,#fff)] text-xs font-semibold">
                  {batch.status}
                </span>
                <span className="ml-auto text-xs text-[var(--muted-foreground)]">
                  {batch.id}
                </span>
              </div>
              <div className="font-semibold text-lg mb-1">{batch.name}</div>
              <div className="text-sm text-[var(--muted-foreground)] mb-2">
                Trainer: {batch.trainer}
              </div>
              <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] mb-2">
                <CalendarDays size={16} className="mr-1" /> {batch.schedule}
              </div>
              {batch.nextSession && (
                <div className="bg-[var(--color-batch-nextsession-bg,#e6f0fa)] rounded p-2 text-xs mb-2">
                  <div className="text-[var(--color-batch-nextsession-title,#2563eb)] font-medium">
                    Next Session
                  </div>
                  <div>{batch.nextSession.topic}</div>
                  <div>
                    {batch.nextSession.date} at {batch.nextSession.time}
                  </div>
                </div>
              )}
              <Button
                className="w-full bg-[var(--color-batch-btn-bg,#18181b)] text-[var(--color-batch-btn-text,#fff)] mt-2"
                onClick={() => router.push(`/student/batch-detail/${batch.id}`)}
              >
                Open Batch
              </Button>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Classes */}
          <Card className="rounded-xl p-6 bg-[var(--card)] text-[var(--card-foreground)]">
            <div className="font-semibold mb-2">Today&apos;s Classes</div>
            <div className="text-sm text-[var(--muted-foreground)] mb-4">
              Your scheduled sessions for today
            </div>
            <ul className="space-y-3">
              {todaysClasses.map((cls) => (
                <li
                  key={cls.topic + cls.time + cls.batch}
                  className="flex items-center gap-4 p-3 rounded bg-[var(--muted)]"
                >
                  <Clock size={16} className="text-[var(--muted-foreground)]" />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{cls.topic}</div>
                    <div className="text-xs text-[var(--muted-foreground)]">
                      {cls.batch} &bull; {cls.duration}
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded font-semibold ${
                      cls.status === "ongoing"
                        ? "bg-[var(--color-class-ongoing-bg,#2563eb)] text-[var(--color-class-ongoing-text,#fff)]"
                        : "bg-[var(--color-class-upcoming-bg,#e5e7eb)] text-[var(--color-class-upcoming-text,#374151)]"
                    }`}
                  >
                    {cls.status}
                  </span>
                  {cls.joinable && (
                    <Button
                      size="sm"
                      className="ml-2 bg-[var(--color-class-join-bg,#18181b)] text-[var(--color-class-join-text,#fff)]"
                    >
                      Join Now
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          </Card>
          {/* Recent Materials */}
          <Card className="rounded-xl p-6 bg-[var(--card)] text-[var(--card-foreground)]">
            <div className="font-semibold mb-2">Recent Materials</div>
            <div className="text-sm text-[var(--muted-foreground)] mb-4">
              Latest uploaded resources
            </div>
            <ul className="space-y-3">
              {recentMaterials.map((mat) => (
                <li
                  key={mat.name + mat.date + mat.batch}
                  className="flex items-center gap-3 p-3 rounded bg-[var(--muted)]"
                >
                  {mat.icon}
                  <div className="flex-1">
                    <div className="font-medium text-sm">{mat.name}</div>
                    <div className="text-xs text-[var(--muted-foreground)]">
                      {mat.batch}
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded bg-[var(--color-material-type-bg,#e5e7eb)] text-[var(--color-material-type-text,#374151)] font-semibold">
                    {mat.type}
                  </span>
                  <span className="text-xs text-[var(--muted-foreground)] ml-2">
                    {mat.date}
                  </span>
                  <Button variant="outline" size="sm" className="ml-2">
                    View
                  </Button>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </main>
    </div>
  );
}
// The static student dashboard file has been removed as it's now replaced by dynamic route.
