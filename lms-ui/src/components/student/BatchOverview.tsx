import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, Calendar, PlayCircle } from "lucide-react";

export default function BatchOverview({ batch }: { batch: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
      <Card className="col-span-2 bg-[var(--card)] text-[var(--card-foreground)]">
        <CardHeader>
          <CardTitle>Batch Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-2">
            <div className="flex items-center gap-2 text-sm">
              <Users size={16} /> <span>Trainer:</span>
              <span className="font-medium ml-1">{batch.trainer}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar size={16} /> <span>Schedule:</span>
              <span className="font-medium ml-1">{batch.schedule}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar size={16} /> <span>Duration:</span>
              <span className="font-medium ml-1">{batch.duration}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <PlayCircle size={16} /> <span>Total Sessions:</span>
              <span className="font-medium ml-1">{batch.totalSessions}</span>
            </div>
          </div>
          <div className="mt-2 text-sm">
            <span className="font-medium">Description</span>
            <div className="text-[var(--muted-foreground)]">
              {batch.description}
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-[var(--card)] text-[var(--card-foreground)]">
        <CardHeader>
          <CardTitle>Next Session</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-full">
          <Calendar size={32} className="mb-2 text-[var(--muted-foreground)]" />
          <div className="text-[var(--muted-foreground)]">
            No upcoming sessions
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
