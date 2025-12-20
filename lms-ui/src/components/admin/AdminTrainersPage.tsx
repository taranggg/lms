"use client";
import React, { useState } from "react";
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

// Mock Data
const MOCK_TRAINERS = [
  {
    id: 1,
    name: "Sarah Wilson",
    specialization: "Frontend Development",
    rating: 4.8,
    activeBatches: 3,
    students: 120,
    email: "sarah.w@example.com",
    phone: "+1 234 567 890",
    status: "Active",
    color: "from-pink-500 to-rose-400",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 2,
    name: "Mike Chen",
    specialization: "Backend & DevOps",
    rating: 4.9,
    activeBatches: 2,
    students: 85,
    email: "mike.c@example.com",
    phone: "+1 234 567 891",
    status: "On Leave",
    color: "from-violet-500 to-indigo-400",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 3,
    name: "Emily Davis",
    specialization: "UI/UX Design",
    rating: 4.7,
    activeBatches: 4,
    students: 150,
    email: "emily.d@example.com",
    phone: "+1 234 567 892",
    status: "Active",
    color: "from-cyan-500 to-teal-400",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    id: 4,
    name: "Alex Thompson",
    specialization: "Data Science",
    rating: 4.9,
    activeBatches: 1,
    students: 45,
    email: "alex.t@example.com",
    phone: "+1 234 567 893",
    status: "Active",
    color: "from-amber-500 to-orange-400",
    avatar: "https://randomuser.me/api/portraits/men/86.jpg",
  },
];

export default function AdminTrainersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const filteredTrainers = MOCK_TRAINERS.filter((trainer) => {
    const matchesSearch = trainer.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterStatus === "All" || trainer.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="relative min-h-[calc(100vh-2rem)] flex flex-col gap-8">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[20%] w-[500px] h-[500px] bg-pink-200/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] left-[-10%] w-[400px] h-[400px] bg-cyan-200/30 rounded-full blur-[100px]" />
      </div>

      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
            Trainers
          </h1>
          <p className="text-gray-500 font-medium">
            Manage your expert instructors
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/40 backdrop-blur-md p-2 rounded-2xl border border-white/50 shadow-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search trainers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-transparent border-none focus-visible:ring-0 w-[200px] placeholder:text-gray-400"
            />
          </div>
          <div className="h-6 w-px bg-gray-300" />
          {!mounted ? (
            <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/50 rounded-lg text-sm font-medium text-gray-600 transition-colors">
              <Filter size={16} />
              <span>{filterStatus === "All" ? "Status" : filterStatus}</span>
            </button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/50 rounded-lg text-sm font-medium text-gray-600 transition-colors">
                  <Filter size={16} />
                  <span>{filterStatus === "All" ? "Status" : filterStatus}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-white/90 backdrop-blur-xl"
              >
                <DropdownMenuItem onClick={() => setFilterStatus("All")}>
                  All Status
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("Active")}>
                  Active
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("On Leave")}>
                  On Leave
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Grid of Trainers */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTrainers.map((trainer) => (
          <div
            key={trainer.id}
            className="group relative bg-white/40 backdrop-blur-xl rounded-3xl border border-white/50 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          >
            {/* Gradient Bar */}
            <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${trainer.color}`} />

            <div className="flex justify-between items-start mb-6">
              <div className="flex gap-4 items-center">
                <div className="relative">
                    <img 
                        src={trainer.avatar} 
                        alt={trainer.name}
                        className="w-14 h-14 rounded-2xl object-cover shadow-sm border-2 border-white"
                    />
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${trainer.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'}`} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg leading-tight">
                    {trainer.name}
                  </h3>
                  <span className="text-xs font-medium text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-md">
                    {trainer.specialization}
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

            <div className="grid grid-cols-2 gap-3 mb-6">
                 <div className="bg-white/50 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                    <span className="text-2xl font-bold text-gray-800">{trainer.rating}</span>
                    <span className="text-xs text-gray-500 font-medium">Avg Rating</span>
                 </div>
                 <div className="bg-white/50 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                    <span className="text-2xl font-bold text-gray-800">{trainer.students}</span>
                    <span className="text-xs text-gray-500 font-medium">Students</span>
                 </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-600 bg-white/30 p-2.5 rounded-xl hover:bg-white/50 transition-colors cursor-pointer group/item">
                <Mail size={16} className="text-blue-500 group-hover/item:scale-110 transition-transform" />
                <span className="truncate">{trainer.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 bg-white/30 p-2.5 rounded-xl hover:bg-white/50 transition-colors cursor-pointer group/item">
                <Phone size={16} className="text-green-500 group-hover/item:scale-110 transition-transform" />
                <span>{trainer.phone}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/30 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                    <BookOpen size={16} className="text-gray-400" />
                    <span>{trainer.activeBatches} Active Batches</span>
                </div>
                <button className="text-xs font-bold text-indigo-600 hover:underline">
                    View Profile
                </button>
            </div>
          </div>
        ))}
      </div>

      {/* FAB */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 hover:rotate-90 transition-all duration-300 z-50 group">
        <Plus size={28} className="group-hover:rotate-90 transition-transform duration-300" />
        <span className="absolute right-full mr-4 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Add New Trainer
        </span>
      </button>
    </div>
  );
}
