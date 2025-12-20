"use client";
import React from "react";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Download, FileText, Bell } from "lucide-react";

// Inline placeholder components for missing files
function TrainerStudentList({ students }: { students: string[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Students</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {students.map((student, i) => (
            <li key={i} className="flex items-center gap-2 p-2 rounded hover:bg-slate-50">
              <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-semibold">
                {student.charAt(0)}
              </div>
              <span className="text-sm font-medium">{student}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function TrainerAttendanceSummary({ attendance }: { attendance: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Attendance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
           {attendance.map((record, i) => (
             <div key={i} className="flex justify-between items-center text-sm border-b pb-2 last:border-0">
               <span>{record.date}</span>
               <div className="flex gap-4">
                 <span className="text-emerald-600 font-medium">Present: {record.present}</span>
                 <span className="text-red-500">Absent: {record.absent}</span>
               </div>
             </div>
           ))}
        </div>
      </CardContent>
    </Card>
  );
}

function TrainerBatchResources({ resources }: { resources: any[] }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Resources</CardTitle>
        <Button size="sm" variant="ghost"><Plus size={16}/></Button>
      </CardHeader>
      <CardContent>
         {resources.map((res, i) => (
            <div key={i} className="flex items-center justify-between p-3 border rounded-lg mb-2">
               <div className="flex items-center gap-2">
                  <FileText className="text-blue-500 w-4 h-4"/>
                  <span className="text-sm font-medium">{res.name}</span>
               </div>
               <Button size="icon" variant="ghost" className="h-8 w-8"><Download size={14}/></Button>
            </div>
         ))}
      </CardContent>
    </Card>
  );
}

function TrainerBatchAnnouncements({ announcements }: { announcements: any[] }) {
   return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Announcements</CardTitle>
        <Button size="sm" variant="ghost">New</Button>
      </CardHeader>
      <CardContent>
         {announcements.map((ann, i) => (
            <div key={i} className="mb-4 last:mb-0">
               <div className="flex items-start gap-2">
                  <Bell className="w-4 h-4 text-amber-500 mt-1"/>
                  <div>
                    <h4 className="font-semibold text-sm">{ann.title}</h4>
                    <p className="text-xs text-muted-foreground">{ann.content}</p>
                  </div>
               </div>
            </div>
         ))}
      </CardContent>
    </Card>
   );
}


export default function TrainerBatchDetailPage() {
  const params = useParams();
  const trainerId = params.trainerId;
  const batchId = params.batchId;

  // Dummy data (replace with fetch based on batchId in real app)
  const batch = {
    name: "Batch " + batchId, // Dynamic name for demo
    schedule: "Mon, Wed, Fri - 5:00pm",
    students: ["Jane Doe", "John Doe", "Alice", "Bob"],
    attendance: [
      { date: "Nov 20, 2025", present: 18, absent: 2 },
      { date: "Nov 22, 2025", present: 19, absent: 1 },
    ],
    resources: [
      { name: "Algebra Notes", link: "#" },
      { name: "Biology Slides", link: "#" },
    ],
    announcements: [
      { title: "Exam Date", content: "Dec 10th, 2025" },
      { title: "Project Submission", content: "Submit by Dec 5th." },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex flex-col gap-6">
      <Card className="max-w-2xl mx-auto w-full">
        <CardHeader>
          <CardTitle className="text-2xl">{batch.name} Details</CardTitle>
          <div className="text-gray-500">Schedule: {batch.schedule}</div>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <TrainerStudentList students={batch.students} />
          <TrainerAttendanceSummary attendance={batch.attendance} />
          <TrainerBatchResources resources={batch.resources} />
          <TrainerBatchAnnouncements announcements={batch.announcements} />
          <div className="flex flex-wrap gap-2 mt-6">
            <Link href={`/trainer/${trainerId}`}>
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
