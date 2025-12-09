"use client";

import React from "react";
import { BookOpen, Download, Link as LinkIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CourseCard } from "@/components/dashboard/CourseCards";

export type Resource = CourseCard["resources"][number];

interface TrainerResourcesPageProps {
  resources: Resource[];
}

const typeColorMap: Record<string, string> = {
  pdf: "bg-rose-100 text-rose-700 border-rose-200",
  video: "bg-indigo-100 text-indigo-700 border-indigo-200",
  link: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

export default function TrainerResourcesPage({
  resources,
}: TrainerResourcesPageProps) {
  const getTypeClasses = (type: string): string => {
    const base = "border px-2 py-0.5 rounded-full text-[10px] font-medium";
    const classes =
      typeColorMap[type.toLowerCase()] ??
      "bg-slate-100 text-slate-700 border-slate-200";
    return `${base} ${classes}`;
  };

  return (
    <main className="w-full min-h-[calc(100vh-64px)] bg-[var(--background)]">
      <div className="mx-auto max-w-6xl px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 sm:mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold flex items-center gap-2 text-[var(--card-foreground)]">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-sky-100 text-sky-600">
                <BookOpen className="w-4 h-4" />
              </span>
              <span>Resources</span>
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-[var(--muted-foreground)]">
              Manage and share course materials with your students
            </p>
          </div>
        </div>

        {/* Grid */}
        {resources.length === 0 ? (
          <Card className="border-dashed border-slate-200 bg-[var(--card)]/70">
            <CardContent className="py-8 flex flex-col items-center justify-center text-center gap-2">
              <BookOpen className="w-6 h-6 text-slate-400" />
              <p className="text-sm text-[var(--muted-foreground)]">
                No resources available yet. Upload materials for your students.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {resources.map((resource, idx) => (
              <Card
                key={`${resource.name}-${idx}`}
                className="bg-[var(--card)] border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-[2px] transition-all duration-200 rounded-2xl sm:rounded-3xl"
              >
                <CardHeader className="pb-2 sm:pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-sm sm:text-base md:text-lg font-semibold line-clamp-2">
                      {resource.name}
                    </CardTitle>
                    <span className={getTypeClasses(resource.type)}>
                      {resource.type}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
                  <div className="flex flex-col gap-1 text-[11px] sm:text-xs text-[var(--muted-foreground)]">
                    <span>
                      Uploaded:{" "}
                      <span className="font-medium text-[var(--card-foreground)]">
                        {resource.uploaded}
                      </span>
                    </span>
                    <span>
                      By:{" "}
                      <span className="font-medium text-[var(--card-foreground)]">
                        {resource.by}
                      </span>
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href={resource.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] sm:text-xs text-sky-600 hover:text-sky-700 hover:underline"
                    >
                      <LinkIcon className="w-3.5 h-3.5" />
                      Open resource
                    </a>

                    {/* Optional tag-style badge */}
                    <Badge
                      variant="outline"
                      className="text-[10px] sm:text-[11px] rounded-full px-2 py-0.5 border-slate-200 text-slate-600 bg-slate-50/60"
                    >
                      {resource.type === "video"
                        ? "Video content"
                        : resource.type === "pdf"
                        ? "Document"
                        : "Reference"}
                    </Badge>
                  </div>

                  <div className="pt-1 flex justify-between items-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 sm:px-3 text-[11px] sm:text-xs text-sky-600 hover:text-sky-700 hover:bg-sky-50"
                      asChild
                    >
                      <a
                        href={resource.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download className="w-3.5 h-3.5 mr-1" />
                        Download
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
