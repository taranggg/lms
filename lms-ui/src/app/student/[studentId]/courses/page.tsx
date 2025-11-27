"use client";
import React from "react";
import StudentCoursesPage from "@/components/student/StudentCoursesPage";
import { useParams, useRouter } from "next/navigation";
import type { CourseCard } from "@/components/dashboard/CourseCards";

export default function Page() {
  const { studentId } = useParams();
  const router = useRouter();
  const [courses, setCourses] = React.useState<CourseCard[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadStudentCourses() {
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
        setCourses(courseDetails);
        setLoading(false);
      }
    }
    loadStudentCourses();
  }, [studentId, router]);

  if (loading) return <div className="p-8">Loading...</div>;
  return <StudentCoursesPage courses={courses} />;
}
