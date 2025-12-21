"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, CheckCircle2, XCircle, Circle } from "lucide-react";

type AttendanceStatus = "Present" | "Absent" | "Not Marked";

interface AttendanceRecord {
  date: string; 
  topic: string;
  status: AttendanceStatus | string;
}

interface CourseStats {
  attendancePercent?: number;
  sessionsPresent?: number;
  sessionsAbsent?: number;
}

interface CourseWithAttendance {
  name?: string;
  stats?: CourseStats;
  attendance?: AttendanceRecord[];
}

interface AttendanceTabProps {
  course: CourseWithAttendance;
}

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function normalizeStatus(status: AttendanceStatus | string): AttendanceStatus {
  if (status === "Present") return "Present";
  if (status === "Absent") return "Absent";
  if (status === "Not Marked") return "Not Marked";
  // fallback
  return "Not Marked";
}

function formatFullDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(date);
}

function formatMonthYear(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function getDayKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function buildMonthGrid(baseMonth: Date): (Date | null)[] {
  // We’ll return 42 cells (6 weeks * 7 days)
  const year = baseMonth.getFullYear();
  const month = baseMonth.getMonth(); // 0–11

  const firstOfMonth = new Date(year, month, 1);
  const firstWeekday = firstOfMonth.getDay(); // 0 = Sun

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (Date | null)[] = [];

  // Leading empty cells
  for (let i = 0; i < firstWeekday; i += 1) {
    cells.push(null);
  }

  // Month days
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(new Date(year, month, day));
  }

  // Trailing empty cells
  while (cells.length < 42) {
    cells.push(null);
  }

  return cells;
}

export default function AttendanceTab({ course }: AttendanceTabProps) {
  const stats = course.stats ?? {};
  const attendance = React.useMemo(
    () => course.attendance ?? [],
    [course.attendance]
  );

  const presentCount =
    typeof stats.sessionsPresent === "number"
      ? stats.sessionsPresent
      : attendance.filter((a) => normalizeStatus(a.status) === "Present")
          .length;

  const absentCount =
    typeof stats.sessionsAbsent === "number"
      ? stats.sessionsAbsent
      : attendance.filter((a) => normalizeStatus(a.status) === "Absent").length;

  const totalSessions = presentCount + absentCount || attendance.length || 0;

  const attendancePercent =
    typeof stats.attendancePercent === "number"
      ? stats.attendancePercent
      : totalSessions > 0
      ? Math.round((presentCount / totalSessions) * 100)
      : 0;

  // Build lookup map by date
  const attendanceByDate = React.useMemo(() => {
    const map = new Map<string, AttendanceRecord>();
    attendance.forEach((rec) => {
      const key = rec.date.slice(0, 10);
      map.set(key, rec);
    });
    return map;
  }, [attendance]);

  const initialDate = React.useMemo(() => {
    if (attendance.length > 0) {
      const parsed = new Date(attendance[0].date);
      if (!Number.isNaN(parsed.getTime())) {
        return parsed;
      }
    }
    return new Date();
  }, [attendance]);

  const [currentMonth, setCurrentMonth] = React.useState<Date>(
    new Date(initialDate.getFullYear(), initialDate.getMonth(), 1)
  );
  const [selectedDate, setSelectedDate] = React.useState<Date>(initialDate);

  const selectedKey = getDayKey(selectedDate);
  const selectedRecord = attendanceByDate.get(selectedKey);

  const handleMonthChange = (delta: number) => {
    setCurrentMonth((prev) => {
      const next = new Date(prev.getFullYear(), prev.getMonth() + delta, 1);
      return next;
    });
  };

  const monthCells = buildMonthGrid(currentMonth);

  return (
    <div className="flex flex-col gap-6 md:gap-8 w-full">
      {/* Header row */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            My Attendance
          </h1>
        </div>
        <Button
          type="button"
          className="self-start md:self-auto rounded-full px-4 md:px-5 py-2 text-xs md:text-sm gap-2 bg-foreground text-background hover:bg-foreground/90"
        >
          <Download className="w-4 h-4" />
          <span>Export Report</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1.6fr)] gap-6 md:gap-8 items-start">
        {/* Left column (summary + selected day) */}
        <div className="flex flex-col gap-4 md:gap-5">
          {/* Overall attendance card */}
          <Card className="rounded-2xl md:rounded-3xl shadow-sm border-border bg-card">
            <CardHeader className="pb-2 md:pb-3">
              <CardTitle className="text-xs md:text-sm font-semibold text-muted-foreground">
                Overall Attendance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 md:space-y-4">
              <div className="text-2xl md:text-4xl font-bold text-foreground">
                {attendancePercent}%
              </div>
              <div className="w-full h-1.5 md:h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-1.5 md:h-2 rounded-full bg-green-500 transition-all duration-500"
                  style={{ width: `${attendancePercent}%` }}
                />
              </div>
              <div className="flex gap-2 md:gap-4 mt-1 md:mt-2">
                <Card className="flex-1 rounded-xl md:rounded-2xl border-border bg-card shadow-sm">
                  <CardContent className="py-2 px-2 md:py-3 md:px-4 flex flex-col gap-0.5 md:gap-1">
                    <span className="text-[10px] md:text-xs text-muted-foreground">
                      Attended
                    </span>
                    <span className="text-base md:text-xl font-semibold text-foreground">
                      {presentCount}
                    </span>
                  </CardContent>
                </Card>
                <Card className="flex-1 rounded-xl md:rounded-2xl border-border bg-card shadow-sm">
                  <CardContent className="py-2 px-2 md:py-3 md:px-4 flex flex-col gap-0.5 md:gap-1">
                    <span className="text-[10px] md:text-xs text-muted-foreground">
                      Missed
                    </span>
                    <span className="text-base md:text-xl font-semibold text-foreground">
                      {absentCount}
                    </span>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Selected day card */}
          <Card className="rounded-2xl md:rounded-3xl shadow-sm border-border bg-card">
            <CardContent className="py-3 px-3 md:py-5 md:px-5 space-y-2 md:space-y-4">
              <div>
                <p className="text-[11px] md:text-sm font-semibold text-foreground">
                  {formatFullDate(selectedDate)}
                </p>
                <p className="text-[10px] md:text-xs text-muted-foreground mt-1">
                  {selectedRecord
                    ? selectedRecord.status === "Present"
                      ? "You were present for this class."
                      : "You were absent for this class."
                    : "No attendance record found for this date."}
                </p>
              </div>

              {selectedRecord && (
                <div className="flex items-start gap-2 md:gap-3 rounded-xl md:rounded-2xl border border-border bg-muted/50 px-2 py-2 md:px-3 md:py-3">
                  <div className="mt-0.5">
                    {normalizeStatus(selectedRecord.status) === "Present" ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                  <div className="space-y-0.5 md:space-y-1">
                    <p className="text-[11px] md:text-sm font-semibold text-foreground">
                      {selectedRecord.topic}
                    </p>
                    <p className="text-[10px] md:text-xs text-muted-foreground">
                      Status: {normalizeStatus(selectedRecord.status)}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column (calendar) */}
        <Card className="rounded-2xl md:rounded-3xl shadow-sm border-border bg-card">
          <CardContent className="p-3 md:p-6">
            {/* Month header + legend */}
            <div className="flex flex-col gap-2 md:gap-3 md:flex-row md:items-center md:justify-between mb-3 md:mb-5">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleMonthChange(-1)}
                  className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-xs text-muted-foreground hover:bg-muted"
                  aria-label="Previous month"
                >
                  ‹
                </button>
                <span className="text-xs md:text-base font-semibold text-foreground">
                  {formatMonthYear(currentMonth)}
                </span>
                <button
                  type="button"
                  onClick={() => handleMonthChange(1)}
                  className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-xs text-muted-foreground hover:bg-muted"
                  aria-label="Next month"
                >
                  ›
                </button>
              </div>

              <div className="flex items-center gap-2 md:gap-4 text-[10px] md:text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  <span>Present</span>
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span>Absent</span>
                </span>
              </div>
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1 md:gap-2 text-[10px] md:text-xs mb-2 text-muted-foreground">
              {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => (
                <div key={d} className="text-center font-medium tracking-tight">
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 md:gap-2 text-[10px] md:text-xs">
              {monthCells.map((cell, idx) => {
                if (!cell) {
                  return <div key={idx} />;
                }

                const day = cell.getDate();
                const cellKey = getDayKey(cell);
                const rec = attendanceByDate.get(cellKey);
                const status = rec ? normalizeStatus(rec.status) : null;

                const isSelected = getDayKey(selectedDate) === cellKey;

                let bgClasses = "bg-transparent";
                let borderClasses = "border-transparent";
                let textClasses = "text-foreground";

                if (status === "Present") {
                  bgClasses = "bg-green-100 dark:bg-green-900/40";
                  textClasses = "text-green-700 dark:text-green-300";
                } else if (status === "Absent") {
                  bgClasses = "bg-red-100 dark:bg-red-900/40";
                  textClasses = "text-red-700 dark:text-red-300";
                }

                if (isSelected) {
                  borderClasses = "border-sky-500";
                }

                return (
                  <button
                    key={cellKey}
                    type="button"
                    onClick={() => setSelectedDate(cell)}
                    className={cn(
                      "relative w-7 h-7 md:w-9 md:h-9 rounded-full flex items-center justify-center border text-[10px] md:text-xs transition-all",
                      bgClasses,
                      borderClasses,
                      textClasses,
                      "hover:border-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/20"
                    )}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            {/* Optional dotted next-day circle like mock (today + 1) */}
            <div className="mt-3 md:mt-4 flex items-center gap-1 md:gap-2 text-[10px] md:text-xs text-muted-foreground">
              <Circle className="w-3 h-3" />
              <span>Dates without attendance are unmarked.</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
