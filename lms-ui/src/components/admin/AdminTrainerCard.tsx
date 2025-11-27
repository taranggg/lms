import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AdminTrainerCardProps {
  trainer: {
    id: number;
    name: string;
    contact: string;
    batches: string[];
  };
}

export default function AdminTrainerCard({ trainer }: AdminTrainerCardProps) {
  return (
    <Card className="w-full bg-[var(--card)] text-[var(--card-foreground)]">
      <CardHeader>
        <CardTitle className="text-[var(--card-foreground)]">
          {trainer.name}
        </CardTitle>
        <div className="text-[var(--muted-foreground)]">
          Contact: {trainer.contact}
        </div>
      </CardHeader>
      <CardContent className="flex justify-between items-center">
        <div className="text-sm text-[var(--card-foreground)]">
          Batches: {trainer.batches.join(", ")}
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            Edit
          </Button>
          <Button size="sm" variant="destructive">
            Remove
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
