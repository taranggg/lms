"use client";
import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Mail,
  BookOpen,
  GraduationCap,
  Users,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import NoData from "@/components/common/NoData";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddStudentForm from "@/components/admin/forms/AddStudentForm";
import { useAuth } from "@/Context/AuthContext";
import { getAllStudents } from "@/Apis/Student";
import { getAllBranches } from "@/Apis/Branch";
import { getAllBatches } from "@/Apis/Batch";
import { getAllTrainers } from "@/Apis/Trainer";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminStudentsPage() {
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBranch, setFilterBranch] = useState("All");
  const [filterBatch, setFilterBatch] = useState("All");
  const [filterTrainer, setFilterTrainer] = useState("All");
  const [mounted, setMounted] = useState(false);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);

  const [students, setStudents] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [trainers, setTrainers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch Metadata (Branches, Batches, Trainers) only once
  useEffect(() => {
    const fetchMetadata = async () => {
      if (!isAuthenticated) return;
      try {
        const [branchesRes, batchesRes, trainersRes] = await Promise.all([
          getAllBranches(),
          getAllBatches(),
          getAllTrainers(),
        ]);
        const branchesData = Array.isArray(branchesRes)
          ? branchesRes
          : branchesRes?.data || [];
        const batchesData = Array.isArray(batchesRes)
          ? batchesRes
          : batchesRes?.data || [];
        const trainersData = Array.isArray(trainersRes)
          ? trainersRes
          : trainersRes?.data || [];

        setBranches(branchesData);
        setBatches(batchesData);
        setTrainers(trainersData);
      } catch (error) {
        console.error("Failed to fetch metadata", error);
      }
    };
    fetchMetadata();
  }, [isAuthenticated]);

  const fetchStudents = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const filters: any = {};
      if (filterBranch !== "All") filters.branch = filterBranch;
      if (filterBatch !== "All") filters.batch = filterBatch;
      if (filterTrainer !== "All") filters.trainer = filterTrainer;
      if (searchQuery) filters.search = searchQuery;

      const studentsRes = await getAllStudents(filters);
      const studentsData = Array.isArray(studentsRes)
        ? studentsRes
        : studentsRes?.data || [];
      setStudents(studentsData);
    } catch (error) {
      console.error("Failed to fetch student data", error);
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  // Debounce search query and re-fetch on filter change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStudents();
    }, 500);
    return () => clearTimeout(timer);
  }, [isAuthenticated, filterBranch, filterBatch, filterTrainer, searchQuery]);

  const handleSuccess = () => {
    setIsAddStudentOpen(false);
    fetchStudents(); // Refresh list
  };

  // Reset filters
  useEffect(() => {
    setFilterBatch("All");
    setFilterTrainer("All");
  }, [filterBranch]);

  // Helper getters
  const getBranchName = (branch: any) => {
    if (!branch) return "N/A";
    const id = typeof branch === "string" ? branch : branch._id;
    const found = branches.find((b) => b._id === id);
    return found ? found.name : "N/A";
  };

  const getBatchName = (batch: any) => {
    if (!batch) return "Unaasigned";
    const id = typeof batch === "string" ? batch : batch._id;
    const found = batches.find((b) => b._id === id);
    return found ? found.name : "N/A";
  };

  // Helper to get Trainer Name by ID
  const getTrainerName = (trainerIdOrObj: any) => {
    if (!trainerIdOrObj) return "Unassigned";
    if (typeof trainerIdOrObj === "object" && trainerIdOrObj.name)
      return trainerIdOrObj.name;
    const found = trainers.find((t) => t._id === trainerIdOrObj);
    return found ? found.name : "Unassigned";
  };

  // Derived Filters
  const availableBatches = React.useMemo(() => {
    if (filterBranch === "All") return batches;
    return batches.filter((batch) => {
      const bBranchId =
        typeof batch.branch === "string" ? batch.branch : batch.branch?._id;
      return bBranchId === filterBranch;
    });
  }, [filterBranch, batches]);

  // Derive available trainers based on selected branch
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
          <h1 className="text-3xl font-bold tracking-tight">Students</h1>
          <p className="text-muted-foreground">
            Monitor student progress and attendance
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <Input
              placeholder="Search students..."
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
                    ? "Branch"
                    : getBranchName(filterBranch)}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilterBranch("All")}>
                All Branches
              </DropdownMenuItem>
              {branches.map((b) => (
                <DropdownMenuItem
                  key={b._id}
                  onClick={() => setFilterBranch(b._id)}
                >
                  {b.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Batch Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <GraduationCap size={16} />
                <span>
                  {filterBatch === "All" ? "Batch" : getBatchName(filterBatch)}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilterBatch("All")}>
                All Batches
              </DropdownMenuItem>
              {availableBatches.map((b) => (
                <DropdownMenuItem
                  key={b._id}
                  onClick={() => setFilterBatch(b._id)}
                >
                  {b.name}
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
                    ? "Trainer"
                    : getTrainerName(filterTrainer)}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilterTrainer("All")}>
                All Trainers
              </DropdownMenuItem>
              {availableTrainers.map((t) => (
                <DropdownMenuItem
                  key={t._id}
                  onClick={() => setFilterTrainer(t._id)}
                >
                  {t.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Grid of Students */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-[200px] w-full rounded-xl" />
          ))}
        </div>
      ) : students.length === 0 ? (
        <NoData
          message="No Students Found"
          description="We couldn't find any students matching your search."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {students.map((student) => (
            <div
              key={student._id}
              className="bg-card text-card-foreground rounded-xl border shadow-sm hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 p-6 cursor-pointer"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-4 items-center">
                  <div className="relative">
                    {/* Placeholder Avatar */}
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                      {student.name?.charAt(0) || "S"}
                    </div>
                    <div
                      className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${
                        "bg-green-500" // Default active for now
                      }`}
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-tight">
                      {student.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mt-0.5">
                      <GraduationCap size={12} />
                      <span className="truncate max-w-[150px]">
                        {getBatchName(student.batch)}
                      </span>
                    </div>
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

              {/* Progress & Attendance Stats - Placeholder as API might not return this yet or structure differs */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-muted-foreground mb-1.5">
                    <span>Progress</span>
                    <span>{student.progress || 0}%</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${student.progress || 0}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-semibold text-muted-foreground mb-1.5">
                    <span>Attendance</span>
                    <span>{student.attendance || 0}%</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${student.attendance || 0}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer group/item mb-4">
                <Mail
                  size={16}
                  className="text-blue-500 group-hover/item:scale-110 transition-transform"
                />
                <span className="truncate">{student.email}</span>
              </div>

              <div className="pt-4 border-t flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <BookOpen size={14} className="text-primary" />
                  <span>{getBranchName(student.branch)}</span>
                </div>
                <button className="text-xs font-bold text-primary hover:underline">
                  Detailed Report
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FAB with Dialog */}
      <Dialog open={isAddStudentOpen} onOpenChange={setIsAddStudentOpen}>
        <DialogTrigger asChild>
          <button className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:scale-110 hover:shadow-2xl active:scale-95 transition-all duration-300 ease-in-out z-50 group">
            <Plus
              size={24}
              className="group-hover:rotate-90 transition-transform duration-300"
            />
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <AddStudentForm onSuccess={handleSuccess} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
