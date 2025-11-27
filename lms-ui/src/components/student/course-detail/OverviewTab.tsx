"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

// ---- Types ----

interface AttendanceRecord {
  date: string; // ISO string: "2025-11-24"
  topic: string;
  status: "Present" | "Absent" | "Late" | string;
}

interface ResourceItem {
  name: string;
  type: string; // "pdf" | "video" | ...
  link: string;
  uploaded: string; // date string
  by: string;
}

interface SessionItem {
  date: string; // ISO string
  time: string; // "10:00 AM"
  topic: string;
  recording: string;
}

interface CourseStats {
  sessionsCompleted: number;
  materialsAvailable: number;
  attendancePercent: number;

  // Optional extra stats if you ever add them later
  sessionsCompletedPercent?: number;
  materialsAvailablePercent?: number;
  totalMaterials?: number;
  totalSessions?: number;
  sessionsPresent?: number;
}

interface CourseNextSession {
  date: string;
  time: string;
  topic: string;
  image?: string;
}

export interface Course {
  id: string;
  name: string;
  logo: string;
  color: string;
  code: string;
  status: string;
  trainer: string;
  schedule: string;
  duration: string;
  totalSessions: number;
  description: string;
  students: string[];
  assignments: number;
  attendance: AttendanceRecord[];
  resources: ResourceItem[];
  sessions: SessionItem[];
  stats: CourseStats;
  nextSession?: CourseNextSession;
}

type OverviewTabProps = {
  course: Course;
};

// ---- Helpers ----

const formatNextSessionLabel = (nextSession?: CourseNextSession): string => {
  if (!nextSession) return "TBA";

  const { date, time } = nextSession;
  if (date && time) return `${date} • ${time}`;
  if (date) return date;
  if (time) return time;
  return "TBA";
};

type ProgressCardProps = {
  percent: number;
  label: string;
  value: number;
  total: number;
};

function ProgressCard({ percent, label, value, total }: ProgressCardProps) {
  const [displayPercent, setDisplayPercent] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDisplayPercent(percent);
    }, 100);
    return () => clearTimeout(timeout);
  }, [percent]);

  const circleRadius = 16;
  const circumference = 2 * Math.PI * circleRadius;
  const offset = circumference - (displayPercent / 100) * circumference;

  return (
    <div className="bg-[var(--card)] rounded-2xl px-4 py-4 md:px-8 md:py-6 shadow-sm border border-[#e5e7eb] flex flex-col items-center justify-center gap-2 md:gap-3 min-w-0 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
      <div className="relative w-16 h-16 md:w-24 md:h-24">
        <svg
          className="w-full h-full -rotate-90"
          viewBox="0 0 40 40"
          aria-hidden="true"
        >
          <circle
            cx="20"
            cy="20"
            r={circleRadius}
            stroke="#e5e7eb"
            strokeWidth="4"
            fill="none"
          />
          <circle
            cx="20"
            cy="20"
            r={circleRadius}
            stroke="#1d9bf0"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-[stroke-dashoffset] duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-base md:text-xl font-bold text-[#111827]">
            {Math.round(displayPercent)}%
          </span>
        </div>
      </div>
      <div className="text-[11px] md:text-sm font-semibold text-[#111827] text-center">
        {label}
      </div>
      <div className="text-[10px] md:text-xs text-[#6b7280] text-center">
        {value} / {total}
      </div>
    </div>
  );
}

// ---- Main Component ----

export default function OverviewTab({ course }: OverviewTabProps) {
  const students = course.students ?? [];

  // Derive robust stats from your mock shape
  const totalSessions =
    course.totalSessions ||
    course.stats.totalSessions ||
    course.sessions.length ||
    0;

  const sessionsCompleted = course.stats.sessionsCompleted ?? 0;
  const sessionsCompletedPercent =
    course.stats.sessionsCompletedPercent ??
    (totalSessions > 0
      ? Math.round((sessionsCompleted / totalSessions) * 100)
      : 0);

  const materialsAvailable =
    course.stats.materialsAvailable ?? course.resources.length ?? 0;

  const totalMaterials =
    course.stats.totalMaterials ??
    Math.max(materialsAvailable, course.resources.length ?? 0);

  const materialsAvailablePercent =
    course.stats.materialsAvailablePercent ??
    (totalMaterials > 0
      ? Math.round((materialsAvailable / totalMaterials) * 100)
      : 0);

  const attendancePercent = course.stats.attendancePercent ?? 0;
  const sessionsPresent =
    course.stats.sessionsPresent ??
    (totalSessions > 0
      ? Math.round((attendancePercent / 100) * totalSessions)
      : 0);

  const nextSessionTitle =
    course.nextSession?.topic || "Design Thinking Workshop";
  const nextSessionLabel = formatNextSessionLabel(course.nextSession);

  const nextSessionDescription =
    "Join us live to explore the core principles of innovative problem-solving and user-centric design.";

  return (
    <div className="flex flex-col gap-10 w-full">
      {/* Top row: next session + batch info */}
      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,2.1fr)_minmax(0,1fr)] gap-6 items-stretch w-full">
        {/* Next Session Card */}
        <div className="flex flex-col h-full">
          <div className="bg-[var(--card)] rounded-3xl px-6 py-6 md:px-8 md:py-7 shadow-sm border border-[#e5e7eb] flex flex-col md:flex-row gap-6 md:gap-8 items-center h-full hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
            <div className="flex-1 min-w-0">
              <div className="text-[10px] md:text-[11px] font-semibold text-[#1d9bf0] mb-2 tracking-[0.12em] uppercase">
                Next Live Session
              </div>
              <div className="text-xl md:text-[26px] font-bold mb-3 leading-tight text-[#111827]">
                {nextSessionTitle}
              </div>
              <div className="text-xs md:text-sm text-[#6b7280] mb-4 leading-relaxed max-w-xl">
                {nextSessionDescription}
              </div>

              <div className="flex items-center gap-2 text-xs md:text-sm text-[#4b5563] mb-5">
                <div className="flex items-center justify-center w-7 h-7 rounded-full bg-[#e5f3ff] text-[#1d9bf0]">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-4 h-4"
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="8" />
                    <path d="M12 8v4l2.5 2.5" />
                  </svg>
                </div>
                <span>
                  Starts in:{" "}
                  <span className="font-semibold text-[#111827]">
                    {nextSessionLabel}
                  </span>
                </span>
              </div>

              <button className="inline-flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 rounded-full bg-[#e5f3ff] text-[#1d9bf0] font-medium text-xs md:text-sm shadow-sm hover:bg-[#d5eaff] hover:shadow-md active:translate-y-[1px] transition-all duration-200">
                <span>
                  <svg
                    viewBox="0 0 24 24"
                    className="w-4 h-4"
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="5" width="18" height="14" rx="3" />
                    <path d="M10 9l5 3-5 3z" />
                  </svg>
                </span>
                <span>Join Session</span>
              </button>
            </div>

            <div className="w-32 h-32 md:w-44 md:h-44 rounded-3xl bg-gradient-to-br from-[#f5e1b8] via-[#c8a676] to-[#8c6239] flex items-center justify-center overflow-hidden shadow-sm">
              {course.nextSession?.image ? (
                <Image
                  src={course.nextSession.image}
                  alt="Session"
                  width={176}
                  height={176}
                  className="object-cover w-full h-full rounded-3xl"
                />
              ) : (
                <div
                  className="w-full h-full"
                  style={{
                    background:
                      "radial-gradient(circle at 60% 40%, #f5e1b8 0%, #c8a676 35%, #8c6239 100%)",
                  }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Batch Info Card */}
        <div className="bg-[var(--card)] rounded-3xl px-6 py-6 md:px-8 md:py-7 shadow-sm border border-[#e5e7eb] flex flex-col gap-4 h-full justify-center hover:-translate-y-1 hover:shadow-md transition-all duration-300">
          <h2 className="text-base md:text-lg font-semibold text-[#111827]">
            Batch Information
          </h2>
          <div className="space-y-2 text-xs md:text-sm">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[#6b7280]">Batch ID:</span>
              <span className="font-medium text-[#111827]">
                {course.code || "-"}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-[#6b7280]">Start Date:</span>
              <span className="font-medium text-[#111827]">
                {course.duration.split(" to ")[0] || "-"}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-[#6b7280]">End Date:</span>
              <span className="font-medium text-[#111827]">
                {course.duration.split(" to ")[1] || "-"}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-[#6b7280]">Instructor:</span>
              <span className="font-medium text-[#111827]">
                {course.trainer || "-"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row: progress + cohort */}
      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,2.1fr)_minmax(0,1fr)] gap-6 items-stretch w-full">
        {/* Progress Section */}
        <div className="flex flex-col gap-3 md:gap-4">
          <h2 className="text-base md:text-lg font-semibold text-[#111827]">
            Your Progress
          </h2>

          {/* Always 3 side-by-side cards; smaller on mobile */}
          <div className="grid grid-cols-3 gap-3 md:gap-6">
            <ProgressCard
              percent={sessionsCompletedPercent}
              label="Sessions Completed"
              value={sessionsCompleted}
              total={totalSessions}
            />
            <ProgressCard
              percent={materialsAvailablePercent}
              label="Materials Available"
              value={materialsAvailable}
              total={totalMaterials}
            />
            <ProgressCard
              percent={attendancePercent}
              label="Attendance"
              value={sessionsPresent}
              total={totalSessions}
            />
          </div>
        </div>

        {/* Cohort Card */}
        <div className="bg-[var(--card)] rounded-3xl px-6 py-6 md:px-8 md:py-7 shadow-sm border border-[#e5e7eb] flex flex-col gap-4 md:gap-5 h-full justify-center hover:-translate-y-1 hover:shadow-md transition-all duration-300">
          <h2 className="text-base md:text-lg font-semibold text-[#111827]">
            Your Creative Cohort
          </h2>
          <div className="flex flex-wrap gap-3 md:gap-4">
            {students.slice(0, 11).map((mateId, idx) => (
              <div
                key={mateId ?? idx}
                className="w-9 h-9 md:w-12 md:h-12 rounded-full bg-[#e5f3ff] border border-[#cbd5f5] flex items-center justify-center overflow-hidden shadow-sm hover:scale-105 transition-transform duration-200"
              >
                <span className="text-xs md:text-sm font-semibold text-[#111827]">
                  {mateId?.[0]?.toUpperCase() || "S"}
                </span>
              </div>
            ))}
            {students.length > 11 && (
              <div className="w-9 h-9 md:w-12 md:h-12 rounded-full bg-[#f3f4f6] border border-[#e5e7eb] flex items-center justify-center text-[10px] md:text-xs font-semibold text-[#4b5563] hover:scale-105 transition-transform duration-200">
                +{students.length - 11}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
