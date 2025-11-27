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
  return (
    <div className="flex gap-6 mb-8">
      {courses.map((course, idx) => (
        <div
          key={course.name}
          className="rounded-xl p-4 flex flex-col gap-3 shadow min-w-[200px] max-w-[220px] bg-white border border-gray-100 hover:shadow-lg transition relative cursor-pointer"
          style={{ background: course.color }}
          onClick={() => router.push(`/student/${studentId}/${course.id}`)}
        >
          {/* Logo/icon */}
          <div className="flex items-center justify-center mb-1">
            {course.logo ? (
              <img
                src={course.logo}
                alt="logo"
                className="w-8 h-8 rounded-full bg-white shadow"
              />
            ) : (
              <GraduationCap size={24} className="text-gray-400" />
            )}
          </div>
          {/* Course name */}
          <div className="font-semibold text-base mb-1 text-gray-900">
            {course.name}
          </div>
          {/* Trainer name */}
          <div className="text-xs text-gray-600 mb-1">
            Trainer:{" "}
            <span className="font-medium text-gray-800">{course.trainer}</span>
          </div>
          {/* Stats row */}
          <div className="flex items-center justify-between bg-white/60 rounded-lg px-2 py-1 mt-auto">
            <div className="flex items-center gap-1 text-gray-700">
              <FileText size={14} />
              <span className="ml-1 text-xs font-semibold">
                {course.totalSessions}
              </span>
            </div>
            <div className="flex items-center gap-1 text-gray-700">
              <Calendar size={14} />
              <span className="ml-1 text-xs font-semibold">
                {course.assignments}
              </span>
            </div>
            <div className="flex items-center gap-1 text-gray-700">
              <Users size={14} />
              <span className="ml-1 text-xs font-semibold">
                {course.students.length}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CourseCards;
