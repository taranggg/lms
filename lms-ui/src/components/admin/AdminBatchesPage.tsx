"use client";
import React, { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Calendar,
  Users,
  GraduationCap,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CreateBatchForm from "@/components/admin/forms/CreateBatchForm";

// Mock Data
const MOCK_BATCHES = [
  {
    id: 1,
    name: "React Mastery 2024",
    branch: "Main Branch",
    schedule: "Mon, Wed, Fri • 10:00 AM",
    trainer: "Sarah Wilson",
    students: 24,
    status: "Active",
  },
  {
    id: 2,
    name: "Node.js Advanced",
    branch: "Downtown Branch",
    schedule: "Tue, Thu • 2:00 PM",
    trainer: "Mike Chen",
    students: 18,
    status: "Active",
  },
  {
    id: 3,
    name: "UI/UX Design Fundamentals",
    branch: "Main Branch",
    schedule: "Weekends • 11:00 AM",
    trainer: "Emily Davis",
    students: 30,
    status: "Upcoming",
  },
  {
    id: 4,
    name: "Python for Data Science",
    branch: "Main Branch",
    schedule: "Mon, Wed • 6:00 PM",
    trainer: "Alex Thompson",
    students: 22,
    status: "Active",
  },
];

export default function AdminBatchesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBranch, setFilterBranch] = useState("All");
  const [filterTrainer, setFilterTrainer] = useState("All");
  const [mounted, setMounted] = useState(false);
  const [isCreateBatchOpen, setIsCreateBatchOpen] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Reset trainer filter when branch changes
  React.useEffect(() => {
    setFilterTrainer("All");
  }, [filterBranch]);

  // Derive available trainers for the selected branch
  const availableTrainers = React.useMemo(() => {
    if (filterBranch === "All") return [];
    const trainers = new Set(
      MOCK_BATCHES.filter((b) => b.branch === filterBranch).map((b) => b.trainer)
    );
    return Array.from(trainers);
  }, [filterBranch]);

  const filteredBatches = MOCK_BATCHES.filter((batch) => {
    const matchesSearch = batch.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesBranch =
      filterBranch === "All" || batch.branch === filterBranch;
    const matchesTrainer =
      filterTrainer === "All" || batch.trainer === filterTrainer;

    return matchesSearch && matchesBranch && matchesTrainer;
  });

  return (
    <div className="relative min-h-[calc(100vh-2rem)] flex flex-col gap-8">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Batches</h1>
          <p className="text-muted-foreground">
            Manage your classes and schedules
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Search batches..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-[200px]"
            />
          </div>
          
          {/* Branch Filter */}
          {!mounted ? (
             <Button variant="outline" className="gap-2">
              <Filter size={16} />
              <span>{filterBranch === "All" ? "Branch" : filterBranch}</span>
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter size={16} />
                  <span>{filterBranch === "All" ? "Branch" : filterBranch}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setFilterBranch("All")}>
                  All Branches
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterBranch("Main Branch")}>
                  Main Branch
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterBranch("Downtown Branch")}>
                  Downtown Branch
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Trainer Filter */}
          {filterBranch !== "All" && (
            <>
              {!mounted ? (
                <Button variant="outline" className="gap-2">
                  <Users size={16} />
                  <span>{filterTrainer === "All" ? "Trainer" : filterTrainer}</span>
                </Button>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Users size={16} />
                      <span>{filterTrainer === "All" ? "Trainer" : filterTrainer}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setFilterTrainer("All")}>
                      All Trainers
                    </DropdownMenuItem>
                    {availableTrainers.map((trainer) => (
                      <DropdownMenuItem
                        key={trainer}
                        onClick={() => setFilterTrainer(trainer)}
                      >
                        {trainer}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </>
          )}
        </div>
      </div>

      {/* Grid of Batches */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredBatches.map((batch) => (
          <div
            key={batch.id}
            className="bg-card text-card-foreground rounded-xl border shadow-sm hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 p-6 space-y-4 cursor-pointer"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg leading-none tracking-tight">
                        {batch.name}
                    </h3>
                    <span
                        className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                        batch.status === "Active"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-yellow-50 text-yellow-700 border-yellow-200"
                        }`}
                    >
                        {batch.status}
                    </span>
                </div>
                <p className="text-sm text-muted-foreground">{batch.branch}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 -mr-2"
              >
                <MoreVertical size={16} />
              </Button>
            </div>

            <div className="space-y-2">
                <div className="flex items-center text-sm">
                    <Calendar className="mr-2 h-4 w-4 text-blue-500" />
                    {batch.schedule}
                </div>
                 <div className="flex items-center text-sm">
                    <GraduationCap className="mr-2 h-4 w-4 text-purple-500" />
                    {batch.trainer}
                </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t">
                 <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="mr-2 h-4 w-4 text-orange-500" />
                    {batch.students} Students
                </div>
                 <div className="flex -space-x-2">
                   {[1,2,3].map(i => (
                       <div key={i} className="w-6 h-6 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[8px] font-medium">
                           S{i}
                       </div>
                   ))}
                   <div className="w-6 h-6 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px]">
                     +
                   </div>
                </div>
            </div>
          </div>
        ))}
      </div>

      {/* FAB with Dialog */}
      <Dialog open={isCreateBatchOpen} onOpenChange={setIsCreateBatchOpen}>
        <DialogTrigger asChild>
          <button className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:scale-110 hover:shadow-2xl active:scale-95 transition-all duration-300 ease-in-out z-50 group">
            <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Batch</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <CreateBatchForm onSuccess={() => setIsCreateBatchOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
