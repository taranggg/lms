import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AdminBatchCard from "@/components/admin/AdminBatchCard";

export default function AdminBatches() {
  // Dummy data for UI
  const batches = [
    {
      id: 1,
      name: "Batch A",
      schedule: "Mon, Wed, Fri - 5:00pm",
      trainer: "Mr. Smith",
      students: 20,
    },
    {
      id: 2,
      name: "Batch B",
      schedule: "Tue, Thu - 4:00pm",
      trainer: "Ms. Lee",
      students: 15,
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] p-4 flex flex-col gap-6">
      <Card className="max-w-2xl mx-auto w-full bg-[var(--card)] text-[var(--card-foreground)]">
        <CardHeader>
          <CardTitle className="text-2xl">All Batches</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex justify-end mb-2">
            <Button variant="default">Add Batch</Button>
          </div>
          {batches.map((batch) => (
            <AdminBatchCard key={batch.id} batch={batch} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
