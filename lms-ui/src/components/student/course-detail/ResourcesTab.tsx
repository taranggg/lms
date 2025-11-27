"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SlidersHorizontal,
  ArrowUpDown,
  PlayCircle,
  BookOpen,
  Folder,
} from "lucide-react";

type ResourceType = "video" | "reading" | "source" | "pdf" | string;

interface CourseResource {
  name: string;
  type: ResourceType; // "video", "reading", "source", "pdf", etc.
  link: string;
  uploaded: string; // date string (any format – we’ll just display it)
  by: string;
  thumbnail?: string;
}

interface CourseWithResources {
  resources?: CourseResource[];
}

type ResourcesTabProps = {
  course: CourseWithResources;
};

type FilterKey = "all" | "videos" | "readings" | "sourceFiles";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "videos", label: "Videos" },
  { key: "readings", label: "Readings" },
  { key: "sourceFiles", label: "Source Files" },
];

type SortKey = "newest" | "oldest" | "title";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function mapFilterToPredicate(filter: FilterKey) {
  return (res: CourseResource) => {
    const type = res.type.toLowerCase();
    switch (filter) {
      case "videos":
        return type === "video";
      // treat both "reading" and "pdf" as readings
      case "readings":
        return type === "reading" || type === "pdf";
      case "sourceFiles":
        return type === "source" || type === "source files" || type === "asset";
      case "all":
      default:
        return true;
    }
  };
}

function getTypeIcon(type: ResourceType) {
  const t = type.toLowerCase();
  if (t === "video") return <PlayCircle className="w-4 h-4" />;
  if (t === "reading" || t === "pdf") return <BookOpen className="w-4 h-4" />;
  return <Folder className="w-4 h-4" />;
}

function getTypeLabel(type: ResourceType): string {
  const t = type.toLowerCase();
  if (t === "video") return "Video";
  if (t === "reading") return "Reading";
  if (t === "pdf") return "Reading"; // treat pdf as reading
  if (t === "source" || t === "source files") return "Source Files";
  return type.toString();
}

function sortResources(
  resources: CourseResource[],
  sortBy: SortKey
): CourseResource[] {
  const copy = [...resources];
  if (sortBy === "title") {
    copy.sort((a, b) => a.name.localeCompare(b.name));
    return copy;
  }
  if (sortBy === "newest" || sortBy === "oldest") {
    copy.sort((a, b) => {
      const da = new Date(a.uploaded).getTime() || 0;
      const db = new Date(b.uploaded).getTime() || 0;
      return sortBy === "newest" ? db - da : da - db;
    });
    return copy;
  }
  return copy;
}

export default function ResourcesTab({ course }: ResourcesTabProps) {
  const [filter, setFilter] = React.useState<FilterKey>("all");
  const [sortBy, setSortBy] = React.useState<SortKey>("newest");

  const rawResources = React.useMemo(
    () => course.resources ?? [],
    [course.resources]
  );

  const filteredResources = React.useMemo(
    () => rawResources.filter(mapFilterToPredicate(filter)),
    [rawResources, filter]
  );

  const resources = React.useMemo(
    () => sortResources(filteredResources, sortBy),
    [filteredResources, sortBy]
  );

  return (
    <div className="flex flex-col gap-6 md:gap-8 w-full">
      {/* Header row */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#020817]">
            Course Materials
          </h1>
        </div>

        <div className="flex items-center gap-2 md:gap-3 self-start md:self-auto">
          {/* Filter by (placeholder – you can wire real logic later) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full px-3 md:px-4 text-xs md:text-sm gap-2"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filter by</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => setFilter("all")}>
                All materials
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setFilter("videos")}>
                Videos
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setFilter("readings")}>
                Readings
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setFilter("sourceFiles")}>
                Source Files
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Sort by */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full px-3 md:px-4 text-xs md:text-sm gap-2"
              >
                <ArrowUpDown className="w-4 h-4" />
                <span>Sort by</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Sort</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => setSortBy("newest")}>
                Newest first
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setSortBy("oldest")}>
                Oldest first
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setSortBy("title")}>
                Title A–Z
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Category chips */}
      <div className="flex flex-wrap gap-2 md:gap-3">
        {FILTERS.map((f) => (
          <Button
            key={f.key}
            type="button"
            size="sm"
            variant={filter === f.key ? "default" : "outline"}
            className={cn(
              "rounded-full px-4 py-1 text-xs md:text-sm",
              filter === f.key
                ? "bg-[#020817] text-white hover:bg-[#020817]/90"
                : "bg-[#f4f4f5] text-[#4b5563] border-transparent hover:bg-[#e4e4e7]"
            )}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </Button>
        ))}
      </div>

      {/* Resources grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
        {resources.map((res) => {
          const typeLabel = getTypeLabel(res.type);
          const icon = getTypeIcon(res.type);

          return (
            <a
              key={`${res.name}-${res.uploaded}-${res.by}`}
              href={res.link}
              target="_blank"
              rel="noreferrer"
              className="group relative overflow-hidden rounded-2xl aspect-[3/4] shadow-sm bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#020617] text-white"
            >
              {/* Background image / placeholder */}
              <div className="absolute inset-0">
                {/* If you add real thumbnails later, plug them in here */}
                {res.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={res.thumbnail}
                    alt={res.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
                )}
                {/* dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
              </div>

              {/* Card content */}
              <div className="relative h-full flex flex-col justify-between p-3 md:p-4">
                {/* Top: type pill */}
                <div className="flex items-center gap-2 text-[11px] md:text-xs font-medium text-slate-100">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-black/40 backdrop-blur-sm">
                    {icon}
                    <span>{typeLabel}</span>
                  </span>
                </div>

                {/* Bottom: title + meta */}
                <div className="space-y-1 md:space-y-2">
                  <h3 className="text-sm md:text-base font-semibold leading-snug line-clamp-2">
                    {res.name}
                  </h3>
                  <p className="text-[10px] md:text-xs text-slate-200/80 line-clamp-2">
                    Uploaded {res.uploaded} by {res.by}
                  </p>
                </div>
              </div>

              {/* Hover highlight */}
              <div className="absolute inset-0 ring-0 ring-sky-400/0 group-hover:ring-2 group-hover:ring-sky-400/70 transition-all duration-300 rounded-3xl" />
            </a>
          );
        })}

        {resources.length === 0 && (
          <div className="col-span-full flex items-center justify-center py-12">
            <p className="text-sm text-muted-foreground">
              No materials found for this filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
