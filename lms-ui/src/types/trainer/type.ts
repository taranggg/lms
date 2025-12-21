// Types for Trainer Module

export type AttendanceStatus = "Present" | "Absent" | "Not Marked";

export interface Student {
  id: string;
  name: string;
  email: string;
  attendance: number;
}

export interface AttendanceRecord {
  date: string;
  topic: string;
  studentsPresent: number;
  totalStudents: number;
}

export interface Resource {
  name: string;
  type: string;
  link: string;
  uploaded: string;
  by: string;
  description?: string;
}

export interface Session {
  date: string;
  time: string;
  topic: string;
  recording: string;
  studentsPresent?: number;
}

export interface BatchStats {
  sessionsCompleted: number;
  materialsAvailable: number;
  averageAttendance: number;
}

export interface NextSession {
  date: string;
  time: string;
  topic: string;
}

export interface Batch {
  id: string;
  name: string;
  code: string;
  status: string;
  schedule: string;
  duration: string;
  totalSessions: number;
  description: string;
  students: Student[];
  attendance: AttendanceRecord[];
  resources: Resource[];
  sessions: Session[];
  nextSession: NextSession | null;
  stats?: BatchStats;
  logo?: string;
  color?: string;
  assignments?: unknown[];
}

export interface Trainer {
  trainerId: string;
  name: string;
  email: string;
  batches: Batch[];
  notifications: string[];
  recentActivity: string[];
}
