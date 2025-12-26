"use client";
import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Mail,
  Phone,
  BookOpen,
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
import AddTrainerForm from "@/components/forms/AddTrainerForm";
import { useAuth } from "@/Context/AuthContext";
import { getAllTrainers } from "@/Apis/Trainer";
import { getAllBranches } from "@/Apis/Branch";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminTrainersPage() {
  const { token } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBranch, setFilterBranch] = useState("All");
  const [mounted, setMounted] = useState(false);
  const [isAddTrainerOpen, setIsAddTrainerOpen] = useState(false);
  
  const [trainers, setTrainers] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch Branches Metadata only once
  useEffect(() => {
    const fetchMetadata = async () => {
        if (!token) return;
        try {
            const branchesRes = await getAllBranches(token);
            const branchesData = Array.isArray(branchesRes) ? branchesRes : branchesRes?.data || [];
            setBranches(branchesData);
        } catch (error) {
            console.error("Failed to fetch branches metadata", error);
        }
    };
    fetchMetadata();
  }, [token]);

  const fetchTrainers = async () => {
    if(!token) return;
    setLoading(true);
    try {
      const filters: any = {};
      if (filterBranch !== "All") filters.branch = filterBranch;
      if (searchQuery) filters.search = searchQuery;  // or 'domain' if that's what backend expects for simple search, but 'search' is standard

      const trainersRes = await getAllTrainers(token, filters);
      const trainersData = Array.isArray(trainersRes) ? trainersRes : trainersRes?.data || [];
      
      setTrainers(trainersData);
    } catch (error) {
       console.error("Failed to fetch trainer data", error);
       toast.error("Failed to load trainers");
    } finally {
        setLoading(false);
    }
  };

  // Debounce search query and re-fetch on filter change
  useEffect(() => {
      const timer = setTimeout(() => {
        fetchTrainers();
      }, 500);
      return () => clearTimeout(timer);
  }, [token, filterBranch, searchQuery]);

  // Helper to get Branch Name by ID
  const getBranchName = (branchIdOrObj: any) => {
    if(!branchIdOrObj) return "N/A";
    if(typeof branchIdOrObj === 'object' && branchIdOrObj.name) return branchIdOrObj.name;
    const found = branches.find(b => b._id === branchIdOrObj);
    return found ? found.name : "N/A";
  };
  
  const handleSuccess = () => {
      setIsAddTrainerOpen(false);
      fetchTrainers();
  }

  if(!mounted) return null;

  return (
    <div className="relative min-h-[calc(100vh-2rem)] flex flex-col gap-8">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Trainers</h1>
          <p className="text-muted-foreground">
            Manage your expert instructors
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Search trainers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-[200px]"
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <Filter size={16} />
                    <span>{filterBranch === "All" ? "All Branches" : getBranchName(filterBranch)}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setFilterBranch("All")}>
                    All Branches
                </DropdownMenuItem>
                {branches.map((b) => (
                    <DropdownMenuItem key={b._id} onClick={() => setFilterBranch(b._id)}>
                        {b.name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Grid of Trainers */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-[200px] w-full rounded-xl" />
            ))}
        </div>
      ) : trainers.length === 0 ? (
          <NoData 
            message="No Trainers Found" 
            description="We couldn't find any trainers matching your search."
          />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {trainers.map((trainer) => (
            <div
                key={trainer._id}
                className="bg-card text-card-foreground rounded-xl border shadow-sm hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 p-5 space-y-4 cursor-pointer"
            >
                <div className="flex justify-between items-start">
                <div className="flex gap-3 items-center">
                    <div className="relative">
                         {/* Placeholder Avatar logic */}
                         <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">
                             {(() => {
                                 const name = trainer.name;
                                 if (typeof name === 'string') return name.charAt(0);
                                 if (typeof name === 'object' && name !== null) return (name.first?.[0] || "T");
                                 return "T";
                             })()}
                         </div>
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background bg-green-500`} />
                    </div>
                  <div>
                    <h3 className="font-bold text-base leading-tight">
                        {typeof trainer.name === 'object' && trainer.name !== null 
                            ? `${trainer.name.first || ''} ${trainer.name.last || ''}`.trim() || "Unknown Trainer"
                            : trainer.name || "Unknown Trainer"
                        }
                    </h3>
                    <span className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-md mt-1 inline-block">
                        {(() => {
                            if (!trainer.domain) return "Instructor";
                            if (typeof trainer.domain === 'object') {
                                return trainer.domain.name || "Instructor";
                            }
                            return trainer.domain;
                        })()}
                    </span>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 -mr-2 text-muted-foreground"
                >
                    <MoreVertical size={16} />
                </Button>
                </div>

                <div className="flex gap-4 text-sm">
                    {/* Placeholder Stats as API doesn't return them yet */}
                    <div className="flex flex-col">
                        <span className="text-lg font-bold leading-none">5.0</span>
                        <span className="text-[10px] text-muted-foreground font-medium">Rating</span>
                    </div>
                    <div className="w-px bg-border my-1" />
                    <div className="flex flex-col">
                        <span className="text-lg font-bold leading-none">--</span>
                        <span className="text-[10px] text-muted-foreground font-medium">Students</span>
                    </div>
                     <div className="w-px bg-border my-1" />
                    <div className="flex flex-col">
                         {/* We could potentially count this from batches if we fetched all batches and filtered */}
                        <span className="text-lg font-bold leading-none">--</span>
                        <span className="text-[10px] text-muted-foreground font-medium">Batches</span>
                    </div>
                </div>

                <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer group/item">
                    <Mail size={14} className="text-blue-500 group-hover/item:scale-110 transition-transform" />
                    <span className="truncate text-xs">
                        {typeof trainer.email === 'object' && trainer.email !== null 
                            ? trainer.email.email 
                            : trainer.email
                        }
                    </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer group/item">
                    <Phone size={14} className="text-green-500 group-hover/item:scale-110 transition-transform" />
                    <span className="text-xs">{trainer.mobileNumber || "N/A"}</span>
                </div>
                </div>

                <div className="pt-3 border-t flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                        <BookOpen size={14} className="text-primary" />
                        <span>{getBranchName(trainer.branch)}</span>
                    </div>
                    <button className="text-[10px] font-bold text-primary hover:underline uppercase tracking-wide">
                        View Profile
                    </button>
                </div>
            </div>
            ))}
        </div>
      )}

      {/* FAB with Dialog */}
      <Dialog open={isAddTrainerOpen} onOpenChange={setIsAddTrainerOpen}>
        <DialogTrigger asChild>
          <button className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:scale-110 hover:shadow-2xl active:scale-95 transition-all duration-300 ease-in-out z-50 group">
            <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Add New Trainer</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <AddTrainerForm onSuccess={handleSuccess} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
