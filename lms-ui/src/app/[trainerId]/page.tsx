"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import TrainerDashboardComponent from "@/components/trainer/TrainerDashboard";
import type { Batch } from "@/types/trainer/type";
import type { CourseCard } from "@/components/dashboard/CourseCards";
import type { HourSpent } from "@/components/trainer/TrainerDashboard";
import type { TodoMainTask } from "@/components/dashboard/TodoList";
import { trainers as trainerData } from "@/mock/trainer/trainers_courses";

export default function TrainerDashboard() {
  const params = useParams();
  const router = useRouter();
  const trainerId = params?.trainerId as string;

  type Trainer = {
    trainerId: string;
    name: string;
    email: string;
    courses: CourseCard[];
    notifications: string[];
    recentActivity: string[];
  };

  const [trainer, setTrainer] = React.useState<Trainer | null>(null);
  const [courses, setCourses] = React.useState<CourseCard[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!trainerId) return;
    // Find trainer in mock array
    const foundTrainer = trainerData.find((t) => String(t.id) === trainerId);
    if (foundTrainer) {
      // Map courses to CourseCard format with all required fields
      const mappedCourses: CourseCard[] = foundTrainer.courses.map(
        (course) => ({
          id: course.id,
          name: course.name,
          code: course.id,
          logo: "",
          color: "#3b82f6",
          status: "Active",
          trainer: foundTrainer.name,
          schedule: course.schedule,
          duration: course.duration,
          totalSessions: course.totalSessions,
          description: course.description,
          students: [],
          assignments: course.assignments || 0,
          attendance: [],
          resources: (course.resources || []).map((r) => ({
            name: r.name,
            type: r.type,
            link: r.link,
            uploaded: "2025-12-01",
            by: foundTrainer.name,
          })),
          sessions: [],
          stats: {
            sessionsCompleted: 0,
            materialsAvailable: (course.resources || []).length,
            attendancePercent: 100,
          },
          nextSession: {
            date: "2025-12-10",
            time: "10:00 AM",
            topic: "Next Topic",
          },
        })
      );
      setTrainer({
        trainerId: String(foundTrainer.id),
        name: foundTrainer.name,
        email: foundTrainer.email,
        courses: mappedCourses,
        notifications: [],
        recentActivity: [],
      });
      setCourses(mappedCourses);
    } else {
      setTrainer(null);
      setCourses([]);
    }
    setLoading(false);
  }, [trainerId]);

  if (!trainerId || loading || !trainer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-lg text-[var(--muted-foreground)]">
          Loading...
        </span>
      </div>
    );
  }

  // Mock data for hours spent (teaching and preparation)
  const hoursSpent: HourSpent[] = [
    { month: "Jan", teaching: 45, preparation: 20 },
    { month: "Feb", teaching: 52, preparation: 25 },
    { month: "Mar", teaching: 48, preparation: 22 },
    { month: "Apr", teaching: 55, preparation: 28 },
    { month: "May", teaching: 50, preparation: 24 },
    { month: "Jun", teaching: 58, preparation: 30 },
  ];

  // Mock todo list
  const todoList: TodoMainTask[] = [
    {
      label: "Prepare lecture slides for Web Dev session",
      category: "Preparation",
      dateTime: new Date().toISOString(),
      checked: false,
      subtasks: [
        { label: "Review previous session notes", checked: true },
        { label: "Create new slides", checked: false },
      ],
    },
    {
      label: "Grade assignments for Batch A",
      category: "Grading",
      dateTime: new Date().toISOString(),
      checked: false,
    },
    {
      label: "Schedule 1-on-1 with struggling students",
      category: "Meeting",
      dateTime: new Date().toISOString(),
      checked: false,
    },
  ];

  return (
    <TrainerDashboardComponent
      trainer={{ name: trainer.name }}
      courses={courses}
      hoursSpent={hoursSpent}
      todoList={todoList}
      trainerId={trainer.trainerId}
    />
  );
}
