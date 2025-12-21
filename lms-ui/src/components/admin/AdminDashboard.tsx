"use client";
import React, { useState } from "react";
import TodoList, { TodoMainTask } from "@/components/dashboard/TodoList";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users, BookOpen, GraduationCap, Building2, MapPin, Plus, Search, Bell, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AdminRecentActivity from "@/components/admin/AdminRecentActivity";

// Mock Data for Branches
const BRANCHES = [
  {
    id: "1",
    name: "Main Branch",
    address: "123 Tech Park, Silicon Valley, CA",
    stats: {
      students: 1240,
      batches: 24,
      trainers: 18,
    },
  },
  {
    id: "2",
    name: "Downtown Branch",
    address: "456 Innovation Ave, New York, NY",
    stats: {
      students: 850,
      batches: 15,
      trainers: 12,
    },
  },
];

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
  const [selectedBranchId, setSelectedBranchId] = useState(BRANCHES[0].id);

  // Logic to handle "All Branches" or specific branch
  const isAllSelected = selectedBranchId === ALL_BRANCH_ID;

  const currentData = React.useMemo(() => {
    if (isAllSelected) {
      return {
        name: "All Branches",
        address: "Global Overview",
        stats: BRANCHES.reduce(
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
      BRANCHES.find((b) => b.id === selectedBranchId) || {
        ...BRANCHES[0],
        name: "Unknown",
        address: "",
      }
    );
  }, [selectedBranchId, isAllSelected]);

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
                 {currentData.name}
               </h1>
               {/* Branch Select Dropdown */}
                <Select
                    value={selectedBranchId}
                    onValueChange={setSelectedBranchId}
                >
                    <SelectTrigger className="w-auto h-auto bg-transparent border-none p-0 focus:ring-0 group">
                      <div className="flex items-center gap-2">
                         <div className="w-10 h-10 rounded-full bg-orange-100/50 dark:bg-orange-900/20 flex items-center justify-center text-foreground group-hover:bg-orange-100 dark:group-hover:bg-orange-900/30 transition-colors">
                           <Building2 size={20} className="text-gray-700 dark:text-gray-300" />
                         </div>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ALL_BRANCH_ID}>All Branches</SelectItem>
                      {BRANCHES.map((b) => (
                        <SelectItem key={b.id} value={b.id}>
                          {b.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground mt-1">
               <MapPin size={14} />
               <p className="text-sm">{currentData.address}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
               <Input 
                 placeholder="Search..." 
                 className="pl-9 bg-white/50 dark:bg-black/50 border-white/20 backdrop-blur-sm w-full md:w-64 rounded-full"
               />
            </div>
            <Button variant="ghost" size="icon" className="rounded-full">
               <Bell className="w-5 h-5 text-foreground" />
            </Button>
             <Button 
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full h-10 px-4 shadow-lg shadow-primary/20"
                onClick={() => {}} // Hook up to logic if needed
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
                <h3 className="text-4xl font-extrabold text-foreground mb-1">
                  {currentData.stats.students.toLocaleString()}
                </h3>
                <p className="text-sm text-muted-foreground font-medium">Total Students</p>
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
                <h3 className="text-4xl font-extrabold text-foreground mb-1">
                  {currentData.stats.batches.toLocaleString()}
                </h3>
                <p className="text-sm text-muted-foreground font-medium">Total Batches</p>
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
                <h3 className="text-4xl font-extrabold text-foreground mb-1">
                  {currentData.stats.trainers.toLocaleString()}
                </h3>
                <p className="text-sm text-muted-foreground font-medium">Active Trainers</p>
             </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white/60 dark:bg-white/5 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-sm h-full">
             <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">Recent Activity</h2>
                <Button variant="link" className="text-primary p-0 h-auto font-semibold">View All</Button>
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
    </div>
  );
}

