"use client";
import React from "react";
import StudentResourcesPage from "@/components/student/StudentResourcesPage";
import { useParams, useRouter } from "next/navigation";
import type { CourseCard } from "@/components/dashboard/CourseCards";
export type Resource = CourseCard["resources"][number];
import { students } from "@/mock/student/students_mock";
import { courses } from "@/mock/course/courses_mock";

export default function Page() {
  const { studentId } = useParams();
  const router = useRouter();
  const [resources, setResources] = React.useState<Resource[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadStudentResources() {
      if (typeof window !== "undefined") {
        const sid = Array.isArray(studentId) ? studentId[0] : studentId;
        if (!sid || !/^stu\d+$/.test(sid)) {
          router.push("/student/login");
          return;
        }
        // Find student in mock array
        const student = students.find((s) => s.studentId === sid) || null;
        if (!student) {
          router.push("/student/login");
          return;
        }
        const courseDetails = student.courses
          .map((id: string) => courses.find((c) => c.id === id))
          .filter(Boolean);
        // Aggregate resources from all courses
        const allResources = courseDetails.flatMap(
          (course) => course.resources || []
        );
        setResources(allResources);
        setLoading(false);
      }
    }
    loadStudentResources();
  }, [studentId, router]);

  if (loading) return <div className="p-8">Loading...</div>;
  return <StudentResourcesPage resources={resources} />;
}
