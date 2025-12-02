"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { Users, FileText, Calendar, BadgeCheck } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { Course } from "@/components/student/course-detail/OverviewTab";
import ResourcesTab from "@/components/student/course-detail/ResourcesTab";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import OverviewTab from "@/components/student/course-detail/OverviewTab";
import SessionsTab from "@/components/student/course-detail/SessionsTab";
import AttendanceTab from "@/components/student/course-detail/AttendanceTab";
import StudentNavbar from "@/components/student/StudentNavbar";

import { students } from "@/mock/student/students_mock";
import { courses } from "@/mock/course/courses_mock";

function useStudentData(studentId: string) {
  return students.find((s) => s.studentId === studentId) || null;
}

function useCourseData(courseId: string) {
  return courses.find((c) => c.id === courseId) || null;
}

export default function StudentCourseDetail() {
  const router = useRouter();
  const params = useParams();

  const studentId =
    (Array.isArray(params.studentId)
      ? params.studentId[0]
      : params.studentId) ?? "";
  const courseId =
    (Array.isArray(params.courseId) ? params.courseId[0] : params.courseId) ??
    "";

  const [tab, setTab] = React.useState("overview");

  const student = useStudentData(studentId);
  const course = useCourseData(courseId);

  React.useEffect(() => {
    if (
      typeof window !== "undefined" &&
      !window.localStorage.getItem("student_logged_in")
    ) {
      router.push("/student/login");
    }
  }, [router]);

  if (!course || !student) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-lg text-[var(--muted-foreground)]">
          Loading...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      <StudentNavbar studentId={studentId} />

      <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 max-w-6xl mx-auto pb-8">
        {/* Breadcrumbs */}
        <Breadcrumb className="my-3 sm:my-4 text-[9px] sm:text-xs whitespace-nowrap overflow-x-auto max-w-full truncate">
          <BreadcrumbList>
            <BreadcrumbItem className="my-3 sm:my-4 text-[9px] sm:text-xs whitespace-nowrap overflow-x-auto max-w-full truncate">
              <BreadcrumbLink href={`/student/${studentId}`}>
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem className="my-3 sm:my-4 text-[9px] sm:text-xs whitespace-nowrap overflow-x-auto max-w-full truncate">
              <BreadcrumbLink href={`/student/${studentId}/courses`}>
                Courses
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem className="my-3 sm:my-4 text-[9px] sm:text-xs whitespace-nowrap overflow-x-auto max-w-full truncate">
              <BreadcrumbLink href="#" className="font-semibold">
                {course.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Title Section */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--card-foreground)] break-words">
            {course.name}
          </h1>
          <p className="text-[var(--muted-foreground)] text-sm sm:text-base mt-1 break-words max-w-3xl">
            {course.description ||
              "Master the art of creating intuitive and beautiful user experiences."}
          </p>
        </div>

        <Tabs value={tab} onValueChange={setTab} className="my-3 sm:my-5">
          {/* Scrollable tab bar for mobile/tablet */}
          <div className="w-full overflow-x-auto">
            <TabsList className="inline-flex min-w-max gap-1 sm:gap-2 rounded-full bg-muted/60 px-1 py-1">
              <TabsTrigger
                value="overview"
                className="shrink-0 whitespace-nowrap px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm flex items-center gap-1"
              >
                <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Overview</span>
              </TabsTrigger>
              <TabsTrigger
                value="resources"
                className="shrink-0 whitespace-nowrap px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm flex items-center gap-1"
              >
                <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Resources</span>
              </TabsTrigger>
              <TabsTrigger
                value="sessions"
                className="shrink-0 whitespace-nowrap px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm flex items-center gap-1"
              >
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Sessions</span>
              </TabsTrigger>
              <TabsTrigger
                value="attendance"
                className="shrink-0 whitespace-nowrap px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm flex items-center gap-1"
              >
                <BadgeCheck className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>My Attendance</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Content */}
          <div className="mt-4 sm:mt-6">
            <TabsContent value="overview" className="mt-0">
              <OverviewTab course={course} />
            </TabsContent>
            <TabsContent value="resources" className="mt-0">
              <ResourcesTab course={course} />
            </TabsContent>
            <TabsContent value="sessions" className="mt-0">
              <SessionsTab course={course} />
            </TabsContent>
            <TabsContent value="attendance" className="mt-0">
              <AttendanceTab course={course} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
