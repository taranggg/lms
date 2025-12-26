"use client";

import React from "react";
import TrainerBatchesPage from "@/components/trainer/TrainerBatchesPage";
import { useAuth } from "@/Context/AuthContext";
import { Loader2 } from "lucide-react";
import Header from "@/components/dashboard/Header";
import MobileBottomNav, { MobileNavItem } from "@/components/dashboard/MobileBottomNav";
import { Home, Users, BookOpen, Calendar, FileText } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TrainerBatchesRoute() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) {
      return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
  }

  // Fallback if no user
  if (!user) return null;

  const mobileNavItems: MobileNavItem[] = [
     { label: "Overview", icon: <Home className="w-5 h-5"/>, active: false, onClick: () => router.push("/trainer") },
     { label: "My Batches", icon: <Users className="w-5 h-5"/>, active: true, onClick: () => router.push("/trainer/batches") },
     { label: "Resources", icon: <BookOpen className="w-5 h-5"/>, active: false, onClick: () => router.push("/trainer/resources") },
     { label: "Schedule", icon: <Calendar className="w-5 h-5"/>, active: false, onClick: () => router.push("/trainer/schedule") },
     { label: "Assignments", icon: <FileText className="w-5 h-5"/>, active: false, onClick: () => router.push("/trainer/assignments") },
  ];

  const trainerId = user.id || (typeof window !== 'undefined' ? localStorage.getItem("trainerId") : "") || "";

  return (
    <div className="flex flex-col h-full w-full">
         <div className="px-4 md:px-6 xl:px-10 py-6 pb-2 shrink-0">
             <Header name={user.name || "Trainer"} onSearch={() => {}} />
         </div>
         <div className="flex-1 px-4 md:px-6 xl:px-10 pb-20 md:pb-10 overflow-y-auto custom-scrollbar">
             <TrainerBatchesPage 
                trainerId={trainerId} 
             />
         </div>
         {/* Mobile Navigation */}
         <div className="md:hidden">
            <MobileBottomNav items={mobileNavItems} />
       </div>
    </div>
  );
}
