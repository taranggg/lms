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
import { Users, BookOpen, GraduationCap, Building2, MapPin } from "lucide-react";
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
    <div className="flex gap-6 h-full relative">
      {/* Background Blobs for Glassmorphism Context */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-200/30 rounded-full blur-[100px]" />
        <div className="absolute top-[20%] right-[-5%] w-[400px] h-[400px] bg-blue-200/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-orange-100/40 rounded-full blur-[100px]" />
      </div>

      {/* Middle Section: Branch Info + Stats + Content */}
      <div className="flex-1 flex flex-col gap-8 min-w-0">
        {/* Branch Info Card */}
        <div className="bg-white/40 backdrop-blur-xl rounded-3xl border border-white/50 p-8 shadow-sm transition-all hover:shadow-md relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
             <Building2 size={120} />
          </div>
          
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                 <div className="p-2 bg-white/60 rounded-xl shadow-sm">
                    {isAllSelected ? <Building2 className="text-indigo-600" size={24} /> : <MapPin className="text-indigo-600" size={24} />}
                 </div>
                 <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                    {currentData.name}
                 </h1>
              </div>
              <p className="text-gray-500 font-medium ml-1">
                {currentData.address}
              </p>
            </div>
            
            <Select
                value={selectedBranchId}
                onValueChange={setSelectedBranchId}
            >
                <SelectTrigger className="w-[220px] bg-white/50 border-white/40 backdrop-blur-md rounded-xl h-12 shadow-sm hover:bg-white/80 transition-colors focus:ring-indigo-200 focus:border-indigo-300">
                  <SelectValue placeholder="Select Branch" />
                </SelectTrigger>
                <SelectContent className="bg-white/90 backdrop-blur-xl border-white/50 rounded-xl shadow-xl">
                  <SelectItem value={ALL_BRANCH_ID} className="font-semibold text-indigo-900 focus:bg-indigo-50 focus:text-indigo-900 cursor-pointer">
                    All Branches
                  </SelectItem>
                  {BRANCHES.map((b) => (
                    <SelectItem key={b.id} value={b.id} className="cursor-pointer">
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Students Card */}
          <div className="bg-gradient-to-br from-blue-50/50 to-white/50 backdrop-blur-lg rounded-3xl border border-white/60 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
               <div className="w-12 h-12 bg-blue-100/80 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-inner">
                  <GraduationCap size={24} />
               </div>
               <span className="text-xs font-bold px-2 py-1 bg-blue-100/50 text-blue-700 rounded-lg border border-blue-200/30">
                  +12%
               </span>
            </div>
            <div className="text-4xl font-extrabold text-blue-950 mb-1 tracking-tight">
              {currentData.stats.students.toLocaleString()}
            </div>
            <div className="text-sm text-blue-600/80 font-medium">
              Total Students
            </div>
          </div>

          {/* Batches Card */}
          <div className="bg-gradient-to-br from-orange-50/50 to-white/50 backdrop-blur-lg rounded-3xl border border-white/60 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
               <div className="w-12 h-12 bg-orange-100/80 rounded-2xl flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors duration-300 shadow-inner">
                  <BookOpen size={24} />
               </div>
               <span className="text-xs font-bold px-2 py-1 bg-orange-100/50 text-orange-700 rounded-lg border border-orange-200/30">
                  Active
               </span>
            </div>
            <div className="text-4xl font-extrabold text-orange-950 mb-1 tracking-tight">
              {currentData.stats.batches.toLocaleString()}
            </div>
            <div className="text-sm text-orange-600/80 font-medium">
              Total Batches
            </div>
          </div>

          {/* Trainers Card */}
          <div className="bg-gradient-to-br from-emerald-50/50 to-white/50 backdrop-blur-lg rounded-3xl border border-white/60 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
               <div className="w-12 h-12 bg-emerald-100/80 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300 shadow-inner">
                  <Users size={24} />
               </div>
               <span className="text-xs font-bold px-2 py-1 bg-emerald-100/50 text-emerald-700 rounded-lg border border-emerald-200/30">
                  Verified
               </span>
            </div>
            <div className="text-4xl font-extrabold text-emerald-950 mb-1 tracking-tight">
              {currentData.stats.trainers.toLocaleString()}
            </div>
            <div className="text-sm text-emerald-600/80 font-medium">
              Active Trainers
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/40 backdrop-blur-xl rounded-3xl border border-white/50 p-8 shadow-sm">
             <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Activity</h2>
             <AdminRecentActivity
               activity={[
                 {
                   type: "New Enrollment",
                   detail: `5 new students joined ${currentData.name === "All Branches" ? "various branches" : currentData.name}`,
                 },
                 {
                   type: "Batch Completed",
                   detail: "React Basics batch concluded successfully",
                 },
               ]}
             />
        </div>
      </div>

      {/* Right Section: Todo List */}
      <aside className="w-80 shrink-0 hidden xl:block">
        <div className="sticky top-6">
          <TodoList items={MOCK_TODO_LIST} />
        </div>
      </aside>
    </div>
  );
}
