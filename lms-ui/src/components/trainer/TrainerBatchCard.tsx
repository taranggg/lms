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
  return (
    <div
      className="rounded-xl p-3 flex flex-col md:flex-row gap-3 shadow-sm bg-white border border-slate-100 hover:shadow-md transition-all relative w-full items-start"
      style={{
        background: `linear-gradient(100deg, ${batch.color}15 0%, white 40%)`,
        borderLeft: `4px solid ${batch.color}`,
      }}
    >
      {/* Absolute Menu for Space Saving */}
      <div className="absolute top-2 right-2 md:static md:order-last">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-slate-400 hover:text-slate-600"
            >
              <MoreVertical size={14} />
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

      {/* Main Content Group */}
      <Link href={`/trainer/${trainerId}/${batch.id}`} className="flex-1 min-w-0 pr-8 md:pr-0 cursor-pointer block">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white shadow-sm text-xl shrink-0">
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
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-base text-slate-800 leading-tight mb-0.5 truncate pr-2">
              {batch.name}
            </h3>
            {batch.instructor && (
              <p className="text-[10px] text-slate-500 font-medium">
                Trainer: {batch.instructor}
              </p>
            )}

            {/* Mobile/Compact Tablet: Stats below text */}
            <div className="grid grid-cols-2 gap-2 mt-3 xl:flex xl:items-center xl:gap-4">
              <div className="flex items-center gap-1.5 p-1.5 px-2 rounded-lg bg-slate-50/80 border border-slate-100">
                <Calendar size={12} className="text-slate-400" />
                <div className="flex flex-col">
                  <span className="text-[9px] text-slate-400 font-semibold uppercase leading-none mb-0.5">
                    Schedule
                  </span>
                  <span
                    className="text-[11px] font-medium text-slate-700 truncate max-w-[80px]"
                    title={batch.schedule}
                  >
                    {batch.schedule}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 p-1.5 px-2 rounded-lg bg-slate-50/80 border border-slate-100">
                <Users size={12} className="text-slate-400" />
                <div className="flex flex-col">
                  <span className="text-[9px] text-slate-400 font-semibold uppercase leading-none mb-0.5">
                    Students
                  </span>
                  <span className="text-[11px] font-medium text-slate-700">
                    {batch.students} Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* Right Section: Status Badge (Desktop) */}
      <div className="flex items-center md:flex-col md:items-end md:justify-center gap-2 mt-2 md:mt-0 md:h-auto">
        <span
          className={`text-[10px] px-2 py-1 rounded-full font-semibold border ${
            batch.active
              ? "bg-emerald-50 text-emerald-600 border-emerald-100"
              : "bg-slate-50 text-slate-500 border-slate-100"
          }`}
        >
          {batch.active ? "Active" : "Archived"}
        </span>
      </div>
    </div>
  );
}
