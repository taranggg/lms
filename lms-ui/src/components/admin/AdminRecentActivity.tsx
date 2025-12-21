import React from "react";
import { cn } from "@/lib/utils";

interface AdminRecentActivityProps {
  activity: { type: string; detail: string }[];
}

export default function AdminRecentActivity({
  activity,
}: AdminRecentActivityProps) {
  return (
    <div className="relative pl-4 space-y-8">
      {/* Vertical Line */}
      <div className="absolute left-[19px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-transparent via-gray-200 dark:via-gray-800 to-transparent" />

      {activity.map((a, idx) => (
        <div key={idx} className="relative flex items-start gap-6 group">
          {/* Dot */}
          <div className={cn(
            "w-3 h-3 rounded-full mt-1.5 shrink-0 z-10 ring-4 ring-white dark:ring-black",
            idx % 3 === 0 ? "bg-blue-500" : idx % 3 === 1 ? "bg-green-500" : "bg-orange-500"
          )} />
          
          <div className="flex-1">
            <h4 className="font-semibold text-foreground text-sm mb-1">{a.type}</h4>
            <p className="text-muted-foreground text-sm leading-relaxed">{a.detail}</p>
             {/* Example extra UI for the first item to match image style (avatars/badges) */}
             {idx === 0 && (
                <div className="flex items-center gap-2 mt-3">
                   <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white dark:border-black" />
                      <div className="w-8 h-8 rounded-full bg-slate-300 border-2 border-white dark:border-black" />
                      <div className="w-8 h-8 rounded-full bg-slate-400 border-2 border-white dark:border-black flex items-center justify-center text-[10px] font-bold text-white">
                        +2
                      </div>
                   </div>
                </div>
             )}
             {idx === 1 && (
                 <div className="mt-2">
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        ✓ Certification Issued
                    </span>
                 </div>
             )}
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {idx === 0 ? "2 hours ago" : idx === 1 ? "Yesterday" : "2 days ago"}
          </span>
        </div>
      ))}
    </div>
  );
}
