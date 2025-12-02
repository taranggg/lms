"use client";
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { useParams } from "next/navigation";
import { trainers, Trainer, Batch } from "@/mock/trainer/trainers";

export default function TrainerDashboard() {
  const { trainerId } = useParams();
  const trainer = trainers.find(
    (t: Trainer) => String(t.id) === String(trainerId)
  );
  if (!trainer) {
    return <div className="p-8 text-center">Trainer not found.</div>;
  }
  const batches = trainer.batches.map((batch: Batch) => ({
    name: batch.name,
    schedule: batch.schedule,
    id: batch.id,
  }));

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
