import React from "react";
import { 
  Home, 
  BookOpen, 
  Calendar, 
  Users, 
  BarChart, 
  FileText, 
  Settings, 
  CalendarCheck2 
} from "lucide-react";
import TrainerSidebar, { TrainerSidebarItem } from "./TrainerSidebar";
import Header from "@/components/dashboard/Header";
import UpcomingClassesList from "./UpcomingClassesList";
import ResourceUpdateList from "./ResourceUpdateList";
import TrainerBatchesWithAttendance from "./TrainerBatchesWithAttendance";
import TodoList, { type TodoItem } from "@/components/dashboard/TodoList";
import MobileBottomNav, { type MobileNavItem } from "@/components/student/MobileBottomNav";

interface TrainerDashboardProps {
  trainer: {
    name: string;
    designation: string;
  };
  batches: any[];
  todoList: TodoItem[];
  trainerId: string;
}

/* ------------------ MOBILE OVERVIEW ------------------ */
function MobileOverview({
  trainer,
  batches,
  todoList,
  trainerId,
}: TrainerDashboardProps) {
    // Search state for mobile header if needed
    const [search, setSearch] = React.useState("");
    return (
        <div className="flex-1 flex flex-col bg-background h-full overflow-y-auto pb-20 custom-scrollbar">
            {/* Reusing shared Header which is generic enough, or minimal mobile header */}
            <div className="px-4 py-4">
                <Header name={trainer.name} onSearch={setSearch} />
            </div>

            <div className="px-4 flex flex-col gap-6">
                {/* 1. Upcoming Classes */}
                <UpcomingClassesList />

                {/* 2. Resource Updates */}
                <ResourceUpdateList />

                {/* 3. Batches List (Vertical per request) */}
                <TrainerBatchesWithAttendance batches={batches} trainerId={trainerId} />

                {/* 4. Todo List */}
                <div className="pb-4">
                     <h3 className="font-bold text-lg text-foreground mb-4">Quick Actions</h3>
                     <TodoList items={todoList} />
                </div>
            </div>
        </div>
    )
}

export default function TrainerDashboardComponent({
  trainer,
  batches,
  todoList,
  trainerId,
}: TrainerDashboardProps) {
  const [activePage, setActivePage] = React.useState<"Overview" | "Batches" | "Resources">("Overview");
  const [search, setSearch] = React.useState("");

  const sidebarItems: TrainerSidebarItem[] = [
    {
      label: "Overview",
      icon: <Home size={20} />,
      active: activePage === "Overview",
      onClick: () => setActivePage("Overview"),
    },
    {
      label: "My Batches",
      icon: <Users size={20} />,
      active: activePage === "Batches",
      onClick: () => setActivePage("Batches"),
    },
    {
      label: "Resources",
      icon: <BookOpen size={20} />,
      active: activePage === "Resources",
      onClick: () => setActivePage("Resources"),
    },
    {
      label: "Schedule",
      icon: <Calendar size={20} />,
    },
    {
      label: "Assignments",
      icon: <FileText size={20} />,
    },
    {
       label: "Reports",
       icon: <BarChart size={20} />,
    },
    {
        label: "Settings",
        icon: <Settings size={20} />,
    }
  ];

  const mobileNavItems: MobileNavItem[] = [
    {
      label: "Overview",
      icon: <Home className="w-5 h-5" />,
      active: activePage === "Overview",
      onClick: () => setActivePage("Overview"),
    },
    {
      label: "Batches",
      icon: <Users className="w-5 h-5" />,
      active: activePage === "Batches",
      onClick: () => setActivePage("Batches"),
    },
     {
      label: "Resources",
      icon: <BookOpen className="w-5 h-5" />,
      active: activePage === "Resources",
      onClick: () => setActivePage("Resources"),
    },
  ];


  return (
    <div className="flex bg-background h-screen overflow-hidden font-sans text-foreground">
      {/* ------------------ DESKTOP / TABLET LAYOUT ------------------ */}
      <div className="hidden md:flex w-full h-full">
          {/* Sidebar */}
          <div className="shrink-0 z-20">
            <TrainerSidebar 
                items={sidebarItems} 
                trainerName={trainer.name} 
                trainerDesignation={trainer.designation}
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
              <div className="hidden lg:flex shrink-0 h-screen z-10">
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

      {/* ------------------ MOBILE LAYOUT ------------------ */}
      <div className="flex flex-col w-full md:hidden h-full">
         {activePage === "Overview" && (
            <MobileOverview 
                trainer={trainer}
                batches={batches}
                todoList={todoList}
                trainerId={trainerId}
            />
         )}

         {activePage === "Batches" && (
             <div className="flex-1 flex flex-col p-4 overflow-y-auto pb-20">
                <Header name={trainer.name} onSearch={setSearch} />
                <div className="mt-6">
                    <h2 className="text-lg font-bold mb-4">My Batches</h2>
                    <TrainerBatchesWithAttendance batches={batches} trainerId={trainerId} />
                </div>
             </div>
         )}

         {activePage === "Resources" && (
            <div className="flex-1 flex flex-col p-4 overflow-y-auto pb-20">
                 <Header name={trainer.name} onSearch={setSearch} />
                 <div className="mt-6 text-center text-muted-foreground">Resources View</div>
            </div>
         )}

         <MobileBottomNav items={mobileNavItems} />
      </div>

    </div>
  );
}
