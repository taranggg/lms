import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface TrainerDashboardProps {
  params: { trainerId: string };
}

export default function TrainerDashboard({ params }: TrainerDashboardProps) {
  // Dummy data for UI
  const trainer = { name: "Mr. Smith", id: params.trainerId };
  const batches = [
    { name: "Batch A", schedule: "Mon, Wed, Fri - 5:00pm", id: 1 },
    { name: "Batch B", schedule: "Tue, Thu - 4:00pm", id: 2 },
  ];
  // ...existing code...

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex flex-col gap-6">
      <Card className="max-w-2xl mx-auto w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome, {trainer.name}!</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <section>
            <h2 className="font-semibold mb-2">Assigned Batches</h2>
            <ul className="space-y-2">
              {batches.map((batch) => (
                <li
                  key={batch.id}
                  className="flex justify-between items-center p-2 rounded bg-gray-100"
                >
                  <span>{batch.name}</span>
                  <span className="text-sm text-gray-400">
                    {batch.schedule}
                  </span>
                  <Link href={`/trainer/batch-detail?id=${batch.id}`}>
                    <Button size="sm" variant="outline">
                      Details
                    </Button>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
          {/* ...other sections... */}
        </CardContent>
      </Card>
    </div>
  );
}
