"use client";

import React from "react";
import {
  Pencil,
  Home,
  BookOpen,
  CalendarCheck2,
  Bell,
  Search,
} from "lucide-react";
import Image from "next/image";

import Sidebar, { SidebarItem } from "@/components/dashboard/Sidebar";
import StudentCoursesPage from "./StudentCoursesPage";
import StudentResourcesPage from "./StudentResourcesPage";
import Header from "@/components/dashboard/Header";
import CourseCards, {
  type CourseCard,
} from "@/components/dashboard/CourseCards";
import HoursSpentChart from "@/components/dashboard/HoursSpentChart";
import PerformanceGauge from "@/components/dashboard/PerformanceGauge";
import Leaderboard, {
  type LeaderboardEntry,
} from "@/components/dashboard/Leaderboard";
import TodoList, { type TodoMainTask as TodoItem } from "@/components/dashboard/TodoList";
import WeeklyCalendar from "@/components/ui/WeeklyCalendar";
import StudentProfileForm, { type StudentProfile } from "./StudentProfileForm";
import MobileBottomNav, {
  type MobileNavItem,
} from "@/components/dashboard/MobileBottomNav";

export interface HourSpent {
  month: string;
  study: number;
  exams: number;
}

export interface StudentDashboardProps {
  student: { name: string };
  courses: CourseCard[];
  hoursSpent: HourSpent[];
  leaderboard: LeaderboardEntry[];
  todoList: TodoItem[];
}

/* ------------------ DESKTOP/TABLET CENTER SECTION ------------------ */

interface CenterSectionProps {
  student: StudentDashboardProps["student"];
  courses: CourseCard[];
  hoursSpent: HourSpent[];
  leaderboard: LeaderboardEntry[];
  studentId: string;
}

function CenterSection({
  student,
  courses,
  hoursSpent,
  leaderboard,
  studentId,
}: CenterSectionProps) {
  const [search, setSearch] = React.useState("");

  const filteredCourses = courses.filter((c) => {
    const query = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(query) ||
      c.trainer.toLowerCase().includes(query) ||
      c.code.toLowerCase().includes(query)
    );
  });

  /* Update container class for internal scrolling structure */
  const containerClass =
    "grid grid-cols-1 xl:grid-cols-3 gap-8 md:gap-10 px-6 md:px-8 xl:px-12 pb-20 pt-8";

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative">
       {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute top-[20%] right-[-5%] w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px]" />
      </div>

      <Header name={student.name} onSearch={setSearch} />
      <div className="flex-1 overflow-y-auto">
        <div className={containerClass}>
          <div className="xl:col-span-3 flex flex-col gap-10">
            {/* Courses strip */}
            <div className="-mx-6 md:mx-0">
              <div className="overflow-x-auto scrollbar-hide px-6 md:px-0 pb-4">
                <CourseCards courses={filteredCourses} studentId={studentId} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
              <HoursSpentChart data={hoursSpent} />
              <PerformanceGauge points={8966} rank="5th in Leaderboard" />
            </div>

            {/* <Leaderboard entries={leaderboard} /> */}
          </div>

           {/* ------------------ TABLET SECTION (Right content moved to bottom) ------------------ */}
          <div className="flex flex-col gap-10 lg:hidden xl:col-span-3"></div>


        </div>
      </div>
    </div>
  );
}

/* ------------------ RIGHT SECTION (PROFILE + TODO) ------------------ */

interface RightSectionProps {
  student: StudentDashboardProps["student"];
  todoList: StudentDashboardProps["todoList"];
  calendarDate: Date;
  setCalendarDate: React.Dispatch<React.SetStateAction<Date>>;
}

function RightSection({
  student,
  todoList,
  calendarDate,
  setCalendarDate,
}: RightSectionProps) {
  const [profileModalOpen, setProfileModalOpen] = React.useState(false);
  const [profile, setProfile] = React.useState<StudentProfile>({
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    name: student.name,
    age: "",
    profession: "College Student",
    gender: "Other",
    email: "",
  });

  return (
    <div className="w-[300px] md:w-[320px] lg:w-[360px] xl:w-[400px] min-w-[280px] bg-transparent flex flex-col gap-8 overflow-y-auto h-screen pr-3 lg:pr-4">
      <div className=" p-5 md:p-6 mt-2">
        <div className="flex items-center justify-between mb-4">
          <div className="font-semibold text-base md:text-lg">Profile</div>
          <button
            type="button"
            className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
            onClick={() => setProfileModalOpen(true)}
            aria-label="Edit profile"
          >
            <Pencil size={18} />
          </button>
        </div>

        <div className="flex flex-col items-center mb-4">
          <div className="relative mb-2">
            <Image
              src={
                profile.image ||
                "https://randomuser.me/api/portraits/women/44.jpg"
              }
              alt={profile.name}
              width={72}
              height={72}
              className="rounded-full relative z-10 object-cover ring-2 ring-sky-200"
            />
          </div>
          <div className="font-semibold text-sm md:text-base mt-1">
            {profile.name}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[11px] md:text-xs text-muted-foreground">
              {profile.profession}
            </span>
            <span className="bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full text-[10px] font-semibold">
              Active
            </span>
          </div>
        </div>

        <div className="p-3 md:p-4 mb-4 bg-muted/40 rounded-xl">
          <WeeklyCalendar
            selected={calendarDate}
            onSelect={setCalendarDate}
            className="rounded-xl bg-background"
          />
        </div>

        <hr className="my-5 border-border" />

        <TodoList items={todoList} />

        <StudentProfileForm
          open={profileModalOpen}
          onClose={() => setProfileModalOpen(false)}
          initialProfile={profile}
          onSave={setProfile}
        />
      </div>
    </div>
  );
}

/* ------------------ MOBILE HEADER (Hello + search) ------------------ */

interface MobileHeaderProps {
  studentName: string;
  onSearch: (value: string) => void;
}

function MobileHeader({ studentName, onSearch }: MobileHeaderProps) {
  const [value, setValue] = React.useState("");

  const initials = studentName?.[0]?.toUpperCase() ?? "S";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <header className="pt-3 pb-1">
      <div className="flex items-center justify-between px-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 font-semibold text-sm">
            {initials}
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[11px] text-muted-foreground">
              Hello <span aria-hidden>👋</span>
            </span>
            <span className="text-sm font-semibold text-[var(--card-foreground)]">
              {studentName}
            </span>
          </div>
        </div>
        <button
          type="button"
          className="relative p-2 rounded-full bg-[var(--card)] shadow-sm border border-slate-200/70"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4 text-muted-foreground" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-red-500" />
        </button>
      </div>

      <div className="px-3 pt-3">
        <div className="relative">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={value}
            onChange={handleChange}
            placeholder="Search from courses..."
            className="w-full rounded-full border border-slate-200 bg-[var(--card)] px-9 py-2 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sky-500"
          />
        </div>
      </div>
    </header>
  );
}

/* ------------------ MOBILE OVERVIEW LAYOUT ------------------ */

interface MobileOverviewProps {
  student: StudentDashboardProps["student"];
  courses: CourseCard[];
  hoursSpent: HourSpent[];
  todoList: TodoItem[];
  studentId: string;
}

function MobileOverview({
  student,
  courses,
  hoursSpent,
  todoList,
  studentId,
}: MobileOverviewProps) {
  const [search, setSearch] = React.useState("");

  const filteredCourses = courses.filter((c) => {
    const query = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(query) ||
      c.trainer.toLowerCase().includes(query) ||
      c.code.toLowerCase().includes(query)
    );
  });

  return (
    <div className="flex-1 flex flex-col m-4 bg-background">
      <MobileHeader studentName={student.name} onSearch={setSearch} />

      <div className="flex-1 px-3 pt-2 pb-20 space-y-6">
        {/* Courses section */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground mb-2">
            Courses
          </h2>
          <div className="-mx-2">
            <div className="overflow-x-auto scrollbar-hide px-2 pb-1">
              <CourseCards courses={filteredCourses} studentId={studentId} />
            </div>
          </div>
        </section>

        {/* Performance gauge */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground mb-2">
            Performance
          </h2>
          <PerformanceGauge points={8966} rank="5th in Leaderboard" />
        </section>

        {/* Hours spent chart */}
        <section>
          <HoursSpentChart data={hoursSpent} />
        </section>

        {/* To-do list */}
        <section className="pb-4">
          <h2 className="text-sm font-semibold text-muted-foreground mb-2">
            To Do List
          </h2>
          <TodoList items={todoList} />
        </section>
      </div>
    </div>
  );
}

/* ------------------ MAIN DASHBOARD COMPONENT ------------------ */

export default function StudentDashboardComponent({
  student,
  courses,
  hoursSpent,
  leaderboard,
  todoList,
  studentId,
}: StudentDashboardProps & { studentId: string }) {
  const [calendarDate, setCalendarDate] = React.useState<Date>(new Date());
  const [activePage, setActivePage] = React.useState<
    "Overview" | "Courses" | "Resources"
  >("Overview");

  const sidebarItems: SidebarItem[] = [
    {
      label: "Overview",
      icon: <Home size={20} />,
      active: activePage === "Overview",
      onClick: () => setActivePage("Overview"),
    },
    {
      label: "Courses",
      icon: <BookOpen size={20} />,
      active: activePage === "Courses",
      onClick: () => setActivePage("Courses"),
    },
    {
      label: "Resources",
      icon: <BookOpen size={20} />,
      active: activePage === "Resources",
      onClick: () => setActivePage("Resources"),
    },
  ];

  const mobileNavItems: MobileNavItem[] = [
    {
      label: "Overview",
      icon: <Home className="w-5 h-5" />,
      active: activePage === "Overview",
      onClick: () => setActivePage("Overview"),
    },
    {
      label: "Courses",
      icon: <BookOpen className="w-5 h-5" />,
      active: activePage === "Courses",
      onClick: () => setActivePage("Courses"),
    },
    {
      label: "Resources",
      icon: <CalendarCheck2 className="w-5 h-5" />,
      active: activePage === "Resources",
      onClick: () => setActivePage("Resources"),
    },
  ];

  return (
    <div className="flex bg-background h-screen overflow-hidden">
      {/* Desktop + Tablet */}
      <div className="hidden lg:flex w-full">
        <Sidebar items={sidebarItems} />

        <div className="flex flex-1 min-w-0">
          {activePage === "Overview" && (
            <>
              <CenterSection
                student={student}
                courses={courses}
                hoursSpent={hoursSpent}
                leaderboard={leaderboard}
                studentId={studentId}
              />
              <div className="hidden lg:flex">
                <div className="w-px bg-border mx-2 h-screen" />
                <RightSection
                  student={student}
                  todoList={todoList}
                  calendarDate={calendarDate}
                  setCalendarDate={setCalendarDate}
                />
              </div>
            </>
          )}

          {activePage === "Courses" && (
            <div className="flex-1 px-4 md:px-6 xl:px-10 py-6 overflow-y-auto">
              <StudentCoursesPage courses={courses} studentId={studentId} />
            </div>
          )}

          {activePage === "Resources" && (
            <div className="flex-1 px-4 md:px-6 xl:px-10 py-6 overflow-y-auto">
              <StudentResourcesPage
                resources={courses.flatMap((c) => c.resources ?? [])}
              />
            </div>
          )}
        </div>
      </div>

      {/* Mobile + Bottom Nav */}
      <div className="flex flex-col w-full lg:hidden h-full overflow-y-auto pb-32">
        {activePage === "Overview" && (
          <MobileOverview
            student={student}
            courses={courses}
            hoursSpent={hoursSpent}
            todoList={todoList}
            studentId={studentId}
          />
        )}

        {activePage === "Courses" && (
          <div className="flex-1 px-3 pt-4 pb-32">
            <StudentCoursesPage courses={courses} studentId={studentId} />
          </div>
        )}

        {activePage === "Resources" && (
          <div className="flex-1 px-3 pt-4 pb-32">
            <StudentResourcesPage
              resources={courses.flatMap((c) => c.resources ?? [])}
            />
          </div>
        )}

        <MobileBottomNav items={mobileNavItems} />
      </div>
    </div>
  );
}
