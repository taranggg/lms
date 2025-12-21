import React from "react";
import TrainerBatchCard from "./TrainerBatchCard";

export interface Batch {
  id: number;
  name: string;
  code: string;
  schedule: string;
  students: number;
  active: boolean;
  color: string;
  logo?: string;
  instructor?: string;
}

interface TrainerBatchListProps {
  batches: Batch[];
  trainerId: string;
}

export default function TrainerBatchList({
  batches,
  trainerId,
}: TrainerBatchListProps) {
  return (
    <div className="flex flex-col gap-4 w-full">
      {batches.map((batch) => (
        <div key={batch.id} className="w-full">
          <TrainerBatchCard batch={batch} trainerId={trainerId} />
        </div>
      ))}
    </div>
  );
}
