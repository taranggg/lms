import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface AdminStatsProps {
  stats: {
    students: number;
    trainers: number;
    batches: number;
  };
}

export default function AdminStats({ stats }: AdminStatsProps) {
  return (
    <Card className="bg-[var(--card)] text-[var(--card-foreground)]">
      <CardHeader>
        <CardTitle>System Overview</CardTitle>
      </CardHeader>
      <CardContent className="flex gap-6 justify-between">
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-[var(--card-foreground)]">
            {stats.students}
          </span>
          <span className="text-sm text-[var(--muted-foreground)]">
            Students
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-[var(--card-foreground)]">
            {stats.trainers}
          </span>
          <span className="text-sm text-[var(--muted-foreground)]">
            Trainers
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-[var(--card-foreground)]">
            {stats.batches}
          </span>
          <span className="text-sm text-[var(--muted-foreground)]">
            Batches
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
