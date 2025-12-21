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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddTrainerForm from "@/components/admin/forms/AddTrainerForm";

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
    avatar: "https://randomuser.me/api/portraits/men/86.jpg",
  },
];

export default function AdminTrainersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [mounted, setMounted] = useState(false);
  const [isAddTrainerOpen, setIsAddTrainerOpen] = useState(false);

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
          
          {!mounted ? (
            <Button variant="outline" className="gap-2">
              <Filter size={16} />
              <span>{filterStatus === "All" ? "Status" : filterStatus}</span>
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                   <Filter size={16} />
                   <span>{filterStatus === "All" ? "Status" : filterStatus}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
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
            className="bg-card text-card-foreground rounded-xl border shadow-sm hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 p-5 space-y-4 cursor-pointer"
          >
            <div className="flex justify-between items-start">
              <div className="flex gap-3 items-center">
                <div className="relative">
                    <img 
                        src={trainer.avatar} 
                        alt={trainer.name}
                        className="w-12 h-12 rounded-xl object-cover shadow-sm bg-muted"
                    />
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${trainer.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'}`} />
                </div>
                <div>
                  <h3 className="font-bold text-base leading-tight">
                    {trainer.name}
                  </h3>
                  <span className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-md mt-1 inline-block">
                    {trainer.specialization}
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
                 <div className="flex flex-col">
                    <span className="text-lg font-bold leading-none">{trainer.rating}</span>
                    <span className="text-[10px] text-muted-foreground font-medium">Rating</span>
                 </div>
                 <div className="w-px bg-border my-1" />
                 <div className="flex flex-col">
                    <span className="text-lg font-bold leading-none">{trainer.students}</span>
                    <span className="text-[10px] text-muted-foreground font-medium">Students</span>
                 </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer group/item">
                <Mail size={14} className="text-blue-500 group-hover/item:scale-110 transition-transform" />
                <span className="truncate text-xs">{trainer.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer group/item">
                <Phone size={14} className="text-green-500 group-hover/item:scale-110 transition-transform" />
                <span className="text-xs">{trainer.phone}</span>
              </div>
            </div>

            <div className="pt-3 border-t flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                    <BookOpen size={14} className="text-primary" />
                    <span>{trainer.activeBatches} Batches</span>
                </div>
                <button className="text-[10px] font-bold text-primary hover:underline uppercase tracking-wide">
                    View Profile
                </button>
            </div>
          </div>
        ))}
      </div>

      {/* FAB with Dialog */}
      <Dialog open={isAddTrainerOpen} onOpenChange={setIsAddTrainerOpen}>
        <DialogTrigger asChild>
          <button className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:scale-110 hover:shadow-2xl active:scale-95 transition-all duration-300 ease-in-out z-50 group">
            <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Trainer</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <AddTrainerForm onSuccess={() => setIsAddTrainerOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
