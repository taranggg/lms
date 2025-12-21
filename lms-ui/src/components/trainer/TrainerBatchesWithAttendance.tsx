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
      <div className="flex flex-col gap-8">
        {/* Batches List Section - Full Width */}
        <div className="w-full">
             <Card className="shadow-sm border-slate-100">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-slate-800">My Batches</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                   <div className="max-h-[600px] overflow-y-auto custom-scrollbar p-6">
                      <TrainerBatchList batches={batches} trainerId={trainerId} />
                   </div>
                </CardContent>
             </Card>
        </div>

        {/* Attendance Widget - Full Width, Stacked Below */}
        <div className="w-full">
           <AttendanceReportWidget />
        </div>
      </div>
    </div>
  );
}
