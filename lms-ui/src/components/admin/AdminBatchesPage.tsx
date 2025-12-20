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
    color: "from-blue-500 to-cyan-400",
  },
  {
    id: 2,
    name: "Node.js Advanced",
    branch: "Downtown Branch",
    schedule: "Tue, Thu • 2:00 PM",
    trainer: "Mike Chen",
    students: 18,
    status: "Active",
    color: "from-emerald-500 to-teal-400",
  },
  {
    id: 3,
    name: "UI/UX Design Fundamentals",
    branch: "Main Branch",
    schedule: "Weekends • 11:00 AM",
    trainer: "Emily Davis",
    students: 30,
    status: "Upcoming",
    color: "from-purple-500 to-pink-400",
  },
  {
    id: 4,
    name: "Python for Data Science",
    branch: "Main Branch",
    schedule: "Mon, Wed • 6:00 PM",
    trainer: "Alex Thompson",
    students: 22,
    status: "Active",
    color: "from-orange-500 to-amber-400",
  },
];

export default function AdminBatchesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBranch, setFilterBranch] = useState("All");
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const filteredBatches = MOCK_BATCHES.filter((batch) => {
    const matchesSearch = batch.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterBranch === "All" || batch.branch === filterBranch;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="relative min-h-[calc(100vh-2rem)] flex flex-col gap-8">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-200/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-[20%] left-[-5%] w-[400px] h-[400px] bg-blue-200/30 rounded-full blur-[100px]" />
        <div className="absolute top-[40%] left-[30%] w-[600px] h-[600px] bg-orange-100/20 rounded-full blur-[100px]" />
      </div>

      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
            Batches
          </h1>
          <p className="text-gray-500 font-medium">
            Manage your classes and schedules
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/40 backdrop-blur-md p-2 rounded-2xl border border-white/50 shadow-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search batches..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-transparent border-none focus-visible:ring-0 w-[200px] placeholder:text-gray-400"
            />
          </div>
          <div className="h-6 w-px bg-gray-300" />
          {!mounted ? (
            <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/50 rounded-lg text-sm font-medium text-gray-600 transition-colors">
              <Filter size={16} />
              <span>{filterBranch === "All" ? "Filter" : filterBranch}</span>
            </button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/50 rounded-lg text-sm font-medium text-gray-600 transition-colors">
                  <Filter size={16} />
                  <span>{filterBranch === "All" ? "Filter" : filterBranch}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-white/90 backdrop-blur-xl"
              >
                <DropdownMenuItem onClick={() => setFilterBranch("All")}>
                  All Branches
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterBranch("Main Branch")}>
                  Main Branch
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFilterBranch("Downtown Branch")}
                >
                  Downtown Branch
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Grid of Batches */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredBatches.map((batch) => (
          <div
            key={batch.id}
            className="group relative bg-white/40 backdrop-blur-xl rounded-3xl border border-white/50 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          >
            {/* Colorful nice gradient bar at top */}
            <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${batch.color}`} />

            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-3 items-center">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${batch.color} flex items-center justify-center text-white shadow-lg`}>
                  <GraduationCap size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg leading-tight">
                    {batch.name}
                  </h3>
                  <span className="text-xs font-medium text-gray-500">
                    {batch.branch}
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-400 hover:text-gray-600 hover:bg-white/50 rounded-full"
              >
                <MoreVertical size={18} />
              </Button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-600 bg-white/30 p-2.5 rounded-xl">
                <Calendar size={16} className="text-indigo-500" />
                <span>{batch.schedule}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users size={16} className="text-orange-500" />
                  <span>{batch.students} Students</span>
                </div>
                <div className="flex -space-x-2">
                   {[1,2,3].map(i => (
                       <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-200" />
                   ))}
                   <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500">
                     +
                   </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/30">
               <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Trainer</span>
                  <span className="text-sm font-semibold text-gray-700">{batch.trainer}</span>
               </div>
               <span
                className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  batch.status === "Active"
                    ? "bg-emerald-100/50 text-emerald-700 border-emerald-200"
                    : "bg-purple-100/50 text-purple-700 border-purple-200"
                }`}
              >
                {batch.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* FAB - Floating Action Button */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 hover:rotate-90 transition-all duration-300 z-50 group">
        <Plus size={28} className="group-hover:rotate-90 transition-transform duration-300" />
        {/* Tooltip or Label - optional, maybe just icon is cleaner as requested FAB */}
        <span className="absolute right-full mr-4 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Add New Batch
        </span>
      </button>
    </div>
  );
}
