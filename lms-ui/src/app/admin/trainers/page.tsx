import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AdminTrainerCard from "@/components/admin/AdminTrainerCard";

export default function AdminTrainers() {
  // Dummy data for UI
  const trainers = [
    {
      id: 1,
      name: "Mr. Smith",
      contact: "smith@email.com",
      batches: ["Batch A", "Batch C"],
    },
    { id: 2, name: "Ms. Lee", contact: "lee@email.com", batches: ["Batch B"] },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] p-4 flex flex-col gap-6">
      <Card className="max-w-2xl mx-auto w-full bg-[var(--card)] text-[var(--card-foreground)]">
        <CardHeader>
          <CardTitle className="text-2xl">All Trainers</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex justify-end mb-2">
            <Button variant="default">Add Trainer</Button>
          </div>
          {trainers.map((trainer) => (
            <AdminTrainerCard key={trainer.id} trainer={trainer} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
