"use client";
import React, { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Mail,
  BookOpen,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddStudentForm from "@/components/admin/forms/AddStudentForm";

// Mock Data
const MOCK_STUDENTS = [
  {
    id: 1,
    name: "Alice Johnson",
    course: "React Mastery 2024",
    branch: "Main Branch",
    progress: 75,
    attendance: 88,
    status: "Active",
    email: "alice.j@example.com",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
  },
  {
    id: 2,
    name: "Bob Smith",
    course: "Node.js Advanced",
    branch: "Downtown Branch",
    progress: 45,
    attendance: 62,
    status: "Active",
    email: "bob.smith@example.com",
    avatar: "https://randomuser.me/api/portraits/men/22.jpg",
  },
  {
    id: 3,
    name: "Charlie Brown",
    course: "UI/UX Design Fundamentals",
    branch: "Main Branch",
    progress: 92,
    attendance: 95,
    status: "Completed",
    email: "charlie.b@example.com",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
  },
  {
    id: 4,
    name: "Diana Prince",
    course: "Python for Data Science",
    branch: "Main Branch",
    progress: 30,
    attendance: 80,
    status: "Active",
    email: "diana.p@example.com",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    id: 5,
    name: "Ethan Hunt",
    course: "React Mastery 2024",
    branch: "Downtown Branch",
    progress: 60,
    attendance: 70,
    status: "Inactive",
    email: "ethan.h@example.com",
    avatar: "https://randomuser.me/api/portraits/men/11.jpg",
  },
];

export default function AdminStudentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [mounted, setMounted] = useState(false);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const filteredStudents = MOCK_STUDENTS.filter((student) => {
    const matchesSearch = student.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterStatus === "All" || student.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="relative min-h-[calc(100vh-2rem)] flex flex-col gap-8">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-20%] left-[10%] w-[600px] h-[600px] bg-indigo-200/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-teal-200/30 rounded-full blur-[100px]" />
      </div>

      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Students
          </h1>
          <p className="text-gray-500 font-medium">
            Monitor student progress and attendance
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/40 backdrop-blur-md p-2 rounded-2xl border border-white/50 shadow-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search students..."
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
                <DropdownMenuItem onClick={() => setFilterStatus("Completed")}>
                  Completed
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("Inactive")}>
                  Inactive
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Grid of Students */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredStudents.map((student) => (
          <div
            key={student.id}
            className="group relative bg-white/40 backdrop-blur-xl rounded-3xl border border-white/50 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          >
            {/* Color Accent Top Bar */}
           <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-secondary" />

            <div className="flex justify-between items-start mb-6">
              <div className="flex gap-4 items-center">
                <div className="relative">
                    <img 
                        src={student.avatar} 
                        alt={student.name}
                        className="w-14 h-14 rounded-2xl object-cover shadow-sm border-2 border-white"
                    />
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                        student.status === 'Active' ? 'bg-[var(--status-active)]' : 
                        student.status === 'Completed' ? 'bg-[var(--status-completed)]' : 'bg-[var(--status-inactive)]'
                    }`} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg leading-tight">
                    {student.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 mt-0.5">
                     <GraduationCap size={12} />
                     <span className="truncate max-w-[150px]">{student.course}</span>
                  </div>
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

            {/* Progress & Attendance Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                 <div>
                    <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1.5">
                        <span>Progress</span>
                        <span>{student.progress}%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-200/50 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-gradient-to-r from-primary to-secondary" 
                            style={{ width: `${student.progress}%` }} 
                        />
                    </div>
                 </div>
                 <div>
                    <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1.5">
                        <span>Attendance</span>
                        <span>{student.attendance}%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-200/50 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-primary" 
                            style={{ width: `${student.attendance}%` }} 
                        />
                    </div>
                 </div>
            </div>

            <div className="flex items-center gap-3 text-sm text-gray-600 bg-white/30 p-2.5 rounded-xl hover:bg-white/50 transition-colors cursor-pointer group/item mb-4">
               <Mail size={16} className="text-blue-500 group-hover/item:scale-110 transition-transform" />
               <span className="truncate">{student.email}</span>
            </div>

            <div className="pt-4 border-t border-white/30 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                    <BookOpen size={14} />
                    <span>{student.branch}</span>
                </div>
                <button className="text-xs font-bold text-primary hover:underline">
                    Detailed Report
                </button>
            </div>
          </div>
        ))}
      </div>

      {/* FAB with Dialog */}
      <Dialog open={isAddStudentOpen} onOpenChange={setIsAddStudentOpen}>
        <DialogTrigger asChild>
          <button className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-full shadow-2xl flex items-center justify-center hover:scale-110 hover:rotate-90 transition-all duration-300 z-50 group">
            <Plus size={28} className="group-hover:rotate-90 transition-transform duration-300" />
            <span className="absolute right-full mr-4 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Add New Student
            </span>
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-white/80 backdrop-blur-xl border-white/40 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Add New Student
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <AddStudentForm onSuccess={() => setIsAddStudentOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
