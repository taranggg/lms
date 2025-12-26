"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Calendar,
  Users,
  GraduationCap,
  Clock
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
import { Skeleton } from "@/components/ui/skeleton";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from "@/components/ui/dialog";
import CreateBatchForm from "@/components/forms/CreateBatchForm";
import { toast } from "sonner";
import { getAllBatches } from "@/Apis/Batch";
import { getAllBranches } from "@/Apis/Branch";
import { getAllTrainers } from "@/Apis/Trainer";
import { useRouter } from "next/navigation";

const MOCK_BATCHES = [
    {
        _id: "mock-1",
        title: "Full Stack Web Development - Batch A",
        branch: { name: "Main Branch" },
        trainer: { name: "You" },
        startDate: "2024-01-15",
        status: "Active",
        type: "Weekdays",
        startTime: "10:00 AM",
        endTime: "12:00 PM",
        students: new Array(12).fill(null)
    },
    {
        _id: "mock-2",
        title: "Data Science Essentials",
        branch: { name: "Online" },
        trainer: { name: "You" },
        startDate: "2024-02-01",
        status: "Running",
        type: "Weekends",
        startTime: "02:00 PM",
        endTime: "05:00 PM",
        students: new Array(8).fill(null)
    },
    {
        _id: "mock-3",
        title: "UI/UX Design Masterclass",
        branch: { name: "Downtown" },
        trainer: { name: "You" },
        startDate: "2024-03-10",
        status: "Upcoming",
        type: "Weekdays",
        startTime: "06:00 PM",
        endTime: "08:00 PM",
        students: new Array(25).fill(null)
    }
];

interface BatchListProps {
    mode: "admin" | "trainer";
    token: string;
    userId?: string;
    compact?: boolean;
}

export default function BatchList({ mode, token, userId, compact = false }: BatchListProps) {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [filterBranch, setFilterBranch] = useState("All");
    const [filterTrainer, setFilterTrainer] = useState("All");
    const [mounted, setMounted] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    
    // Data
    const [batches, setBatches] = useState<any[]>([]);
    const [branches, setBranches] = useState<any[]>([]);
    const [trainers, setTrainers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Fetch Metadata 
    useEffect(() => {
        const fetchMetadata = async () => {
            if (!token || mode !== 'admin') return;
            try {
                const [branchesRes, trainersRes] = await Promise.all([
                    getAllBranches(token),
                    getAllTrainers(token),
                ]);
                setBranches(Array.isArray(branchesRes) ? branchesRes : branchesRes?.data || []);
                setTrainers(Array.isArray(trainersRes) ? trainersRes : trainersRes?.data || []);
            } catch (error) {
                console.error("Failed to fetch metadata", error);
            }
        };
        fetchMetadata();
    }, [token, mode]);

    // Fetch Batches
    const fetchBatches = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const filters: any = {};
            if (searchQuery) filters.search = searchQuery;
            
            if (mode === 'admin') {
                if (filterBranch !== "All") filters.branch = filterBranch;
                if (filterTrainer !== "All") filters.trainer = filterTrainer;
            } else if (mode === 'trainer' && userId) {
                filters.trainer = userId;
            }

            const batchesRes = await getAllBatches(token, filters);
            const batchesData = Array.isArray(batchesRes) ? batchesRes : batchesRes?.data || [];
            
            // Mock Data Fallback for Trainer Design Verification
            if (mode === 'trainer' && batchesData.length === 0) {
                setBatches(MOCK_BATCHES);
            } else {
                setBatches(batchesData);
            }
        } catch (error) {
            console.error("Failed to fetch batches:", error);
            toast.error("Failed to load batches");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchBatches();
        }, 500); 
        return () => clearTimeout(timer);
    }, [token, filterBranch, filterTrainer, searchQuery, mode, userId]);


    const handleSuccess = () => {
        setIsCreateOpen(false);
        fetchBatches();
    };

    const handleBatchClick = (batchId: string) => {
        // Navigate to details page
        const basePath = mode === 'admin' ? '/admin/batches' : '/trainer/batches';
        router.push(`${basePath}/${batchId}`);
    };

    // Helpers
    const getBranchName = (branchIdOrObj: any) => {
        if(!branchIdOrObj) return "Unknown Branch";
        if(typeof branchIdOrObj === 'object' && branchIdOrObj.name) return branchIdOrObj.name;
        const found = branches.find(b => b._id === branchIdOrObj);
        return found ? found.name : "Unknown Branch";
    };
      
    const getTrainerName = (trainerIdOrObj: any) => {
        if(!trainerIdOrObj) return "Unassigned";
        if(typeof trainerIdOrObj === 'object' && trainerIdOrObj.name) return trainerIdOrObj.name;
        const found = trainers.find(t => t._id === trainerIdOrObj);
        return found ? found.name : "Unassigned";
    };

    const availableTrainers = useMemo(() => {
        if (filterBranch === "All") return trainers;
        return trainers.filter((t) => {
            const tBranchId = typeof t.branch === "string" ? t.branch : t.branch?._id;
            return tBranchId === filterBranch;
        });
    }, [filterBranch, trainers]);

    if (!mounted) return null;

    return (
        <div className="flex flex-col gap-6 w-full relative min-h-[calc(100vh-150px)]">
             {/* Header & Controls */}
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {!compact && (
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                            {mode === 'admin' ? 'Batches' : 'My Batches'}
                        </h1>
                        <p className="text-muted-foreground">
                            {mode === 'admin' ? 'Manage classes and schedules' : 'Manage your assigned batches'}
                        </p>
                    </div>
                )}

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative w-full md:w-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <Input
                        placeholder="Search batches..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 w-full md:w-[200px]"
                        />
                    </div>
                    
                    {mode === 'admin' && (
                        <>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="gap-2 w-full md:w-auto justify-start">
                                    <Filter size={16} />
                                    <span className="truncate max-w-[150px]">
                                        {filterBranch === "All" ? "All Branches" : getBranchName(filterBranch)}
                                    </span>
                                </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setFilterBranch("All")}>All Branches</DropdownMenuItem>
                                {branches.map((branch) => (
                                    <DropdownMenuItem key={branch._id} onClick={() => setFilterBranch(branch._id)}>
                                        {branch.name}
                                    </DropdownMenuItem>
                                ))}
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="gap-2 w-full md:w-auto justify-start">
                                    <Users size={16} />
                                    <span className="truncate max-w-[150px]">
                                        {filterTrainer === "All" ? "All Trainers" : getTrainerName(filterTrainer)}
                                    </span>
                                </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setFilterTrainer("All")}>All Trainers</DropdownMenuItem>
                                {availableTrainers.map((trainer) => (
                                    <DropdownMenuItem key={trainer._id} onClick={() => setFilterTrainer(trainer._id)}>
                                    {trainer.name}
                                    </DropdownMenuItem>
                                ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    )}
                </div>
            </div>

            {/* Grid */}
            <div className="w-full flex-1">
                {loading ? (
                   <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                          <Skeleton key={i} className="h-[200px] w-full rounded-xl" />
                      ))}
                   </div>
                ) : batches.length === 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-[50vh]">
                        <NoData 
                            message="No Batches Found" 
                            description="Try adjusting your filters or create a new batch."
                        />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {batches.map((batch) => (
                            <div
                                key={batch._id}
                                onClick={() => handleBatchClick(batch._id)}
                                className="bg-card text-card-foreground rounded-xl border shadow-sm hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 p-6 space-y-4 cursor-pointer group"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold text-lg leading-none tracking-tight group-hover:text-primary transition-colors">
                                                {batch.title}
                                            </h3>
                                            {batch.status && (
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                                                    batch.status === "Active" || batch.status === "Running"
                                                        ? "bg-green-50 text-green-700 border-green-200"
                                                        : "bg-yellow-50 text-yellow-700 border-yellow-200"
                                                }`}>
                                                    {batch.status}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                           {getBranchName(batch.branch)}
                                        </p>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 text-muted-foreground hover:text-foreground" onClick={(e) => {
                                        e.stopPropagation();
                                        // Add menu action here if needed
                                    }}>
                                        <MoreVertical size={16} />
                                    </Button>
                                </div>

                                <div className="space-y-2 pt-2">
                                    <div className="flex items-center text-sm">
                                        <div className="w-6 flex justify-center mr-2"><Calendar className="h-4 w-4 text-blue-500" /></div>
                                        <span className="text-foreground/80">{batch.type}</span>
                                    </div>
                                    <div className="flex items-center text-sm">
                                        <div className="w-6 flex justify-center mr-2"><Clock className="h-4 w-4 text-orange-500" /></div>
                                        <span className="text-foreground/80">
                                            {(batch.startTime && batch.endTime) ? `${batch.startTime} - ${batch.endTime}` : "Time N/A"}
                                        </span>
                                    </div>
                                    <div className="flex items-center text-sm">
                                        <div className="w-6 flex justify-center mr-2"><GraduationCap className="h-4 w-4 text-purple-500" /></div>
                                        <span className="text-foreground/80">{getTrainerName(batch.trainer)}</span>
                                    </div>
                                </div>

                                <div className="pt-4 flex items-center justify-between border-t border-border/50">
                                    <div className="flex items-center text-sm text-muted-foreground font-medium">
                                        <Users className="mr-2 h-4 w-4 text-indigo-500" />
                                        {batch.students ? batch.students.length : 0} Students
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* FAB */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogTrigger asChild>
                    <button className="fixed bottom-24 md:bottom-8 right-8 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:scale-110 hover:shadow-2xl active:scale-95 transition-all duration-300 ease-in-out z-50 group">
                        <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                    </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Create New Batch</DialogTitle>
                        <DialogDescription>
                            Enter the details for the new batch here. Click create when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mt-4">
                        <CreateBatchForm 
                            onSuccess={handleSuccess} 
                            fixedTrainerId={mode === 'trainer' ? userId : undefined} 
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
