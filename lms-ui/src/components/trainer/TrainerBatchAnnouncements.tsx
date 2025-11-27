import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface TrainerBatchAnnouncementsProps {
  announcements: { title: string; content: string }[];
}

export default function TrainerBatchAnnouncements({
  announcements,
}: TrainerBatchAnnouncementsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Announcements</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {announcements.map((a, idx) => (
            <li
              key={idx}
              className="p-2 rounded bg-yellow-50 border-l-4 border-yellow-400"
            >
              <strong>{a.title}: </strong>
              <span>{a.content}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
