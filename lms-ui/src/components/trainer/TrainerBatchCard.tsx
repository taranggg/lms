import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface TrainerBatchCardProps {
  batch: {
    id: number;
    name: string;
    schedule: string;
    students: number;
  };
}

export default function TrainerBatchCard({ batch }: TrainerBatchCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{batch.name}</CardTitle>
        <div className="text-gray-500">Schedule: {batch.schedule}</div>
      </CardHeader>
      <CardContent className="flex justify-between items-center">
        <div className="text-sm">Students: {batch.students}</div>
        <div className="flex gap-2">
          <Link href={`/trainer/batch-detail?id=${batch.id}`}>
            <Button size="sm" variant="outline">
              Details
            </Button>
          </Link>
          <Link href={`/trainer/mark-attendance?id=${batch.id}`}>
            <Button size="sm" variant="default">
              Mark Attendance
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
