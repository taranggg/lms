"use client";
import React, { useState, useEffect } from "react";
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
import { NoData } from "@/components/ui/no-data";


import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CreateBatchForm from "@/components/forms/CreateBatchForm";
import { useAuth } from "@/Context/AuthContext";
import { getAllBatches } from "@/Apis/Batch";
import { getAllBranches } from "@/Apis/Branch";
import { getAllTrainers } from "@/Apis/Trainer";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminBatchesPage() {
  const { token } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBranch, setFilterBranch] = useState("All");
  const [filterTrainer, setFilterTrainer] = useState("All");
  const [mounted, setMounted] = useState(false);
  const [isCreateBatchOpen, setIsCreateBatchOpen] = useState(false);

  // Data states
  const [batches, setBatches] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [trainers, setTrainers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch Branches and Trainers only once on mount
  useEffect(() => {
    const fetchMetadata = async () => {
        if (!token) return;
        try {
            const [branchesRes, trainersRes] = await Promise.all([
                getAllBranches(token),
                getAllTrainers(token),
            ]);
            const branchesData = Array.isArray(branchesRes) ? branchesRes : branchesRes?.data || [];
            const trainersData = Array.isArray(trainersRes) ? trainersRes : trainersRes?.data || [];
            setBranches(branchesData);
            setTrainers(trainersData);
        } catch (error) {
            console.error("Failed to fetch metadata", error);
        }
    };
    fetchMetadata();
  }, [token]);

  const fetchBatches = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const filters: any = {};
      if (filterBranch !== "All") filters.branch = filterBranch;
      if (filterTrainer !== "All") filters.trainer = filterTrainer;
      if (searchQuery) filters.search = searchQuery;

      const batchesRes = await getAllBatches(token, filters);
      const batchesData = Array.isArray(batchesRes) ? batchesRes : batchesRes?.data || [];
      setBatches(batchesData);
    } catch (error) {
      console.error("Failed to fetch batches:", error);
      toast.error("Failed to load batches data");
    } finally {
      setLoading(false);
    }
  };

  // Debounce search query to avoid too many API calls
  useEffect(() => {
      const timer = setTimeout(() => {
          fetchBatches();
      }, 500); // Debounce duration
      return () => clearTimeout(timer);
  }, [token, filterBranch, filterTrainer, searchQuery]);

  // Handle successful creation
  const handleBatchCreated = () => {
    setIsCreateBatchOpen(false);
    fetchBatches(); // Refresh list
  };

  // Reset trainer filter when branch changes
  React.useEffect(() => {
    setFilterTrainer("All");
  }, [filterBranch]);

  // Helper to get Branch Name by ID
  const getBranchName = (branchIdOrObj: any) => {
      if(!branchIdOrObj) return "Unknown Branch";
      if(typeof branchIdOrObj === 'object' && branchIdOrObj.name) return branchIdOrObj.name;
      const found = branches.find(b => b._id === branchIdOrObj);
      return found ? found.name : "Unknown Branch";
  };
  
  // Helper to get Trainer Name by ID
  const getTrainerName = (trainerIdOrObj: any) => {
      if(!trainerIdOrObj) return "Unassigned";
      if(typeof trainerIdOrObj === 'object' && trainerIdOrObj.name) return trainerIdOrObj.name;
      const found = trainers.find(t => t._id === trainerIdOrObj);
      return found ? found.name : "Unassigned";
  };

  // Derive available trainers based on selected branch for the Filter Dropdown
  const availableTrainers = React.useMemo(() => {
    if (filterBranch === "All") return trainers;
    return trainers.filter((t) => {
        const tBranchId = typeof t.branch === "string" ? t.branch : t.branch?._id;
        return tBranchId === filterBranch;
    });
  }, [filterBranch, trainers]);

  if (!mounted) return null;

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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter size={16} />
                <span>
                    {filterBranch === "All" 
                        ? "All Branches" 
                        : getBranchName(filterBranch)}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilterBranch("All")}>
                All Branches
              </DropdownMenuItem>
              {branches.map((branch) => (
                  <DropdownMenuItem key={branch._id} onClick={() => setFilterBranch(branch._id)}>
                      {branch.name}
                  </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Trainer Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Users size={16} />
                <span>
                    {filterTrainer === "All" 
                        ? "All Trainers" 
                        : getTrainerName(filterTrainer)}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilterTrainer("All")}>
                All Trainers
              </DropdownMenuItem>
              {availableTrainers.map((trainer) => (
                <DropdownMenuItem
                  key={trainer._id}
                  onClick={() => setFilterTrainer(trainer._id)}
                >
                  {trainer.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Grid of Batches */}
      {loading ? (
           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-[200px] w-full rounded-xl" />
              ))}
           </div>
      ) : batches.length === 0 ? (
          <NoData 
            message="No Batches Found" 
            description="Try adjusting your search or filters to find what you're looking for."
          />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {batches.map((batch) => (
            <div
                key={batch._id}
                className="bg-card text-card-foreground rounded-xl border shadow-sm hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 p-6 space-y-4 cursor-pointer"
            >
                <div className="flex justify-between items-start">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg leading-none tracking-tight">
                            {batch.title}
                        </h3>
                        {/* Status removed from UI based on new schema? Using placeholder or removing badge if no status */}
                        {batch.status && (
                             <span
                                className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                                batch.status === "Active" || batch.status === "Running"
                                    ? "bg-green-50 text-green-700 border-green-200"
                                    : "bg-yellow-50 text-yellow-700 border-yellow-200"
                                }`}
                            >
                                {batch.status}
                            </span>
                        )}
                       
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {getBranchName(batch.branch)}
                    </p>
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
                        {batch.type}
                    </div>
                     <div className="flex items-center text-sm">
                         {/* Displaying time range if available */}
                         {(batch.startTime && batch.endTime) ? `${batch.startTime} - ${batch.endTime}` : "Time N/A"}
                    </div>
                    <div className="flex items-center text-sm">
                        <GraduationCap className="mr-2 h-4 w-4 text-purple-500" />
                        {getTrainerName(batch.trainer)}
                    </div>
                </div>

                <div className="pt-4 flex items-center justify-between border-t">
                    <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="mr-2 h-4 w-4 text-orange-500" />
                        {batch.students ? batch.students.length : 0} Students
                    </div>
                    {/* Student Avatars (Placeholder logic for now) */}
                    <div className="flex -space-x-2">
                        <div className="w-6 h-6 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px]">
                            +
                        </div>
                    </div>
                </div>
            </div>
            ))}
        </div>
      )}

      {/* FAB with Dialog */}
      <Dialog open={isCreateBatchOpen} onOpenChange={setIsCreateBatchOpen}>
        <DialogTrigger asChild>
          <button className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:scale-110 hover:shadow-2xl active:scale-95 transition-all duration-300 ease-in-out z-50 group">
            <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Create New Batch</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <CreateBatchForm onSuccess={handleBatchCreated} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
