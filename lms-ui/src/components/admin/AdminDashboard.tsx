"use client";
import React, { useState, useEffect } from "react";
import TodoList, { TodoMainTask } from "@/components/dashboard/TodoList";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  Users,
  BookOpen,
  GraduationCap,
  Building2,
  MapPin,
  Plus,
  Search,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AdminRecentActivity from "@/components/admin/AdminRecentActivity";
import { Skeleton } from "@/components/ui/skeleton";
import { HashLoader } from "react-spinners";

import AddBranchForm from "@/components/admin/AddBranchForm";
import { getAllBranches, BranchResponse } from "@/Apis/Branch";
import { getAllBatches } from "@/Apis/Batch";
import { getAllTrainers } from "@/Apis/Trainer";
import { getAllStudents } from "@/Apis/Student";
import { useAuth } from "@/Context/AuthContext";
import { toast } from "sonner";

// Type definitions for internal state
interface DashboardBranch extends BranchResponse {
  stats: {
    students: number;
    batches: number;
    trainers: number;
  };
}

const MOCK_TODO_LIST: TodoMainTask[] = [
  {
    label: "Review New Registrations",
    category: "Admissions",
    dateTime: "Today, 10:00 AM",
    checked: false,
    subtasks: [
      { label: "Verify Documents", checked: false },
      { label: "Approve Candidates", checked: false },
    ],
  },
  {
    label: "Schedule Staff Meeting",
    category: "Management",
    dateTime: "Tomorrow, 2:00 PM",
    checked: false,
  },
  {
    label: "Update Course Material",
    category: "Curriculum",
    dateTime: "Next Week",
    checked: true,
  },
];

const ALL_BRANCH_ID = "all";

export default function AdminDashboardComponent() {
  const { token } = useAuth();
  const [selectedBranchId, setSelectedBranchId] = useState(ALL_BRANCH_ID);
  const [isAddBranchOpen, setIsAddBranchOpen] = useState(false);

  const [branches, setBranches] = useState<DashboardBranch[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all data
  const fetchData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      // 1. Fetch raw data in parallel using Promise.allSettled to prevent one failure from blocking others
      const results = await Promise.allSettled([
        getAllBranches(),
        getAllBatches(),
        getAllTrainers(),
        getAllStudents(),
      ]);

      const branchesData =
        results[0].status === "fulfilled" ? results[0].value : [];
      const batchesData =
        results[1].status === "fulfilled" ? results[1].value : [];
      const trainersData =
        results[2].status === "fulfilled" ? results[2].value : [];
      const studentsData =
        results[3].status === "fulfilled" ? results[3].value : [];

      if (results[0].status === "rejected") {
        console.error("Failed to fetch branches:", results[0].reason);
        toast.error("Failed to fetch branches");
      }

      // Handle potential data wrapping (e.g. response.data.data) if API serves it that way
      // But assuming services return the data array or object directly as response.data

      const safeBranches = Array.isArray(branchesData)
        ? branchesData
        : branchesData?.data || [];
      const safeBatches = Array.isArray(batchesData)
        ? batchesData
        : batchesData?.data || [];
      const safeTrainers = Array.isArray(trainersData)
        ? trainersData
        : trainersData?.data || [];
      const safeStudents = Array.isArray(studentsData)
        ? studentsData
        : studentsData?.data || [];

      const processedBranches = safeBranches.map((branch: BranchResponse) => {
        const branchId = branch._id;

        const studentCount = safeStudents.filter((s: any) =>
          typeof s.branch === "string"
            ? s.branch === branchId
            : s.branch?._id === branchId
        ).length;

        const batchCount = safeBatches.filter((b: any) =>
          typeof b.branch === "string"
            ? b.branch === branchId
            : b.branch?._id === branchId
        ).length;

        const trainerCount = safeTrainers.filter((t: any) =>
          typeof t.branch === "string"
            ? t.branch === branchId
            : t.branch?._id === branchId
        ).length;

        return {
          ...branch,
          stats: {
            students: studentCount,
            batches: batchCount,
            trainers: trainerCount,
          },
        };
      });

      setBranches(processedBranches);

      // If no branch is selected (or all), keep it as ALL_BRANCH_ID.
      // If previously selected branch doesn't exist anymore, reset to ALL.
      if (
        selectedBranchId !== ALL_BRANCH_ID &&
        !processedBranches.find(
          (b: DashboardBranch) => b._id === selectedBranchId
        )
      ) {
        setSelectedBranchId(ALL_BRANCH_ID);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  // Logic to handle "All Branches" or specific branch
  const isAllSelected = selectedBranchId === ALL_BRANCH_ID;

  const currentData = React.useMemo(() => {
    if (isAllSelected) {
      return {
        name: "All Branches",
        address: "Global Overview",
        stats: branches.reduce(
          (acc, curr) => ({
            students: acc.students + curr.stats.students,
            batches: acc.batches + curr.stats.batches,
            trainers: acc.trainers + curr.stats.trainers,
          }),
          { students: 0, batches: 0, trainers: 0 }
        ),
      };
    }
    return (
      branches.find((b) => b._id === selectedBranchId) || {
        name: "Unknown",
        address: "",
        stats: { students: 0, batches: 0, trainers: 0 },
      }
    );
  }, [selectedBranchId, isAllSelected, branches]);

  // Initial Loading State (Auth Check) works best with a Spinner
  if (!token) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <HashLoader color="#6366F1" size={40} />
      </div>
    );
  }

  return (
    <div className="flex gap-8 h-full relative p-2">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute top-[20%] right-[-5%] w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px]" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col gap-8 min-w-0">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-foreground tracking-tight">
                {loading ? (
                  <Skeleton className="h-10 w-48" />
                ) : (
                  currentData.name
                )}
              </h1>
              {/* Branch Select Dropdown */}
              {loading ? (
                <Skeleton className="h-10 w-10 rounded-full" />
              ) : (
                <Select
                  value={selectedBranchId}
                  onValueChange={setSelectedBranchId}
                  disabled={loading}
                >
                  <SelectTrigger className="w-auto h-auto bg-transparent border-none p-0 focus:ring-0 group">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-orange-100/50 dark:bg-orange-900/20 flex items-center justify-center text-foreground group-hover:bg-orange-100 dark:group-hover:bg-orange-900/30 transition-colors">
                        <Building2
                          size={20}
                          className="text-gray-700 dark:text-gray-300"
                        />
                      </div>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL_BRANCH_ID}>All Branches</SelectItem>
                    {branches.map((b) => (
                      <SelectItem key={b._id} value={b._id}>
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground mt-1">
              <MapPin size={14} />
              <div className="text-sm">
                {loading ? (
                  <Skeleton className="h-4 w-32" />
                ) : (
                  currentData.address || " "
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search..."
                className="pl-9 bg-white/50 dark:bg-black/50 border-white/20 backdrop-blur-sm w-full md:w-64 rounded-full"
                disabled={loading}
              />
            </div>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Bell className="w-5 h-5 text-foreground" />
            </Button>
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full h-10 px-4 shadow-lg shadow-primary/20"
              onClick={() => setIsAddBranchOpen(true)}
              disabled={loading}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Branch
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Students (Primary Blue) */}
          <div className="bg-white/60 dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-sm hover:shadow-lg transition-all relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
              <GraduationCap size={100} />
            </div>
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
                <GraduationCap size={24} />
              </div>
              <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-bold px-3 py-1 rounded-full">
                +12%
              </span>
            </div>
            <div>
              <div className="mb-1">
                {loading ? (
                  <Skeleton className="h-10 w-24" />
                ) : (
                  <h3 className="text-4xl font-extrabold text-foreground">
                    {(currentData.stats?.students || 0).toLocaleString()}
                  </h3>
                )}
              </div>
              <p className="text-sm text-muted-foreground font-medium">
                Total Students
              </p>
            </div>
          </div>

          {/* Card 2: Batches (Orange) */}
          <div className="bg-white/60 dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-sm hover:shadow-lg transition-all relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
              <BookOpen size={100} />
            </div>
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl text-orange-600 dark:text-orange-400">
                <BookOpen size={24} />
              </div>
              <span className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 text-xs font-bold px-3 py-1 rounded-full">
                Active
              </span>
            </div>
            <div>
              <div className="mb-1">
                {loading ? (
                  <Skeleton className="h-10 w-24" />
                ) : (
                  <h3 className="text-4xl font-extrabold text-foreground">
                    {(currentData.stats?.batches || 0).toLocaleString()}
                  </h3>
                )}
              </div>
              <p className="text-sm text-muted-foreground font-medium">
                Total Batches
              </p>
            </div>
          </div>

          {/* Card 3: Trainers (Emerald/Green) */}
          <div className="bg-white/60 dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-sm hover:shadow-lg transition-all relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
              <Users size={100} />
            </div>
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl text-emerald-600 dark:text-emerald-400">
                <Users size={24} />
              </div>
              <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs font-bold px-3 py-1 rounded-full">
                Verified
              </span>
            </div>
            <div>
              <div className="mb-1">
                {loading ? (
                  <Skeleton className="h-10 w-24" />
                ) : (
                  <h3 className="text-4xl font-extrabold text-foreground">
                    {(currentData.stats?.trainers || 0).toLocaleString()}
                  </h3>
                )}
              </div>
              <p className="text-sm text-muted-foreground font-medium">
                Active Trainers
              </p>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white/60 dark:bg-white/5 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-sm h-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">
              Recent Activity
            </h2>
            <Button
              variant="link"
              className="text-primary p-0 h-auto font-semibold"
            >
              View All
            </Button>
          </div>
          <AdminRecentActivity
            activity={[
              {
                type: "New Enrollment",
                detail: `5 new students joined the UX Design Batch.`,
              },
              {
                type: "Batch Completed",
                detail: "React Basics batch concluded successfully.",
              },
              {
                type: "System Maintenance",
                detail: "Scheduled maintenance for server upgrade.",
              },
            ]}
          />
        </div>
      </div>

      {/* Right Sidebar: Todo List */}
      <aside className="w-80 shrink-0 hidden xl:block">
        <div className="sticky top-6">
          <TodoList items={MOCK_TODO_LIST} />
        </div>
      </aside>

      <AddBranchForm
        open={isAddBranchOpen}
        onOpenChange={setIsAddBranchOpen}
        onSuccess={() => {
          fetchData();
        }}
      />
    </div>
  );
}
