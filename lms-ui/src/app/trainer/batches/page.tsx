"use client";

import React, { useState } from "react";
import TrainerBatchesPage from "@/components/trainer/TrainerBatchesPage";
import { useAuth } from "@/Context/AuthContext";
import { Loader2 } from "lucide-react";
import { getTrainerById } from "@/Apis/Trainer";
import Header from "@/components/dashboard/Header";
import { NoData } from "@/components/ui/no-data";
import MobileBottomNav, { MobileNavItem } from "@/components/dashboard/MobileBottomNav";
import { Home, Users, BookOpen, Calendar, FileText } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TrainerBatchesRoute() {
  const { user, token, isLoading } = useAuth();
  const [batches, setBatches] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const router = useRouter();

  React.useEffect(() => {
    const fetchTrainer = async () => {
        const storedTrainerId = localStorage.getItem("trainerId");
        const idToUse = user?.id || storedTrainerId;

        if (idToUse && token) {
            try {
                const data = await getTrainerById(idToUse, token);
                const courses = data.courses || [];
                // Map to Batch format
                const mappedBatches = courses.map((c: any) => ({
                    id: c.id || c._id,
                    name: c.name || "Untitled Course",
                    code: c.code || "C-XXX",
                    schedule: c.schedule || "TBD",
                    students: c.studentsCount || 0,
                    active: true,
                    color: "#e0f2fe", 
                    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg", 
                    instructor: data.name,
                    branch: data.branch?.name || "Online", 
                }));
                setBatches(mappedBatches);
            } catch (error) {
                console.error("Failed to fetch batches", error);
            } finally {
                setDataLoading(false);
            }
        } else {
             setDataLoading(false);
        }
    };

    if (!isLoading) {
        if (user && token) {
             fetchTrainer();
        } else {
             setDataLoading(false);
        }
    }
  }, [user, token, isLoading]);

  if (isLoading || dataLoading) {
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

  return (
    <div className="flex flex-col h-full w-full">
         <div className="px-4 md:px-6 xl:px-10 py-6 pb-2 shrink-0">
             <Header name={user.name || "Trainer"} onSearch={() => {}} />
         </div>
         <div className="flex-1 px-4 md:px-6 xl:px-10 pb-20 md:pb-10 overflow-y-auto custom-scrollbar">
             <TrainerBatchesPage 
                batches={batches} 
                trainerId={user.id || localStorage.getItem("trainerId") || ""} 
             />
         </div>
         {/* Mobile Navigation */}
         <div className="md:hidden">
            <MobileBottomNav items={mobileNavItems} />
       </div>
    </div>
  );
}
