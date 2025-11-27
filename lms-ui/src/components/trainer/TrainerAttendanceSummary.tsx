import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface TrainerAttendanceSummaryProps {
  attendance: { date: string; present: number; absent: number }[];
}

export default function TrainerAttendanceSummary({
  attendance,
}: TrainerAttendanceSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {attendance.map((record, idx) => (
            <li
              key={idx}
              className="flex justify-between items-center p-2 rounded bg-gray-100"
            >
              <span>{record.date}</span>
              <span className="text-green-600">Present: {record.present}</span>
              <span className="text-red-600">Absent: {record.absent}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
