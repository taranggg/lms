"use client";
import React from "react";
import StudentResourcesPage from "@/components/student/StudentResourcesPage";
import { useParams, useRouter } from "next/navigation";
import type { CourseCard } from "@/components/dashboard/CourseCards";
export type Resource = CourseCard["resources"][number];

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
        const mod = await import(
          `@/mock/student/student${sid.replace("stu", "")}.json`
        );
        const studentData = mod.default;
        const courseIds = studentData.courses;
        const coursePromises = courseIds.map((id: string) =>
          import(`@/mock/course/${id}.json`).then((c) => c.default)
        );
        const courseDetails = await Promise.all(coursePromises);
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
