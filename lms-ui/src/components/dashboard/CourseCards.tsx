import React from "react";
import { Users, FileText, Calendar, GraduationCap } from "lucide-react";

export type CourseCard = {
  id: string;
  name: string;
  logo?: string;
  color: string;
  code: string;
  status: string;
  trainer: string;
  schedule: string;
  duration: string;
  totalSessions: number;
  description: string;
  students: string[];
  assignments: number;
  attendance: Array<{ date: string; topic: string; status: string }>;
  resources: Array<{
    name: string;
    type: string;
    link: string;
    uploaded: string;
    by: string;
  }>;
  sessions: Array<{
    date: string;
    time: string;
    topic: string;
    recording: string;
  }>;
  stats: {
    sessionsCompleted: number;
    materialsAvailable: number;
    attendancePercent: number;
  };
  nextSession: {
    date: string;
    time: string;
    topic: string;
  };
};

type CourseCardsProps = {
  courses: CourseCard[];
  studentId: string;
};

import { useRouter } from "next/navigation";

const CourseCards: React.FC<CourseCardsProps> = ({ courses, studentId }) => {
  const router = useRouter();

  // Helper to get logic tint
  const getBackgroundStyle = (color?: string) => {
    if (!color) return 'rgba(255,255,255,0.1)';
    // Simple check if hex
    if (color.startsWith('#')) return `${color}25`;
    // If it's a named color, we can't easily append opacity in hex style without conversion.
    // Fallback to a safe tint or just the color if we can't manipulate.
    // For now, assume hex or assume it works, otherwise fallback.
    return `${color}25`; 
  };

  return (
    // Added pt-4 to prevent hover cut-off at the top, and px-4 for side gaps
    <div className="flex gap-6 mb-8 overflow-x-auto pb-4 pt-4 px-2 scrollbar-hide -mx-2">
      {courses.map((course, idx) => (
        <div
          key={course.name}
          className="group rounded-3xl p-6 flex flex-col gap-4 shadow-sm min-w-[260px] max-w-[280px] border border-white/20 dark:border-white/10 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative cursor-pointer"
          style={{ 
            background: getBackgroundStyle(course.color), // Tinted background
            backdropFilter: 'blur(12px)',
          }}
          onClick={() => router.push(`/student/${studentId}/${course.id}`)}
        >
          {/* Logo/icon */}
          <div className="flex items-center justify-center mb-2">
            {course.logo ? (
              <img
                src={course.logo}
                alt="logo"
                className="w-12 h-12 object-contain drop-shadow-sm transition-transform group-hover:scale-110"
              />
            ) : (
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/40 shadow-sm text-slate-700">
                 <GraduationCap size={28} />
              </div>
            )}
          </div>
          
          {/* Header Info */}
          <div className="text-center mb-1">
             <div className="font-bold text-lg text-slate-900 dark:text-slate-100 leading-tight mb-1">
               {course.name}
             </div>
             <div className="text-xs font-medium text-slate-600 dark:text-slate-300">
               Trainer: {course.trainer}
             </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2 mt-auto">
            <div className="flex flex-col items-center justify-center bg-white/40 dark:bg-black/10 rounded-xl py-2">
               <FileText size={16} className="text-slate-700 dark:text-slate-200 mb-1" />
               <span className="text-[10px] font-bold text-slate-800 dark:text-slate-100">{course.totalSessions}</span>
            </div>
             <div className="flex flex-col items-center justify-center bg-white/40 dark:bg-black/10 rounded-xl py-2">
               <Calendar size={16} className="text-slate-700 dark:text-slate-200 mb-1" />
               <span className="text-[10px] font-bold text-slate-800 dark:text-slate-100">{course.assignments}</span>
            </div>
             <div className="flex flex-col items-center justify-center bg-white/40 dark:bg-black/10 rounded-xl py-2">
               <Users size={16} className="text-slate-700 dark:text-slate-200 mb-1" />
               <span className="text-[10px] font-bold text-slate-800 dark:text-slate-100">{course.students.length}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CourseCards;
