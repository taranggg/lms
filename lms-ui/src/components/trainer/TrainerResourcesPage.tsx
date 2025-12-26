"use client";

import React from "react";
import ResourceList from "@/components/resources/ResourceList";
import { useAuth } from "@/Context/AuthContext";

export default function TrainerResourcesPage() {
  const { token } = useAuth();

  if (!token) return null;

  return (
    <ResourceList 
        mode="trainer"
        token={token}
        canCreate={true}
    />
  );
}
