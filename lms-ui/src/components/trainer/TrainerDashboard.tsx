import React from "react";
import {
  LayoutDashboard,
  Layers,
  FileText,
} from "lucide-react";
import Header from "@/components/dashboard/Header";
import TodoList, { type TodoMainTask as TodoItem } from "@/components/dashboard/TodoList";
import type { CourseCard } from "@/components/dashboard/CourseCards";
import UpcomingClassesList from "./UpcomingClassesList";
import ResourceUpdateList from "./ResourceUpdateList";
import TrainerBatchesWithAttendance from "./TrainerBatchesWithAttendance";
import TrainerSidebar from "./TrainerSidebar";
import type { Trainer, Batch } from "@/mock/trainer/trainer_mock";

export interface TrainerDashboardProps {
  trainer: Trainer;
  courses: CourseCard[];
  todoList: TodoItem[];
  trainerId: string;
}

export default function TrainerDashboardComponent({
  trainer,
  courses,
  todoList,
  trainerId,
}: TrainerDashboardProps) {
  const [activePage, setActivePage] = React.useState<"Overview" | "Batches" | "Resources">("Overview");
  const [search, setSearch] = React.useState("");

  // Sidebar items
  const sidebarItems = [
    { label: "Overview", icon: <LayoutDashboard />, active: activePage === "Overview", onClick: () => setActivePage("Overview") },
    { label: "Batches", icon: <Layers />, active: activePage === "Batches", onClick: () => setActivePage("Batches") },
    { label: "Resources", icon: <FileText />, active: activePage === "Resources", onClick: () => setActivePage("Resources") },
  ];

  const batches: Batch[] = courses.map((c) => ({
    id: c.id,
    name: c.name,
    code: c.code,
    start_date: c.schedule.split(" ")[0] || "2024-01-01",
    status: c.status === "Active" ? "active" : "completed",
    logo: c.logo,
    color: c.color,
    instructor: c.trainer,
  }));

  return (
    <div className="flex bg-background min-h-screen font-sans text-foreground">
      {/* Desktop + Tablet Sidebar */}
      <div className="hidden md:flex shrink-0">
        <TrainerSidebar 
            items={sidebarItems} 
            trainerName={trainer.name} 
            trainerImage="https://randomuser.me/api/portraits/men/32.jpg" 
        />
      </div>

      <div className="flex flex-1 min-w-0">
          <div className="flex-1 flex flex-col h-screen overflow-hidden">
             
             {/* Header Section */}
             <div className="px-4 md:px-6 xl:px-10 py-6 pb-2">
                 <Header name={trainer.name} onSearch={setSearch} />
             </div>

             {/* Scrollable Main Content */}
             <div className="flex-1 overflow-y-auto px-4 md:px-6 xl:px-10 pb-10 custom-scrollbar pt-2">
                <div className="max-w-[1200px] w-full mx-auto flex flex-col gap-8">
                    {activePage === "Overview" && (
                      <>
                        {/* 1. Upcoming Classes */}
                        <UpcomingClassesList />

                        {/* 2. Resource Updates */}
                        <ResourceUpdateList />

                        {/* 3. Batches & Attendance */}
                        <TrainerBatchesWithAttendance batches={batches} trainerId={trainerId} />
                      </>
                    )}
                    
                    {activePage === "Batches" && (
                      <div className="p-10 text-muted-foreground text-center">Batch Management Page Placeholder</div>
                    )}
                    
                    {activePage === "Resources" && (
                      <div className="p-10 text-muted-foreground text-center">Resources Page Placeholder</div>
                    )}
                </div>
             </div>
          </div>

          {/* Right Sidebar - Flat with Divider */}
          <div className="hidden lg:flex shrink-0 h-screen">
             <div className="w-px bg-border mx-2 h-screen" />
             <div className="w-[320px] flex flex-col py-4 pr-6 h-full overflow-y-auto custom-scrollbar">
                 <div className="flex flex-col gap-6 p-2">
                    <h3 className="font-bold text-lg text-foreground">Quick Actions</h3>
                     {/* To Do List */}
                     <TodoList items={todoList} />
                 </div>
             </div>
          </div>
      </div>
    </div>
  );
}
