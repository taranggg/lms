import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import BatchList from "@/components/batches/BatchList";
import AttendanceReportWidget from "./AttendanceReportWidget";
import { useAuth } from "@/Context/AuthContext";

interface TrainerBatchesWithAttendanceProps {
  trainerId: string;
}

export default function TrainerBatchesWithAttendance({
  trainerId,
}: TrainerBatchesWithAttendanceProps) {
  const { token } = useAuth();
  
  if (!token) return null;

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
                   <div className="max-h-[800px] overflow-y-auto custom-scrollbar p-6">
                      <BatchList 
                        mode="trainer"
                        token={token} 
                        userId={trainerId}
                        compact={true}
                      />
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
