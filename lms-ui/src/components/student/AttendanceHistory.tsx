import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface AttendanceHistoryProps {
  attendance: { date: string; status: string }[];
}

export default function AttendanceHistory({
  attendance,
}: AttendanceHistoryProps) {
  return (
    <Card className="bg-[var(--card)] text-[var(--card-foreground)]">
      <CardHeader>
        <CardTitle>Attendance History</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {attendance.map((record, idx) => (
            <li
              key={idx}
              className="flex justify-between items-center p-2 rounded bg-[var(--muted)]"
            >
              <span>{record.date}</span>
              <span
                className={
                  record.status === "Present"
                    ? "text-[var(--color-attendance-present,#16a34a)]"
                    : "text-[var(--color-attendance-absent,#dc2626)]"
                }
              >
                {record.status}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
