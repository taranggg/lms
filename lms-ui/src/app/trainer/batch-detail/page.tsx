import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import TrainerStudentList from "@/components/trainer/TrainerStudentList";
import TrainerAttendanceSummary from "@/components/trainer/TrainerAttendanceSummary";
import TrainerBatchResources from "@/components/trainer/TrainerBatchResources";
import TrainerBatchAnnouncements from "@/components/trainer/TrainerBatchAnnouncements";

export default function TrainerBatchDetail() {
  // Dummy data for UI
  const batch = {
    name: "Batch A",
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
            <Link href="/trainer/batches">
              <Button variant="outline">Back to Batches</Button>
            </Link>
            <Link href="/trainer/dashboard">
              <Button variant="outline">Dashboard</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
