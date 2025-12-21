"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Clock3,
  Radio,
  CheckCircle2,
  FileText,
  Presentation,
  Video,
} from "lucide-react";

type SessionStatus = "upcoming" | "live" | "completed";

interface CourseSession {
  date: string; // e.g. "2025-11-24"
  time: string; // e.g. "10:00 AM"
  topic: string;
  recording?: string;
  description?: string;
  status?: SessionStatus; // optional; we’ll derive if missing
  hasSlides?: boolean;
  hasNotes?: boolean;
  hasProjectFiles?: boolean;
}

interface CourseWithSessions {
  sessions?: CourseSession[];
}

type SessionsTabProps = {
  course: CourseWithSessions;
};

type FilterKey = "all" | SessionStatus;

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All Sessions" },
  { key: "upcoming", label: "Upcoming" },
  { key: "live", label: "Live" },
  { key: "completed", label: "Completed" },
];

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function deriveStatus(session: CourseSession): SessionStatus {
  if (session.status) return session.status;

  const today = new Date();
  const dateOnly = new Date(session.date);

  if (Number.isNaN(dateOnly.getTime())) {
    // fallback
    return "upcoming";
  }

  const todayMidnight = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const sessionMidnight = new Date(
    dateOnly.getFullYear(),
    dateOnly.getMonth(),
    dateOnly.getDate()
  );

  if (sessionMidnight.getTime() > todayMidnight.getTime()) return "upcoming";
  if (sessionMidnight.getTime() < todayMidnight.getTime()) return "completed";
  return "live";
}

// ... (imports remain the same)

function statusBadgeClasses(status: SessionStatus) {
  if (status === "upcoming") return "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"; // purple
  if (status === "live") return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"; // red
  return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"; // green
}

function statusLabel(status: SessionStatus) {
  if (status === "upcoming") return "Upcoming";
  if (status === "live") return "Live";
  return "Completed";
}

function statusIcon(status: SessionStatus) {
  if (status === "upcoming")
    return <Clock3 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />;
  if (status === "live")
    return <Radio className="w-4 h-4 text-red-600 dark:text-red-400" aria-hidden="true" />;
  return <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" aria-hidden="true" />;
}

function primaryButtonProps(status: SessionStatus): {
  label: string;
  variantClasses: string;
} {
  if (status === "upcoming") {
    return {
      label: "Join Session",
      variantClasses:
        "bg-muted text-muted-foreground hover:bg-muted/80 border border-border",
    };
  }
  if (status === "live") {
    return {
      label: "Join Live Session",
      variantClasses: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
    };
  }
  return {
    label: "Watch Recording",
    variantClasses: "bg-foreground text-background hover:bg-foreground/90 shadow-sm",
  };
}

export default function SessionsTab({ course }: SessionsTabProps) {
  const [filter, setFilter] = React.useState<FilterKey>("all");
  const [search, setSearch] = React.useState("");

  const rawSessions = course.sessions ?? [];

  const sessionsWithStatus: (CourseSession & {
    statusResolved: SessionStatus;
  })[] = rawSessions.map((s) => ({
    ...s,
    statusResolved: deriveStatus(s),
  }));

  const filteredSessions = sessionsWithStatus.filter((session, index) => {
    if (
      filter !== "all" &&
      session.statusResolved.toLowerCase() !== filter.toLowerCase()
    ) {
      return false;
    }

    if (!search.trim()) return true;

    const query = search.toLowerCase();
    const text = `${index + 1} ${session.topic} ${
      session.description ?? ""
    }`.toLowerCase();
    return text.includes(query);
  });

  return (
    <div className="flex flex-col gap-6 md:gap-8 w-full">
      {/* Top controls row */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Filter chips */}
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs md:text-sm font-medium border transition-colors",
                filter === f.key
                  ? "bg-foreground text-background border-transparent shadow-sm"
                  : "bg-muted text-muted-foreground border-transparent hover:bg-muted/80"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search sessions..."
            className="pl-9 rounded-full text-xs md:text-sm bg-background border-border"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Timeline list */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[14px] top-0 bottom-0 hidden sm:block">
          <div className="w-[2px] h-full bg-border" />
        </div>

        <div className="flex flex-col gap-6">
          {filteredSessions.map((session, index) => {
            const status = session.statusResolved;
            const badgeClass = statusBadgeClasses(status);
            const badgeLabel = statusLabel(status);
            const { label: ctaLabel, variantClasses } =
              primaryButtonProps(status);

            const sessionNumber = String(index + 1).padStart(2, "0");
            const description =
              session.description ??
              `Session on ${session.topic} covering key concepts and hands-on examples.`;

            const hasSlides = session.hasSlides ?? true; // default to true
            const hasNotes = session.hasNotes ?? true;
            const hasProjectFiles = session.hasProjectFiles ?? false;

            return (
              <div
                key={`${session.topic}-${session.date}-${session.time}`}
                className="flex gap-4 sm:gap-6"
              >
                {/* Timeline icon column */}
                <div className="flex flex-col items-center pt-1">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center bg-card border border-border shadow-sm z-10",
                      status === "upcoming" && "border-indigo-500/40",
                      status === "live" && "border-red-500/40",
                      status === "completed" && "border-green-500/40"
                    )}
                  >
                    {statusIcon(status)}
                  </div>
                  {/* Line segment (mobile only, because main line is hidden on xs) */}
                  <div className="block sm:hidden flex-1 w-[2px] bg-border mt-1" />
                </div>

                {/* Card */}
                <div className="flex-1 bg-card rounded-xl md:rounded-2xl border border-border shadow-sm px-3 py-3 md:px-6 md:py-5">
                  {/* Title row */}
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs md:text-base font-semibold text-foreground">
                        {sessionNumber}: {session.topic}
                      </span>
                      <span
                        className={cn(
                          "text-[10px] md:text-xs px-2 py-0.5 md:px-3 md:py-1 rounded-full font-medium inline-flex items-center gap-1",
                          badgeClass
                        )}
                      >
                        <span className="w-2 h-2 rounded-full bg-current opacity-80" />
                        {badgeLabel}
                      </span>
                    </div>
                  </div>

                  {/* Date / time row */}
                  <div className="mt-2 mb-2 inline-flex items-center gap-1 md:gap-2 rounded-full bg-muted px-2 py-1 md:px-3 md:py-1.5 text-[10px] md:text-xs font-medium text-muted-foreground">
                    <span className="font-semibold">{session.date}</span>
                    <span className="text-muted-foreground/50">|</span>
                    <span>{session.time}</span>
                  </div>

                  {/* Description */}
                  <p className="text-[11px] md:text-sm text-muted-foreground mb-3 md:mb-4 leading-relaxed">
                    {description}
                  </p>

                  {/* Actions row */}
                  <div className="flex flex-col gap-2 md:gap-3 md:flex-row md:items-center md:justify-between">
                    <Button
                      type="button"
                      className={cn(
                        "rounded-full px-3 md:px-5 py-1.5 md:py-2 text-[10px] md:text-sm inline-flex items-center gap-2",
                        variantClasses
                      )}
                    >
                      {status === "completed" ? (
                        <Video className="w-4 h-4" />
                      ) : (
                        <Clock3 className="w-4 h-4" />
                      )}
                      <span>{ctaLabel}</span>
                    </Button>

                    <div className="flex flex-wrap items-center gap-2 md:gap-3 text-[10px] md:text-xs text-muted-foreground">
                      {hasSlides && (
                        <span className="inline-flex items-center gap-1">
                          <Presentation className="w-3 h-3" />
                          <span>Slides</span>
                        </span>
                      )}
                      {hasNotes && (
                        <span className="inline-flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          <span>Notes</span>
                        </span>
                      )}
                      {hasProjectFiles && (
                        <span className="inline-flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          <span>Project Files</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredSessions.length === 0 && (
            <div className="py-10 text-center text-sm text-muted-foreground">
              No sessions found for this filter.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
