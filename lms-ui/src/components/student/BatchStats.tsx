import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function BatchStats({ stats }: { stats: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
      <Card className="bg-[var(--card)] text-[var(--card-foreground)] flex flex-col items-center justify-center">
        <div className="text-2xl font-bold">{stats.sessionsCompleted}</div>
        <div className="text-sm text-[var(--muted-foreground)]">
          Sessions Completed
        </div>
      </Card>
      <Card className="bg-[var(--card)] text-[var(--card-foreground)] flex flex-col items-center justify-center">
        <div className="text-2xl font-bold">{stats.materialsAvailable}</div>
        <div className="text-sm text-[var(--muted-foreground)]">
          Materials Available
        </div>
      </Card>
      <Card className="bg-[var(--card)] text-[var(--card-foreground)] flex flex-col items-center justify-center">
        <div className="text-2xl font-bold">{stats.attendancePercent}%</div>
        <div className="text-sm text-[var(--muted-foreground)]">Attendance</div>
      </Card>
    </div>
  );
}
