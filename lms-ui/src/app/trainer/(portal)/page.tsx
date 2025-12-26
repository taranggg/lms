"use client";

import React, { useState } from "react";
import Header from "@/components/dashboard/Header";
import UpcomingClassesList from "@/components/trainer/UpcomingClassesList";
import ResourceUpdateList from "@/components/trainer/ResourceUpdateList";
import TrainerBatchesWithAttendance from "@/components/trainer/TrainerBatchesWithAttendance";
import TodoList, { type TodoMainTask } from "@/components/dashboard/TodoList";
import { useAuth } from "@/Context/AuthContext";
import { Loader2 } from "lucide-react";
import { getTrainerById } from "@/Apis/Trainer";
import { NoData } from "@/components/ui/no-data";
import { Button } from "@/components/ui/button";
import { EmptyStateModal } from "@/components/trainer/TrainerEmptyState";
import MobileBottomNav, { MobileNavItem } from "@/components/dashboard/MobileBottomNav";
import { Home, Users, BookOpen, Calendar, FileText } from "lucide-react";
import { useRouter } from "next/navigation";

// Mock Todo List
const mockTodoList: TodoMainTask[] = [
  {
    label: "Review Assignments",
    category: "Grading",
    dateTime: "27 Nov 2025, 10:00 AM",
    checked: false,
    subtasks: [
        { label: "Batch A - React Hooks", checked: false },
        { label: "Batch B - CSS Grid", checked: false }
    ]
  },
  {
    label: "Prepare for Next Session",
    category: "Preparation",
    dateTime: "28 Nov 2025, 09:00 AM",
    checked: false,
    subtasks: []
  },
];

export default function TrainerDashboardPage() {
  const { user, token, isLoading } = useAuth();
  const [trainerData, setTrainerData] = React.useState<any>(null);
  const [dataLoading, setDataLoading] = React.useState(true);
  const [showEmptyStateModal, setShowEmptyStateModal] = useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const fetchTrainer = async () => {
        const storedTrainerId = localStorage.getItem("trainerId");
        const idToUse = user?.id || storedTrainerId;

        if (idToUse && token) {
            try {
                const data = await getTrainerById(idToUse, token);
                setTrainerData(data);
            } catch (error) {
                console.error("Failed to fetch trainer data", error);
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

  if (!trainerData) return null;

  const courses = trainerData.courses || [];

  
  // Note: batches data logic is now handled inside components (TrainerBatchesWithAttendance -> BatchList)
  // We check courses length just for empty state logic if needed, OR we can let the components handle their empty states.
  // But since the current design has a high-level empty check, let's keep it based on trainerData for now.
  const hasBatches = courses.length > 0;

  const mobileNavItems: MobileNavItem[] = [
     { label: "Overview", icon: <Home className="w-5 h-5"/>, active: true, onClick: () => router.push("/trainer") },
     { label: "My Batches", icon: <Users className="w-5 h-5"/>, active: false, onClick: () => router.push("/trainer/batches") },
     { label: "Resources", icon: <BookOpen className="w-5 h-5"/>, active: false, onClick: () => router.push("/trainer/resources") },
     { label: "Schedule", icon: <Calendar className="w-5 h-5"/>, active: false, onClick: () => router.push("/trainer/schedule") },
     { label: "Assignments", icon: <FileText className="w-5 h-5"/>, active: false, onClick: () => router.push("/trainer/assignments") },
  ];

  return (
    <div className="flex w-full h-full overflow-hidden">
       <EmptyStateModal 
        isOpen={showEmptyStateModal} 
        onOpenChange={setShowEmptyStateModal}
        trainerId={trainerData._id}
        token={token}
        onAction={() => setShowEmptyStateModal(false)}
      />

       {/* Main Content Area */}
       <div className="flex-1 flex flex-col h-full overflow-hidden">
          <div className="px-4 md:px-6 xl:px-10 py-6 pb-2 shrink-0">
             <Header name={trainerData.name} onSearch={() => {}} />
          </div>

          <div className="flex-1 overflow-y-auto px-4 md:px-6 xl:px-10 pb-20 md:pb-10 custom-scrollbar pt-2">
              <div className="max-w-[1200px] w-full mx-auto flex flex-col gap-8">
                  {hasBatches ? (
                      <>
                        <UpcomingClassesList />
                        <ResourceUpdateList />
                        <TrainerBatchesWithAttendance trainerId={trainerData._id} />
                      </>
                  ) : (
                      <div className="flex flex-col items-center justify-center min-h-[50vh]">
                          <NoData 
                            message="No Active Batches" 
                            description="You haven't been assigned to any batches yet."
                          />
                          <Button variant="outline" className="mt-4" onClick={() => setShowEmptyStateModal(true)}>
                                Check Status
                          </Button>
                      </div>
                  )}

                  {/* Mobile/Tablet Todo List fallback */}
                  <div className="lg:hidden flex flex-col gap-6 mt-2">
                       <h3 className="font-bold text-lg text-foreground">Quick Actions</h3>
                       <TodoList items={mockTodoList} />
                  </div>
              </div>
          </div>
       </div>

       {/* Right Sidebar - TODO List (Desktop Only) */}
       <div className="hidden lg:flex shrink-0 h-full border-l border-border bg-background/50 backdrop-blur-sm z-10 w-[320px] flex-col py-4 pr-6 pl-2 overflow-y-auto custom-scrollbar">
           <div className="flex flex-col gap-6 p-2">
               <h3 className="font-bold text-lg text-foreground mt-4">Quick Actions</h3>
               <TodoList items={mockTodoList} />
           </div>
       </div>

        {/* Mobile Navigation */}
       <div className="md:hidden">
            <MobileBottomNav items={mobileNavItems} />
       </div>
    </div>
  );
}
