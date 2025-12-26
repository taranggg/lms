"use client";

import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import CreateResourceForm from "@/components/forms/CreateResourceForm";
import { NoData } from "@/components/ui/no-data";
import { useAuth } from "@/Context/AuthContext";
// Assuming getAllMaterials is available or needs to be stubbed for now
// Standard fetch for materials to display
import axios from "axios";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

// Basic Resource interface based on creation fields + _id
interface Resource {
    _id: string;
    title: string;
    description?: string;
    type: "Link" | "PDF" | "Video";
    url: string;
    createdAt?: string;
}

export default function TrainerResourcesPage() {
  const { token } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const fetchResources = async () => {
      if(!token) return;
      setLoading(true);
      try {
          // Adjust API call based on swagger: /api/v1/material/getAllMaterials
          const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
          const res = await axios.get(`${BASE_URL}/api/v1/material/getAllMaterials`, {
              headers: { Authorization: `Bearer ${token}` }
          });
          const data = res.data.data || res.data || [];
          setResources(Array.isArray(data) ? data : []);
      } catch (error) {
          console.error("Failed to fetch resources", error);
          toast.error("Failed to load resources");
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
     fetchResources();
  }, [token]);

  const handleSuccess = () => {
      setIsCreateOpen(false);
      fetchResources();
  };

  return (
    <div className="flex flex-col gap-6 w-full relative min-h-[calc(100vh-150px)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
           <h1 className="text-2xl font-bold tracking-tight text-foreground">Resources</h1>
           <p className="text-muted-foreground">Share learning materials with your students.</p>
        </div>
      </div>

      {/* Content */}
      <div className="w-full flex-1">
          {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {[1,2,3].map(i => <Skeleton key={i} className="h-40 w-full rounded-xl" />)}
             </div>
          ) : resources.length > 0 ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {resources.map((res) => (
                     <div key={res._id} className="p-6 border rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow">
                         <div className="flex items-start justify-between mb-2">
                             <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                                 res.type === 'PDF' ? 'bg-red-50 text-red-600 border-red-200' :
                                 res.type === 'Video' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                                 'bg-slate-50 text-slate-600 border-slate-200'
                             }`}>
                                 {res.type}
                             </span>
                             {/* Actions if needed, e.g. delete/edit */}
                         </div>
                         <h3 className="font-semibold text-lg mb-1">{res.title}</h3>
                         <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{res.description || "No description provided."}</p>
                         <a 
                           href={res.url} 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="text-primary text-sm font-medium hover:underline inline-flex items-center gap-1"
                         >
                            View Resource
                         </a>
                     </div>
                 ))}
             </div>
          ) : (
             <NoData 
                message="No Resources Found" 
                description="You haven't added any learning materials yet." 
             />
          )}
      </div>

      {/* FAB */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogTrigger asChild>
            <button className="fixed bottom-24 md:bottom-8 right-8 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:scale-110 hover:shadow-2xl active:scale-95 transition-all duration-300 ease-in-out z-50 group">
                <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
            <DialogTitle>Add New Resource</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
                <CreateResourceForm onSuccess={handleSuccess} />
            </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
