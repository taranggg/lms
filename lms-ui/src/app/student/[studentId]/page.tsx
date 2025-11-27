"use client";
import React from "react";
import type { CourseCard } from "@/components/dashboard/CourseCards";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import StudentDashboardComponent, {
  StudentDashboardProps,
} from "@/components/student/StudentDashboard";

export default function StudentDashboard() {
  const router = useRouter();
  const { studentId } = useParams();
  type Student = {
    studentId: string;
    name: string;
    email: string;
    courses: string[];
    notifications: string[];
    recentActivity: string[];
  };
  const [student, setStudent] = React.useState<Student | null>(null);
  const [courses, setCourses] = React.useState<CourseCard[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadStudentAndBatches() {
      if (typeof window !== "undefined") {
        const sid = Array.isArray(studentId) ? studentId[0] : studentId;
        if (!sid || !/^stu\d+$/.test(sid)) {
          router.push("/student/login");
          return;
        }
        const mod = await import(
          `@/mock/student/student${sid.replace("stu", "")}.json`
        );
        const studentData = mod.default;
        setStudent(studentData);

        // Load course details dynamically
        const courseIds = studentData.courses;
        const coursePromises = courseIds.map((id: string) =>
          import(`@/mock/course/${id}.json`).then((c) => c.default)
        );
        const courseDetails = await Promise.all(coursePromises);
        setCourses(courseDetails);
        setLoading(false);
      }
    }
    loadStudentAndBatches();
  }, [studentId, router]);

  const hoursSpent: StudentDashboardProps["hoursSpent"] = [
    { month: "Jan", study: 40, exams: 20 },
    { month: "Feb", study: 20, exams: 20 },
    { month: "Mar", study: 60, exams: 30 },
    { month: "Apr", study: 55, exams: 32 },
    { month: "May", study: 30, exams: 20 },
  ];
  const leaderboard: StudentDashboardProps["leaderboard"] = [
    {
      rank: 1,
      name: "Charlie Rawal",
      course: "53",
      hour: 250,
      point: 13450,
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    {
      rank: 2,
      name: "Ariana Agarwal",
      course: "88",
      hour: 212,
      point: 10333,
      avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    },
  ];
  const todoList: StudentDashboardProps["todoList"] = [
    {
      label: "Developing Restaurant Apps",
      category: "Programming",
      dateTime: "27 Nov 2025, 08:00 AM",
      checked: false,
      subtasks: [
        { label: "Slicing Home Screen", checked: false },
        { label: "Integrate API", checked: false },
      ],
    },
    {
      label: "Research Objective User",
      category: "Product Design",
      dateTime: "27 Nov 2025, 02:40 PM",
      checked: false,
      subtasks: [],
    },
    {
      label: "Report Analysis P2P-Business",
      category: "Business",
      dateTime: "27 Nov 2025, 04:50 PM",
      checked: true,
      subtasks: [],
    },
  ];

  if (loading || !student) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-lg text-[var(--muted-foreground)]">
          Loading...
        </span>
      </div>
    );
  }
  return (
    <StudentDashboardComponent
      student={{ name: student.name }}
      courses={courses}
      hoursSpent={hoursSpent}
      leaderboard={leaderboard}
      todoList={todoList}
      studentId={student.studentId}
    />
  );
}
