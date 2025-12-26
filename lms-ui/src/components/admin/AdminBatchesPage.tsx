"use client";
import React from "react";
import BatchList from "@/components/batches/BatchList";

export default function AdminBatchesPage() {
    const { token } = useAuth();
    
    if (!token) return null;

    return <BatchList mode="admin" token={token} />;
}

