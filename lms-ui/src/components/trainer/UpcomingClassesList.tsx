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
  // Sort: Completed first (for left move effect), then Live, then Upcoming
  // In a real app, logic might auto-move completed items to the far left or hide them.
  // Here we show them on the left as requested "move left automatically".
  const sortedClasses = [...mockClasses].sort((a, b) => {
      const order = { completed: 0, live: 1, upcoming: 2 };
      return order[a.status] - order[b.status];
  });

  // Assign random pastel colors for demo consistency
  const getBatchColor = (batchName: string) => {
      const colors = ["#E0F2FE", "#ECFCCB", "#F3E8FF", "#FFE4E6", "#FEF3C7"];
      let hash = 0;
      for (let i = 0; i < batchName.length; i++) {
        hash = batchName.charCodeAt(i) + ((hash << 5) - hash);
      }
      return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold mb-3 text-slate-800 px-1">
        Today's Schedule
      </h2>
      <ScrollArea className="w-full whitespace-nowrap rounded-xl pb-2">
        <div className="flex w-max space-x-4 p-1 pb-4">
          {sortedClasses.map((session) => (
            <div
              key={session.id}
              className={`rounded-xl p-4 flex flex-col gap-2 shadow-sm min-w-[220px] max-w-[240px] border border-slate-100 hover:shadow-md transition relative ${
                  session.status === "completed" ? "opacity-70 grayscale-[0.5]" : ""
              }`}
              style={{
                  background: session.status === "completed" ? "#f8fafc" : getBatchColor(session.batch)
              }}
            >
              {/* Status Badge - Floating */}
              <div className="absolute top-3 right-3">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      session.status === "live"
                        ? "bg-white/80 text-red-600 animate-pulse border border-red-100"
                        : session.status === "completed"
                        ? "bg-slate-200 text-slate-600"
                        : "bg-white/60 text-sky-700"
                    }`}
                  >
                    {session.status === "live" ? "Live" : session.status}
                  </span>
              </div>

              {/* Icon / Logo Area */}
              <div className="flex items-center justify-center mt-2 mb-1">
                 <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-500">
                    <Video size={18} />
                 </div>
              </div>

              {/* Title & Batch */}
              <div className="text-center mb-1">
                  <h3 className="font-semibold text-base text-slate-900 truncate px-1" title={session.title}>
                    {session.title}
                  </h3>
                  <p className="text-xs text-slate-600 truncate px-2 font-medium">
                    {session.batch}
                  </p>
              </div>

               {/* Time Info */}
               <div className="flex items-center justify-center gap-2 text-xs text-slate-700 mb-3 bg-white/40 mx-auto px-3 py-1 rounded-full w-fit">
                  <Clock size={12} />
                  <span>{session.time}</span>
                  <span>•</span>
                  <span>{session.duration}</span>
               </div>

              {/* Actions Footer */}
              <div className="mt-auto flex flex-col gap-2">
                {session.status === "completed" ? (
                   <Button size="sm" variant="outline" className="w-full text-xs h-8 bg-white/50 border-transparent" disabled>
                    Class Ended
                   </Button>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      className={`flex-1 text-xs h-8 shadow-sm ${
                        session.status === "live"
                          ? "bg-red-600 hover:bg-red-700 text-white border-0"
                          : "bg-white hover:bg-white/80 text-sky-700 border border-sky-100"
                      }`}
                    >
                      {session.status === "live" ? "Join Now" : "Start Class"}
                    </Button>
                     <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-slate-500 hover:bg-white/50"
                      title="More Options"
                    >
                      <CalendarOff size={14} />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
