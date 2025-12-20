import React from "react";
import {
  MoreVertical,
  Users,
  Calendar,
  BookOpen,
  ClipboardList,
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
  return (
    <div
      className="rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 shadow-sm bg-white border border-slate-100 hover:shadow-md transition-all relative w-full"
      style={{
        background: `linear-gradient(100deg, ${batch.color}15 0%, white 40%)`,
        borderLeft: `4px solid ${batch.color}`,
      }}
    >
      {/* Top Section: Logo + Menu */}
      <div className="flex justify-between items-start sm:order-last sm:ml-auto">

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-400 hover:text-slate-600 -mr-2 -mt-2"
            >
              <MoreVertical size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Batch Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Edit className="w-4 h-4 mr-2" />
              Edit Batch
            </DropdownMenuItem>
            <Link href={`/trainer/batch/${batch.id}?tab=students`}>
              <DropdownMenuItem>
                <Users className="w-4 h-4 mr-2" />
                Student List
              </DropdownMenuItem>
            </Link>
            <Link href={`/trainer/batch/${batch.id}?tab=attendance`}>
              <DropdownMenuItem>
                <Calendar className="w-4 h-4 mr-2" />
                Attendance
              </DropdownMenuItem>
            </Link>
            <Link href={`/trainer/batch/${batch.id}?tab=assignments`}>
              <DropdownMenuItem>
                <BookOpen className="w-4 h-4 mr-2" />
                Assignments
              </DropdownMenuItem>
            </Link>
            <Link href={`/trainer/batch/${batch.id}?tab=exams`}>
              <DropdownMenuItem>
                <FileText className="w-4 h-4 mr-2" />
                Exams
              </DropdownMenuItem>
            </Link>
            <Link href={`/trainer/batch/${batch.id}?tab=results`}>
              <DropdownMenuItem>
                <GraduationCap className="w-4 h-4 mr-2" />
                Results
              </DropdownMenuItem>
            </Link>
            <Link href={`/trainer/batch/${batch.id}?tab=progress`}>
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

      {/* Content Section */}
      <div className="flex items-center gap-4 flex-1">
         <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-white shadow-sm text-2xl shrink-0">
          {batch.logo ? (
            <img
              src={batch.logo}
              alt="logo"
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <span role="img" aria-label="logo">
              🎓
            </span>
          )}
        </div>
        <div>
            <h3 className="font-bold text-lg text-slate-800 leading-tight mb-1">
            {batch.name}
            </h3>
            {batch.instructor && (
                <p className="text-xs text-slate-500 font-medium">Trainer: {batch.instructor}</p>
            )}
        </div>
      </div>

      {/* Info Stats */}
      <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 mt-2 sm:mt-0 sm:mr-4">
        <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-50/80">
          <Calendar size={14} className="text-slate-400" />
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-semibold uppercase">
              Schedule
            </span>
            <span className="text-xs font-medium text-slate-700 truncate max-w-[80px]" title={batch.schedule}>
              {batch.schedule}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-50/80">
          <Users size={14} className="text-slate-400" />
          <div className="flex flex-col">
             <span className="text-[10px] text-slate-400 font-semibold uppercase">
              Students
            </span>
            <span className="text-xs font-medium text-slate-700">
              {batch.students} Active
            </span>
          </div>
        </div>
      </div>
      
       <div className="flex items-center justify-between sm:justify-start sm:gap-4 pt-2 border-t border-slate-100 sm:border-t-0 sm:pt-0 sm:border-l sm:pl-4 sm:h-8">
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${batch.active ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
              {batch.active ? 'Active' : 'Archived'}
          </span>
           <Link href={`/trainer/batch/${batch.id}`} className="text-xs font-semibold text-sky-600 hover:underline sm:hidden">
            View Details
          </Link>
       </div>
    </div>
  );
}
