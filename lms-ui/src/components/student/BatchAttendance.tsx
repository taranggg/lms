import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BadgeCheck } from "lucide-react";
import type { BatchStats, AttendanceRecord } from "@/types/student/type";

export interface BatchAttendanceProps {
  stats: BatchStats & { sessionsPresent: number; sessionsAbsent: number };
  attendance: AttendanceRecord[];
}

export default function BatchAttendance({
  stats,
  attendance,
}: BatchAttendanceProps) {
  return (
    <div className="mt-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-[var(--card)] text-[var(--card-foreground)] flex flex-col items-center justify-center">
          <div className="text-2xl font-bold">{stats.attendancePercent}%</div>
          <div className="text-sm text-[var(--muted-foreground)]">
            Overall Attendance
          </div>
        </Card>
        <Card className="bg-[var(--card)] text-[var(--card-foreground)] flex flex-col items-center justify-center">
          <div className="text-2xl font-bold">{stats.sessionsPresent}</div>
          <div className="text-sm text-[var(--muted-foreground)]">
            Sessions Present
          </div>
        </Card>
        <Card className="bg-[var(--card)] text-[var(--card-foreground)] flex flex-col items-center justify-center">
          <div className="text-2xl font-bold">{stats.sessionsAbsent}</div>
          <div className="text-sm text-[var(--muted-foreground)]">
            Sessions Absent
          </div>
        </Card>
      </div>
      <Card className="bg-[var(--card)] text-[var(--card-foreground)] rounded-2xl border border-[var(--muted)]">
        <CardHeader className="flex flex-row items-center justify-between pb-0">
          <CardTitle>Attendance Record</CardTitle>
          <Button
            size="sm"
            variant="outline"
            className="flex items-center gap-2 px-3 py-1 rounded-lg"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 2V12M9 12L5 8M9 12L13 8M3 16H15"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Export
          </Button>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm bg-transparent">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-4 text-left font-semibold text-base">
                    Date
                  </th>
                  <th className="py-3 px-4 text-left font-semibold text-base">
                    Topic
                  </th>
                  <th className="py-3 px-4 text-left font-semibold text-base">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {attendance.map((record, idx) => (
                  <tr key={idx} className="border-b last:border-none">
                    <td className="py-3 px-4 align-middle whitespace-nowrap">
                      {record.date}
                    </td>
                    <td className="py-3 px-4 align-middle whitespace-nowrap">
                      {record.topic}
                    </td>
                    <td className="py-3 px-4 align-middle whitespace-nowrap">
                      {record.status === "Present" ? (
                        <div className="flex flex-row items-center gap-2">
                          <BadgeCheck size={16} className="text-green-500" />
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--color-badge-active,#18181b)] text-[var(--color-badge-active-text,#fff)] text-sm font-medium">
                            Present
                          </span>
                        </div>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)] text-sm font-medium">
                          {record.status === "Absent" ? "Absent" : "Not Marked"}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
