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
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Search students..."
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
            className="bg-card text-card-foreground rounded-xl border shadow-sm hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 p-6 cursor-pointer"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex gap-4 items-center">
                <div className="relative">
                    <img 
                        src={student.avatar} 
                        alt={student.name}
                        className="w-14 h-14 rounded-2xl object-cover shadow-sm bg-muted"
                    />
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${
                        student.status === 'Active' ? 'bg-green-500' : 
                        student.status === 'Completed' ? 'bg-blue-500' : 'bg-gray-400'
                    }`} />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">
                    {student.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mt-0.5">
                     <GraduationCap size={12} />
                     <span className="truncate max-w-[150px]">{student.course}</span>
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

            {/* Progress & Attendance Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                 <div>
                    <div className="flex justify-between text-xs font-semibold text-muted-foreground mb-1.5">
                        <span>Progress</span>
                        <span>{student.progress}%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-primary" 
                            style={{ width: `${student.progress}%` }} 
                        />
                    </div>
                 </div>
                 <div>
                    <div className="flex justify-between text-xs font-semibold text-muted-foreground mb-1.5">
                        <span>Attendance</span>
                        <span>{student.attendance}%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-primary" 
                            style={{ width: `${student.attendance}%` }} 
                        />
                    </div>
                 </div>
            </div>

            <div className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer group/item mb-4">
               <Mail size={16} className="text-blue-500 group-hover/item:scale-110 transition-transform" />
               <span className="truncate">{student.email}</span>
            </div>

            <div className="pt-4 border-t flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <BookOpen size={14} className="text-primary" />
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
          <button className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform duration-200 z-50">
            <Plus size={24} />
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <AddStudentForm onSuccess={() => setIsAddStudentOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
