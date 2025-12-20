import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import TrainerBatchList, { type Batch } from "./TrainerBatchList";
import AttendanceReportWidget from "./AttendanceReportWidget";

interface TrainerBatchesWithAttendanceProps {
  batches: Batch[];
  trainerId: string;
}

export default function TrainerBatchesWithAttendance({
  batches,
  trainerId,
}: TrainerBatchesWithAttendanceProps) {
  return (
    <div className="w-full mt-6 pb-10">
      <div className="flex flex-col lg:flex-row gap-4 items-start">
        {/* Batches List Section - Takes more space */}
        <div className="flex-1 w-full min-w-0">
             <Card className="shadow-sm border-slate-100">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-slate-800">My Batches</CardTitle>
                </CardHeader>
                <CardContent>
                    <TrainerBatchList batches={batches} trainerId={trainerId} />
                </CardContent>
             </Card>
        </div>

        {/* Attendance Widget - Fixed width or smaller share */}
        <div className="w-full lg:w-[300px] shrink-0 sticky top-4">
           <AttendanceReportWidget />
        </div>
      </div>
    </div>
  );
}
