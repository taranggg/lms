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
    <div className="bg-white rounded-xl p-6 shadow flex-1">
      <div className="font-semibold mb-2">Performance</div>
      <div className="flex items-center gap-4">
        <div className="w-24 h-24 rounded-full border-8 border-teal-400 flex items-center justify-center text-2xl font-bold text-teal-700">
          {points}
        </div>
        <div>
          <div className="text-sm text-gray-500">Your Point</div>
          <div className="text-lg font-semibold">{points}</div>
          <div className="text-xs text-teal-500">{rank}</div>
        </div>
      </div>
    </div>
  );
}
