import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import TrainerBatchCard from "@/components/trainer/TrainerBatchCard";

export default function TrainerBatches() {
  // Dummy data for UI
  const batches = [
    {
      id: 1,
      name: "Batch A",
      schedule: "Mon, Wed, Fri - 5:00pm",
      students: 20,
    },
    { id: 2, name: "Batch B", schedule: "Tue, Thu - 4:00pm", students: 15 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex flex-col gap-6">
      <Card className="max-w-2xl mx-auto w-full">
        <CardHeader>
          <CardTitle className="text-2xl">My Batches</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {batches.map((batch) => (
            <TrainerBatchCard key={batch.id} batch={batch} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
