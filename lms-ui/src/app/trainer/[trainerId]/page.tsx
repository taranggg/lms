"use client";
import React from "react";
import { useParams } from "next/navigation";
import TrainerDashboardComponent, {
  type HourSpent,
} from "@/components/trainer/TrainerDashboard";
import { trainers } from "@/mock/trainer/trainers_courses";
import { type TodoMainTask } from "@/components/dashboard/TodoList";
import { type CourseCard } from "@/components/dashboard/CourseCards";

// Mock data for missing props
const mockHoursSpent: HourSpent[] = [
  { month: "Jan", teaching: 40, preparation: 20 },
  { month: "Feb", teaching: 35, preparation: 25 },
  { month: "Mar", teaching: 45, preparation: 15 },
  { month: "Apr", teaching: 50, preparation: 10 },
  { month: "May", teaching: 42, preparation: 18 },
];

const mockTodoList: TodoMainTask[] = [
  {
    label: "Review Assignments",
    category: "Grading",
    dateTime: "27 Nov 2025, 10:00 AM",
    checked: false,
    subtasks: [
        { label: "Batch A - React Hooks", checked: false },
        { label: "Batch B - CSS Grid", checked: false }
    ]
  },
  {
    label: "Prepare for Next Session",
    category: "Preparation",
    dateTime: "28 Nov 2025, 09:00 AM",
    checked: false,
    subtasks: []
  },
];

export default function TrainerDashboard() {
  const { trainerId } = useParams();
  const trainer = trainers.find(
    (t) => String(t.id) === String(trainerId)
  );

  if (!trainer) {
    return <div className="p-8 text-center">Trainer not found.</div>;
  }

  // Map mock courses to CourseCard type
  const courses: CourseCard[] = trainer.courses.map((c) => ({
    id: c.id,
    name: c.name,
    code: c.id,
    status: "Active",
    trainer: trainer.name,
    schedule: c.schedule,
    duration: c.duration,
    totalSessions: c.totalSessions,
    description: c.description,
    students: ["Student 1", "Student 2", "Student 3", "Student 4", "Student 5"], // Mock students
    assignments: c.assignments,
    attendance: [],
    resources: c.resources.map(r => ({...r, uploaded: "2025-10-20", by: trainer.name})),
    sessions: [],
    stats: {
      sessionsCompleted: 10,
      materialsAvailable: 5,
      attendancePercent: 85,
    },
    nextSession: {
       date: "2025-11-20",
       time: "10:00 AM",
       topic: "Advanced React Patterns"
    },
    color: "#e0f2fe", // Default color
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg", // Mock logo
  }));

  return (
    <TrainerDashboardComponent
      trainer={{ name: trainer.name }}
      courses={courses}
      // hoursSpent prop is removed from component definition in TrainerDashboard.tsx, so we can omit it here or mock it if strictly required by types, 
      // but I updated the interface in the previous step to not require it in the exported component props if I didn't change the export type.
      // Wait, let's check TrainerDashboardProps in the previous file.
      // It still has hoursSpent in TrainerDashboardProps but the component function destructuring didn't use it.
      // To satisfy Typescript if still required:
      hoursSpent={mockHoursSpent}
      todoList={mockTodoList}
      trainerId={String(trainerId)}
    />
  );
}
