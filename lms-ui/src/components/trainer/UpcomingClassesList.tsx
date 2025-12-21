import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Video, CalendarOff, Ban } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

// Mock data type
export interface ClassSession {
  id: string;
  title: string;
  batch: string;
  time: string; // ISO string or distinct time
  status: "upcoming" | "live" | "completed";
  duration: string;
}

const mockClasses: ClassSession[] = [
  {
    id: "1",
    title: "React Hooks Deep Dive",
    batch: "Web Dev Batch A",
    time: "10:00 AM Today",
    status: "live",
    duration: "90 min",
  },
  {
    id: "2",
    title: "CSS Grid Masterclass",
    batch: "Frontend Batch B",
    time: "02:00 PM Today",
    status: "upcoming",
    duration: "60 min",
  },
  {
    id: "3",
    title: "Intro to Python",
    batch: "Data Science Batch A",
    time: "04:00 PM Today",
    status: "upcoming",
    duration: "120 min",
  },
    {
    id: "0",
    title: "HTML Basics (Completed)",
    batch: "Web Dev Batch A",
    time: "09:00 AM Today",
    status: "completed",
    duration: "60 min",
  },
];

export default function UpcomingClassesList() {
  // Sort: Live first, then Upcoming, then Completed (moved to end or separate section conceptually, but user wanted "left move" logic so keeping array sort)
  // Actually, standard "Upcoming" lists usually show Live -> Upcoming. 
  // The user prompt mentioned "upcoming course cards".
  const sortedClasses = [...mockClasses].sort((a, b) => {
      const order = { live: 0, upcoming: 1, completed: 2 };
      return order[a.status] - order[b.status];
  });

  // pastel colors for tinting
  const getBatchColor = (batchName: string) => {
      const colors = ["#3b82f6", "#8b5cf6", "#ec4899", "#10b981", "#f59e0b"]; // Stronger base colors for tinting
      let hash = 0;
      for (let i = 0; i < batchName.length; i++) {
        hash = batchName.charCodeAt(i) + ((hash << 5) - hash);
      }
      return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
          Today's Schedule
        </h2>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
          View Calendar
        </Button>
      </div>
      
      <ScrollArea className="w-full whitespace-nowrap pb-4">
        <div className="flex w-max space-x-5 p-1">
          {sortedClasses.map((session) => {
            const baseColor = getBatchColor(session.batch);
            const isCompleted = session.status === "completed";
            const isLive = session.status === "live";

            return (
              <div
                key={session.id}
                className={`
                  group relative rounded-2xl p-5 min-w-[260px] max-w-[280px]
                  transition-all duration-300 ease-out
                  hover:-translate-y-2 hover:shadow-xl
                  border border-white/20 dark:border-white/10
                  ${isCompleted ? "opacity-60 grayscale-[0.5]" : "backdrop-blur-xl"}
                `}
                style={{
                  background: isCompleted 
                    ? "rgba(241, 245, 249, 0.6)" 
                    : `linear-gradient(145deg, ${baseColor}15, ${baseColor}05)`,
                  boxShadow: isLive 
                    ? `0 10px 30px -10px ${baseColor}40` 
                    : "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                }}
              >
                {/* Glass Shine Effect on Hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/0 via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                {/* Top Badge Row */}
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div 
                    className="p-2.5 rounded-xl text-white shadow-lg shadow-black/5 transition-transform group-hover:scale-110 duration-300"
                    style={{ backgroundColor: isCompleted ? "#94a3b8" : baseColor }}
                  >
                    <Video size={18} />
                  </div>
                  
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border shadow-sm backdrop-blur-md ${
                      isLive
                        ? "bg-red-500/10 text-red-600 border-red-200 animate-pulse dark:text-red-400 dark:border-red-900/50"
                        : isCompleted
                        ? "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
                        : "bg-white/40 text-slate-600 border-white/30 dark:text-slate-300 dark:bg-white/5"
                    }`}
                  >
                    {isLive ? "● Live Now" : session.status}
                  </span>
                </div>

                {/* Content */}
                <div className="space-y-1 mb-4 relative z-10">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 truncate leading-tight" title={session.title}>
                      {session.title}
                    </h3>
                    <p className="text-sm font-medium text-slate-500/90 dark:text-slate-400 truncate">
                      {session.batch}
                    </p>
                </div>

                {/* Time & Duration Pill */}
                <div className="flex items-center gap-3 text-xs font-medium text-slate-600 dark:text-slate-400 mb-5 relative z-10">
                   <div className="flex items-center gap-1.5 bg-white/40 dark:bg-white/5 px-2.5 py-1 rounded-md border border-white/20 dark:border-white/10">
                      <Clock size={12} className="text-slate-400" />
                      <span>{session.time}</span>
                   </div>
                   <span className="text-slate-300 dark:text-slate-600">•</span>
                   <span>{session.duration}</span>
                </div>

                {/* Actions */}
                <div className="relative z-10 mt-auto pt-2 border-t border-white/10 dark:border-white/5">
                  {isCompleted ? (
                     <Button size="sm" variant="ghost" className="w-full text-xs h-9 bg-slate-100/50 hover:bg-slate-100 text-slate-500 cursor-not-allowed dark:bg-slate-800 dark:text-slate-400">
                      View Recording
                     </Button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        className={`flex-1 text-xs h-9 font-semibold shadow-lg transition-all active:scale-95 ${
                          isLive
                            ? "bg-red-500 hover:bg-red-600 text-white shadow-red-200 dark:shadow-none"
                            : "bg-white hover:bg-slate-50 text-slate-700 shadow-slate-200 border border-slate-100 dark:bg-slate-800 dark:text-white dark:border-slate-700 dark:hover:bg-slate-700 dark:shadow-none"
                        }`}
                      >
                        {isLive ? "Join Class" : "Prepare"}
                      </Button>
                       <Button
                        size="icon"
                        variant="ghost"
                        className="h-9 w-9 rounded-full text-slate-400 hover:text-slate-600 hover:bg-white/40 dark:hover:bg-white/10 dark:hover:text-slate-300"
                      >
                        <CalendarOff size={16} />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" className="hidden" />
      </ScrollArea>
    </div>
  );
}
