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
import TodoList, { type TodoMainTask as TodoItem } from "@/components/dashboard/TodoList";
import MobileBottomNav, { type MobileNavItem } from "@/components/dashboard/MobileBottomNav";
import TrainerBatchesPage from "./TrainerBatchesPage";
import { EmptyStateModal } from "./TrainerEmptyState";
import { Button } from "@/components/ui/button";

interface TrainerDashboardProps {
  trainer: {
    name: string;
    designation: string;
  };
  batches: any[];
  todoList: TodoItem[];
  trainerId: string;
  token?: string;
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
        <div className="flex-1 flex flex-col h-full overflow-y-auto pb-20 custom-scrollbar relative">
             {/* Background Blobs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px]" />
            </div>

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
  token,
}: TrainerDashboardProps) {
  const [activePage, setActivePage] = React.useState<"Overview" | "Batches" | "Resources" | "Schedule" | "Assignments" | "Reports" | "Settings">("Overview");
  const [showEmptyStateModal, setShowEmptyStateModal] = React.useState(false);
  const [search, setSearch] = React.useState("");

  React.useEffect(() => {
    if (batches.length === 0) {
        setShowEmptyStateModal(true);
    }
  }, [batches.length]);

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
      active: activePage === "Schedule",
      onClick: () => setActivePage("Schedule"),
    },
    {
      label: "Assignments",
      icon: <FileText size={20} />,
      active: activePage === "Assignments",
      onClick: () => setActivePage("Assignments"),
    },
    {
       label: "Reports",
       icon: <BarChart size={20} />,
       active: activePage === "Reports",
       onClick: () => setActivePage("Reports"),
    },
    {
        label: "Settings",
        icon: <Settings size={20} />,
        active: activePage === "Settings",
        onClick: () => setActivePage("Settings"),
    }
  ];

  // Derive mobile nav items from sidebar items for DRY principle
  const mobileNavItems: MobileNavItem[] = sidebarItems.map((item) => ({
    label: item.label,
    icon: React.cloneElement(item.icon as React.ReactElement<{ className?: string }>, {
      className: "w-5 h-5",
    }),
    active: item.active || (item.label === "Settings" && activePage === "Settings") || (item.label === "Reports" && activePage === "Reports") || (item.label === "Assignments" && activePage === "Assignments") || (item.label === "Schedule" && activePage === "Schedule"), // Fallback logic if 'active' isn't set explicitly for placeholders
    onClick: item.onClick ? item.onClick : () => setActivePage(item.label as any),
  }));


  return (
    <div className="flex bg-background h-screen overflow-hidden font-sans text-foreground">
      <EmptyStateModal 
        isOpen={showEmptyStateModal} 
        onOpenChange={setShowEmptyStateModal}
        trainerId={trainerId}
        token={token}
        onAction={() => {
            setShowEmptyStateModal(false);
        }}
      />
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
                            {batches.length > 0 ? (
                                <TrainerBatchesWithAttendance batches={batches} trainerId={trainerId} />
                            ) : (
                                <div className="rounded-xl border border-dashed border-border p-10 flex flex-col items-center justify-center text-center space-y-4 bg-muted/20">
                                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                                        <div className="opacity-50">
                                           <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="font-semibold text-lg">No Batches Assigned</h3>
                                        <p className="text-muted-foreground text-sm max-w-[400px]">
                                            You currently don't have any active batches. Your schedule and student lists will appear here once a batch is allocated.
                                        </p>
                                    </div>
                                    <Button variant="outline" onClick={() => setShowEmptyStateModal(true)}>
                                       Check Allocation Status
                                    </Button>
                                </div>
                            )}

                            {/* 4. Quick Actions (Tablet View - moved from Right Sidebar) */}
                            <div className="lg:hidden flex flex-col gap-6 mt-2">
                                <h3 className="font-bold text-lg text-foreground">Quick Actions</h3>
                                <TodoList items={todoList} />
                            </div>
                          </>
                        )}
                        
                        {activePage === "Batches" && (
                          <TrainerBatchesPage batches={batches} trainerId={trainerId} />
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
                    <TrainerBatchesPage batches={batches} trainerId={trainerId} />
                </div>
             </div>
         )}

         {activePage === "Resources" && (
            <div className="flex-1 flex flex-col p-4 overflow-y-auto pb-20">
                 <Header name={trainer.name} onSearch={setSearch} />
                 <div className="mt-6 text-center text-muted-foreground">Resources View</div>
            </div>
         )}

          {(activePage === "Schedule" || activePage === "Assignments" || activePage === "Reports" || activePage === "Settings") && (
             <div className="flex-1 flex flex-col p-4 overflow-y-auto pb-20">
                  <Header name={trainer.name} onSearch={setSearch} />
                  <div className="mt-6 text-center text-muted-foreground">{activePage} View Placeholder</div>
             </div>
          )}

         <MobileBottomNav items={mobileNavItems} />
      </div>

    </div>
  );
}
