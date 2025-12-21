
import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import TrainerBatchList, { type Batch } from "./TrainerBatchList";

interface TrainerBatchesPageProps {
  batches: Batch[];
  trainerId: string;
}

export default function TrainerBatchesPage({
  batches,
  trainerId,
}: TrainerBatchesPageProps) {
  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header / Title Area */}
      <div className="flex items-center justify-between">
        <div>
           <h1 className="text-2xl font-bold tracking-tight text-foreground">My Batches</h1>
           <p className="text-muted-foreground">Manage your assigned batches and student attendance.</p>
        </div>
        <Button className="gap-2">
            <Plus size={16} />
            Add Batch
        </Button>
      </div>

      {/* Main Content */}
      <div className="w-full">
         <TrainerBatchList batches={batches} trainerId={trainerId} />
      </div>
    </div>
  );
}
