"use client";
import React from "react";
import StudentCoursesPage from "@/components/student/StudentCoursesPage";
import { useParams, useRouter } from "next/navigation";
import type { CourseCard } from "@/components/dashboard/CourseCards";

export default function Page() {
  const { studentId } = useParams();
  const router = useRouter();
  const [coursesList, setCoursesList] = React.useState<CourseCard[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadStudentCourses() {
      // Import mock data statically (or lazily if needed, but static is fine here)
      const { students } = await import("@/mock/student/students_mock");
      const { courses: allCourses } = await import("@/mock/course/courses_mock");

      if (typeof window !== "undefined") {
        const sid = Array.isArray(studentId) ? studentId[0] : studentId;
        
        // Find the student
        const student = students.find(s => s.studentId === sid);
        
        if (!student) {
          // If student not found (or invalid format), redirect
          // But for now, if format is correct but not found, maybe handle gracefully?
          // Using the existing regex check from previous code:
          if (!sid || !/^stu\d+$/.test(sid)) {
             router.push("/student/login");
             return;
          }
          // If ID format is valid but student not in mock, maybe show empty? 
          // Previous code would fail to load file. Let's redirect if not found.
          if (!student) {
             console.error("Student not found in mock data");
             // Optional: router.push("/student/login");
             setLoading(false);
             return;
          }
        }

        if (student) {
           const studentCourseIds = student.courses;
           // Filter courses based on student's course list
           const studentCourses = allCourses.filter(c => studentCourseIds.includes(c.id));
           // Cast to CourseCard types if needed, assuming mocks match structure
           setCoursesList(studentCourses as unknown as CourseCard[]);
        }
        setLoading(false);
      }
    }
    loadStudentCourses();
  }, [studentId, router]);

  if (loading) return <div className="p-8">Loading...</div>;
  const sid = Array.isArray(studentId) ? studentId[0] : studentId;
  return <StudentCoursesPage courses={coursesList} studentId={sid || ""} />;
}
