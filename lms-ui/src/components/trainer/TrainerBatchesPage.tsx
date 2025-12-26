"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import TrainerBatchList, { type Batch } from "./TrainerBatchList";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import TrainerCreateBatchForm from "./forms/TrainerCreateBatchForm";

interface TrainerBatchesPageProps {
  batches: Batch[];
  trainerId: string;
}

export default function TrainerBatchesPage({
  batches,
  trainerId,
}: TrainerBatchesPageProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const handleSuccess = () => {
      setIsCreateOpen(false);
      // Ideally trigger a refresh here if data isn't live-updated via context/query
      // For now, simple close. 
      // If the parent passes specific refresh logic, we'd call it.
      // But usually simply closing and letting SWR/React Query or parent re-render works if setup.
      // Since this is a simple implementation, a full page reload might be needed 
      // OR we rely on the parent to re-fetch.
      window.location.reload(); 
  };

  return (
    <div className="flex flex-col gap-6 w-full relative min-h-[calc(100vh-150px)]">
      {/* Header / Title Area */}
      <div className="flex items-center justify-between">
        <div>
           <h1 className="text-2xl font-bold tracking-tight text-foreground">My Batches</h1>
           <p className="text-muted-foreground">Manage your assigned batches and student attendance.</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full">
         <TrainerBatchList batches={batches} trainerId={trainerId} />
      </div>

      {/* FAB with Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogTrigger asChild>
            <button className="fixed bottom-24 md:bottom-8 right-8 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:scale-110 hover:shadow-2xl active:scale-95 transition-all duration-300 ease-in-out z-50 group">
                <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
            <DialogTitle>Create New Batch</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
                <TrainerCreateBatchForm onSuccess={handleSuccess} trainerId={trainerId} />
            </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
