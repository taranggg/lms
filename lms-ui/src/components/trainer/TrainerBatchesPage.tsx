"use client";

import React from "react";
import BatchList from "@/components/batches/BatchList";
import { type Batch } from "./TrainerBatchList"; // Keeping for type reference if needed elsewhere
import { useAuth } from "@/Context/AuthContext";

interface TrainerBatchesPageProps {
  batches?: Batch[]; // Optional now as BatchSection fetches data
  trainerId: string;
}

export default function TrainerBatchesPage({
  trainerId,
}: TrainerBatchesPageProps) {
  const { token } = useAuth();
  
  if (!token) return null;

  return (
    <BatchList 
        mode="trainer"
        token={token}
        userId={trainerId}
    />
  );
}
