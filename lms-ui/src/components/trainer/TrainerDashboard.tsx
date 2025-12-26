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
import { NoData } from "@/components/ui/no-data";

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
                {batches.length > 0 ? (
                    <>
                        {/* 1. Upcoming Classes */}
                        <UpcomingClassesList />

                        {/* 2. Resource Updates */}
                        <ResourceUpdateList />

                        {/* 3. Batches List (Vertical per request) */}
                        <TrainerBatchesWithAttendance batches={batches} trainerId={trainerId} />
                    </>
                ) : (
                     <NoData 
                        message="No Dashboard Data" 
                        description="You need to be assigned to a batch to see your overview."
                     />
                )}

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
  const [activePage, setActivePage] = React.useState<"Overview" | "Batches" | "Resources" | "Schedule" | "Assignments">("Overview");
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
  ];

  // Derive mobile nav items from sidebar items for DRY principle
  const mobileNavItems: MobileNavItem[] = sidebarItems.map((item) => ({
    label: item.label,
    icon: React.cloneElement(item.icon as React.ReactElement<{ className?: string }>, {
      className: "w-5 h-5",
    }),
    active: item.active || (item.label === "Assignments" && activePage === "Assignments") || (item.label === "Schedule" && activePage === "Schedule"), // Fallback logic if 'active' isn't set explicitly for placeholders
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
                    <div className="max-w-[1200px] w-full mx-auto flex flex-col gap-8 h-full">
                        {activePage === "Overview" && (
                          <>
                            {batches.length > 0 ? (
                                <>
                                    {/* 1. Upcoming Classes */}
                                    <UpcomingClassesList />

                                    {/* 2. Resource Updates */}
                                    <ResourceUpdateList />

                                    {/* 3. Batches & Attendance */}
                                    <TrainerBatchesWithAttendance batches={batches} trainerId={trainerId} />
                                </>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh]">
                                   <NoData 
                                      message="No Active Batches" 
                                      description="You haven't been assigned to any batches yet."
                                   />
                                   <Button variant="outline" className="mt-4" onClick={() => setShowEmptyStateModal(true)}>
                                       Check Status
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
                          batches.length > 0 ? (
                              <TrainerBatchesPage batches={batches} trainerId={trainerId} />
                          ) : (
                              <NoData message="No Batches Found" description="Your assigned batches will appear here." />
                          )
                        )}
                        
                        {activePage === "Resources" && (
                          <NoData message="No Resources" description="Resources shared with your batches will appear here." />
                        )}

                        {activePage === "Schedule" && (
                           <NoData message="No Schedule" description="Your class schedule will appear here." />
                        )}

                        {activePage === "Assignments" && (
                           <NoData message="No Assignments" description="Student assignments will likely appear here." />
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
                <div className="mt-6 flex-1">
                    {batches.length > 0 ? (
                        <TrainerBatchesPage batches={batches} trainerId={trainerId} />
                    ) : (
                         <NoData message="No Batches" />
                    )}
                </div>
             </div>
         )}

         {activePage === "Resources" && (
            <div className="flex-1 flex flex-col p-4 overflow-y-auto pb-20">
                 <Header name={trainer.name} onSearch={setSearch} />
                 <div className="mt-6 flex-1 h-full">
                     <NoData message="No Resources" />
                 </div>
            </div>
         )}

          {(activePage === "Schedule" || activePage === "Assignments") && (
             <div className="flex-1 flex flex-col p-4 overflow-y-auto pb-20">
                  <Header name={trainer.name} onSearch={setSearch} />
                  <div className="mt-6 flex-1 h-full">
                       <NoData message={`No ${activePage}`} />
                  </div>
             </div>
          )}

         <MobileBottomNav items={mobileNavItems} />
      </div>

    </div>
  );
}
