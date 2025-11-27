import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface AdminRecentActivityProps {
  activity: { type: string; detail: string }[];
}

export default function AdminRecentActivity({
  activity,
}: AdminRecentActivityProps) {
  return (
    <Card className="bg-[var(--card)] text-[var(--card-foreground)]">
      <CardHeader>
        <CardTitle className="text-[var(--card-foreground)]">
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {activity.map((a, idx) => (
            <li
              key={idx}
              className="p-2 rounded bg-[var(--muted)] text-[var(--card-foreground)]"
            >
              <strong>{a.type}: </strong>
              <span>{a.detail}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
