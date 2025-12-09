"use client";
import React from "react";
import Image from "next/image";
import { BookOpen } from "lucide-react";
import type { CourseCard } from "@/components/dashboard/CourseCards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TrainerCoursesPageProps {
  courses: CourseCard[];
  trainerId: string;
}

export default function TrainerCoursesPage({
  courses,
}: TrainerCoursesPageProps) {
  const getStatusVariant = (status: string): string => {
    const normalized = status.toLowerCase();
    if (normalized === "active")
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    if (normalized === "upcoming")
      return "bg-sky-100 text-sky-700 border-sky-200";
    if (normalized === "completed")
      return "bg-slate-100 text-slate-700 border-slate-200";
    return "bg-slate-100 text-slate-700 border-slate-200";
  };

  return (
    <main className="w-full min-h-[calc(100vh-64px)] bg-[var(--background)]">
      <div className="mx-auto max-w-6xl px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 sm:mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold flex items-center gap-2 text-[var(--card-foreground)]">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
                <BookOpen className="w-4 h-4" />
              </span>
              <span>My Courses</span>
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-[var(--muted-foreground)]">
              Manage and track your training sessions
            </p>
          </div>
        </div>

        {/* Grid */}
        {courses.length === 0 ? (
          <Card className="border-dashed border-slate-200 bg-[var(--card)]/70">
            <CardContent className="py-8 flex flex-col items-center justify-center text-center gap-2">
              <BookOpen className="w-6 h-6 text-slate-400" />
              <p className="text-sm text-[var(--muted-foreground)]">
                You are not assigned to any courses yet.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {courses.map((course) => {
              const accentColor = course.color || "#e5e7eb";
              return (
                <a
                  key={course.id}
                  href={`/trainer/batch-detail/${course.id}`}
                  className="block"
                  style={{ textDecoration: "none" }}
                >
                  <Card className="bg-[var(--card)] border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-[2px] transition-all duration-200 rounded-2xl sm:rounded-3xl cursor-pointer">
                    <CardHeader className="pb-3 sm:pb-4">
                      <div className="flex items-start justify-between gap-3">
                        {/* Logo + title */}
                        <div className="flex items-start gap-3">
                          <div
                            className="h-9 w-9 sm:h-10 sm:w-10 rounded-2xl flex items-center justify-center shadow-sm border border-white/60 overflow-hidden"
                            style={{ backgroundColor: accentColor }}
                          >
                            {course.logo ? (
                              <Image
                                src={course.logo}
                                alt={course.name}
                                width={28}
                                height={28}
                                className="object-contain"
                              />
                            ) : (
                              <span className="text-xs font-semibold text-slate-700">
                                {course.name?.[0] ?? "C"}
                              </span>
                            )}
                          </div>
                          <div className="space-y-1">
                            <CardTitle className="text-sm sm:text-base md:text-lg font-semibold line-clamp-2">
                              {course.name}
                            </CardTitle>
                            <p className="text-[10px] sm:text-xs text-[var(--muted-foreground)]">
                              Code:{" "}
                              <span className="font-medium text-[var(--card-foreground)]">
                                {course.code}
                              </span>
                            </p>
                          </div>
                        </div>

                        {/* Status */}
                        {course.status && (
                          <Badge
                            variant="outline"
                            className={`border text-[10px] sm:text-xs rounded-full px-2 py-0.5 ${getStatusVariant(
                              course.status
                            )}`}
                          >
                            {course.status}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
                      {/* Schedule and duration */}
                      <div className="space-y-1 text-[11px] sm:text-xs">
                        {course.schedule && (
                          <p className="text-[var(--muted-foreground)]">
                            Schedule:{" "}
                            <span className="font-medium text-[var(--card-foreground)]">
                              {course.schedule}
                            </span>
                          </p>
                        )}
                        {course.duration && (
                          <p className="text-[var(--muted-foreground)]">
                            Duration:{" "}
                            <span className="font-medium text-[var(--card-foreground)]">
                              {course.duration}
                            </span>
                          </p>
                        )}
                      </div>

                      {/* Description */}
                      {course.description && (
                        <p className="text-[11px] sm:text-xs text-[var(--muted-foreground)] line-clamp-3">
                          {course.description}
                        </p>
                      )}

                      {/* Meta row */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100/80 mt-2">
                        {typeof course.totalSessions === "number" && (
                          <span className="text-[10px] sm:text-xs text-[var(--muted-foreground)]">
                            Total sessions:{" "}
                            <span className="font-medium text-[var(--card-foreground)]">
                              {course.totalSessions}
                            </span>
                          </span>
                        )}
                        {Array.isArray(course.students) &&
                          course.students.length > 0 && (
                            <span className="text-[10px] sm:text-xs text-[var(--muted-foreground)]">
                              {course.students.length} student
                              {course.students.length > 1 ? "s" : ""}
                            </span>
                          )}
                      </div>
                    </CardContent>
                  </Card>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
