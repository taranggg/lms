import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle } from "lucide-react";

export default function BatchSessions({ sessions }: { sessions: any[] }) {
  return (
    <div className="mt-6">
      <div className="text-[var(--muted-foreground)] mb-2">
        {sessions.length} sessions scheduled
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-[var(--muted)]">
              <th className="py-2 px-4 text-left font-medium">Date</th>
              <th className="py-2 px-4 text-left font-medium">Time</th>
              <th className="py-2 px-4 text-left font-medium">Topic</th>
              <th className="py-2 px-4 text-left font-medium">Recording</th>
              <th className="py-2 px-4 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session, idx) => (
              <tr key={idx} className="border-b">
                <td className="py-2 px-4">{session.date}</td>
                <td className="py-2 px-4">{session.time}</td>
                <td className="py-2 px-4 font-medium">{session.topic}</td>
                <td className="py-2 px-4">
                  {session.recording === "Available" ? (
                    <span className="px-2 py-1 rounded-full bg-[var(--color-badge-active,#18181b)] text-[var(--color-badge-active-text,#fff)] text-xs font-medium">
                      Available
                    </span>
                  ) : (
                    <span className="text-[var(--muted-foreground)]">N/A</span>
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
  );
}
