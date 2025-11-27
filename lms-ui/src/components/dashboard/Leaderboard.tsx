import React from "react";

export type LeaderboardEntry = {
  rank: number;
  name: string;
  course: string;
  hour: number;
  point: number;
  avatar?: string;
};

export default function Leaderboard({
  entries,
}: {
  entries: LeaderboardEntry[];
}) {
  return (
    <div className="bg-white rounded-xl p-6 shadow mt-6">
      <div className="font-semibold mb-2">Leader Board</div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-gray-500">
            <th className="text-left">RANK</th>
            <th className="text-left">NAME</th>
            <th className="text-left">COURSE</th>
            <th className="text-left">HOUR</th>
            <th className="text-left">POINT</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.rank} className="border-t">
              <td>{entry.rank}</td>
              <td className="flex items-center gap-2 py-2">
                {entry.avatar && (
                  <img
                    src={entry.avatar}
                    alt={entry.name}
                    className="w-6 h-6 rounded-full"
                  />
                )}
                {entry.name}
              </td>
              <td>{entry.course}</td>
              <td>{entry.hour}</td>
              <td className="text-teal-600 font-semibold">
                {entry.point.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
