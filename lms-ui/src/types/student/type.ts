// Types for Student Module

export type AttendanceStatus = "Present" | "Absent" | "Not Marked";

export interface AttendanceRecord {
  date: string;
  topic: string;
  status: AttendanceStatus;
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
}

export interface BatchStats {
  sessionsCompleted: number;
  materialsAvailable: number;
  attendancePercent: number;
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
  trainer: string;
  schedule: string;
  duration: string;
  totalSessions: number;
  description: string;
  classmates: string[];
  attendance: AttendanceRecord[];
  resources: Resource[];
  sessions: Session[];
  stats: BatchStats;
  nextSession: NextSession | null;
}
