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

  // Map mock courses to Batch type
  const batches = trainer.courses.map((c) => ({
    id: c.id,
    name: c.name,
    code: c.id,
    schedule: c.schedule,
    students: 25, // Mock number
    active: true,
    color: "#e0f2fe", // Default color
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg", // Mock logo
    instructor: trainer.name,
    branch: "Online", // Mock dynamic branch
  }));

  return (
    <TrainerDashboardComponent
      trainer={{ name: trainer.name, designation: trainer.role }}
      batches={batches}
      todoList={mockTodoList}
      trainerId={String(trainerId)}
    />
  );
}
