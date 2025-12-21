import React from "react";

export default function PerformanceGauge({
  points,
  rank,
}: {
  points: number;
  rank: string;
}) {
  // For demo, use a simple gauge
  return (
    <div className="bg-white/50 dark:bg-card/40 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-[2rem] p-8 shadow-sm flex-1 flex flex-col justify-center">
      <div className="font-bold text-xl mb-4 text-slate-800 dark:text-slate-100">Performance</div>
      <div className="flex items-center gap-6">
        <div className="relative w-32 h-32 rounded-full flex items-center justify-center">
             {/* Background Ring */}
             <div className="absolute inset-0 rounded-full border-[8px] border-teal-100 dark:border-teal-900/30"></div>
             {/* Active Ring (simulated with border-t/r) */}
             <div className="absolute inset-0 rounded-full border-[8px] border-teal-500 border-l-transparent border-b-transparent rotate-45"></div>
             
             <div className="text-3xl font-bold text-teal-600 dark:text-teal-400">
                {points}
             </div>
        </div>
        <div>
          <div className="text-sm font-medium text-slate-500 dark:text-slate-400">Your Point</div>
          <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">{points}</div>
          <div className="text-xs font-semibold text-teal-600 dark:text-teal-400 mt-1 px-2 py-0.5 bg-teal-50 dark:bg-teal-900/40 rounded-full inline-block">
             {rank}
          </div>
        </div>
      </div>
    </div>
  );
}
