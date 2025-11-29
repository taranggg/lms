"use client"
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export default function TrainerMarkAttendance() {
  // Dummy data for UI
  const students = [
    { name: "Jane Doe", id: 1 },
    { name: "John Doe", id: 2 },
    { name: "Alice", id: 3 },
    { name: "Bob", id: 4 },
  ];
  const [attendance, setAttendance] = React.useState<{ [id: number]: boolean }>(
    {}
  );

  const handleToggle = (id: number) => {
    setAttendance((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex flex-col gap-6">
      <Card className="max-w-2xl mx-auto w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Mark Attendance</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <ul className="space-y-2">
            {students.map((student) => (
              <li
                key={student.id}
                className="flex items-center gap-4 p-2 rounded bg-gray-100"
              >
                <Checkbox
                  checked={!!attendance[student.id]}
                  onCheckedChange={() => handleToggle(student.id)}
                  id={`student-${student.id}`}
                />
                <label htmlFor={`student-${student.id}`} className="text-sm">
                  {student.name}
                </label>
              </li>
            ))}
          </ul>
          <Button className="mt-4 w-full">Submit Attendance</Button>
        </CardContent>
      </Card>
    </div>
  );
}
