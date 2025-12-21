import React from "react";
import {
  MoreVertical,
  Users,
  Calendar,
  BookOpen,
  GraduationCap,
  FileText,
  BarChart,
  Trash2,
  Edit,
} from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export interface Batch {
  id: number;
  name: string;
  code: string;
  schedule: string;
  students: number;
  active: boolean;
  color: string;
  logo?: string;
  instructor?: string;
}

interface TrainerBatchCardProps {
  batch: Batch;
  trainerId: string;
}

export default function TrainerBatchCard({
  batch,
  trainerId,
}: TrainerBatchCardProps) {
  // Mock student avatars for the UI demo as requested in reference
  const mockAvatars = [1, 2, 3];

  return (
    <div className="group rounded-[2rem] p-6 bg-white dark:bg-card border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all duration-300 relative w-full flex flex-col gap-4">
       {/* Header: Title & Actions */}
       <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
             <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  {batch.name}
                </h3>
                <span
                  className={`text-[10px] px-2.5 py-0.5 rounded-full font-medium border ${
                    batch.active
                      ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/50"
                      : "bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800"
                  }`}
                >
                  {batch.active ? "Active" : "Archived"}
                </span>
             </div>
             <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
               Main Branch
             </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 -mr-2 text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 rounded-full"
              >
                <MoreVertical size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Batch Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Edit className="w-4 h-4 mr-2" />
                Edit Batch
              </DropdownMenuItem>
              <Link href={`/trainer/${trainerId}/${batch.id}?tab=students`}>
                <DropdownMenuItem>
                   <Users className="w-4 h-4 mr-2" />
                   Student List
                </DropdownMenuItem>
              </Link>
              <Link href={`/trainer/${trainerId}/${batch.id}?tab=attendance`}>
                 <DropdownMenuItem>
                  <Calendar className="w-4 h-4 mr-2" />
                  Attendance
                 </DropdownMenuItem>
              </Link>
              <Link href={`/trainer/${trainerId}/${batch.id}?tab=assignments`}>
                <DropdownMenuItem>
                  <BookOpen className="w-4 h-4 mr-2" />
                  Assignments
                </DropdownMenuItem>
              </Link>
              <Link href={`/trainer/${trainerId}/${batch.id}?tab=exams`}>
                <DropdownMenuItem>
                  <FileText className="w-4 h-4 mr-2" />
                  Exams
                </DropdownMenuItem>
              </Link>
              <Link href={`/trainer/${trainerId}/${batch.id}?tab=results`}>
                <DropdownMenuItem>
                  <GraduationCap className="w-4 h-4 mr-2" />
                  Results
                </DropdownMenuItem>
              </Link>
              <Link href={`/trainer/${trainerId}/${batch.id}?tab=progress`}>
                <DropdownMenuItem>
                  <BarChart className="w-4 h-4 mr-2" />
                  Progress
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600 focus:text-red-600">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Batch
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
       </div>

       {/* Link Wrapper for clickable body */}
       <Link href={`/trainer/${trainerId}/${batch.id}`} className="flex flex-col gap-3 cursor-pointer">
          {/* Info Rows */}
          <div className="flex flex-col gap-2.5 mt-1">
             <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                <Calendar size={16} className="text-blue-500" />
                <span className="text-sm font-medium">{batch.schedule}</span>
             </div>
             <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                <GraduationCap size={16} className="text-purple-500" />
                <span className="text-sm font-medium">{batch.instructor || "Instructor Name"}</span>
             </div>
          </div>
       </Link>

       {/* Divider */}
       <div className="h-px w-full bg-slate-100 dark:bg-slate-800 my-1" />

       {/* Footer: Stats & Avatars */}
       <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
             <Users size={18} className="text-orange-500" />
             <span className="text-sm font-medium">{batch.students} Students</span>
          </div>

          <div className="flex -space-x-2 items-center">
             {mockAvatars.map((i) => (
                <div key={i} className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-card flex items-center justify-center text-[10px] font-bold text-slate-500">
                   S{i}
                </div>
             ))}
             <div className="w-7 h-7 rounded-full bg-slate-50 dark:bg-slate-900 border-2 border-white dark:border-card flex items-center justify-center text-[10px] items-center justify-center">
                <span className="mb-0.5">+</span>
             </div>
          </div>
       </div>
    </div>
  );
}
