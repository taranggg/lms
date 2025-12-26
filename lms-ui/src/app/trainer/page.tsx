"use client";
import React from "react";
import TrainerDashboardComponent, {
  type HourSpent,
} from "@/components/trainer/TrainerDashboard";
import { type TodoMainTask } from "@/components/dashboard/TodoList";
import { useAuth } from "@/Context/AuthContext";
import { getTrainerById } from "@/Apis/Trainer";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

// Mock data for missing props
const mockHoursSpent: HourSpent[] = [
  { month: "Jan", teaching: 40, preparation: 20 },
  { month: "Feb", teaching: 35, preparation: 25 },
  { month: "Mar", teaching: 45, preparation: 15 },
  { month: "Apr", teaching: 50, preparation: 10 },
  { month: "May", teaching: 42, preparation: 18 },
];

const mockTodoList: TodoMainTask[] = [
  {
    label: "Review Assignments",
    category: "Grading",
    dateTime: "27 Nov 2025, 10:00 AM",
    checked: false,
    subtasks: [
        { label: "Batch A - React Hooks", checked: false },
        { label: "Batch B - CSS Grid", checked: false }
    ]
  },
  {
    label: "Prepare for Next Session",
    category: "Preparation",
    dateTime: "28 Nov 2025, 09:00 AM",
    checked: false,
    subtasks: []
  },
];

export default function TrainerDashboard() {
  const { user, token, isLoading } = useAuth();
  const router = useRouter();
  const [trainerData, setTrainerData] = React.useState<any>(null);
  const [dataLoading, setDataLoading] = React.useState(true);

  // Protected Route Logic
  React.useEffect(() => {
    if (!isLoading && !user) {
        router.push("/trainer/login");
    }
  }, [isLoading, user, router]);
  
  // API Fetch Logic
  React.useEffect(() => {
    const fetchTrainer = async () => {
        // Fallback to localStorage if ID is not in token (backend limitation)
        const storedTrainerId = localStorage.getItem("trainerId");
        const idToUse = user?.id || storedTrainerId;

        if (idToUse && token) {
            try {
                const data = await getTrainerById(idToUse, token);
                setTrainerData(data);
            } catch (error) {
                console.error("Failed to fetch trainer data", error);
            } finally {
                setDataLoading(false);
            }
        } 
    };

    if (!isLoading) {
        if (user && token) {
             fetchTrainer();
        } else {
             // If no user (and redirect happened/happening), just stop loading data
             setDataLoading(false);
        }
    }
  }, [user, token, isLoading]);

  // Loading State
  if (isLoading || (user && dataLoading)) {
      return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
  }

  // Prevent flash content if redirecting
  if (!user) {
      return null; 
  }

  // No Data State (Should ideally be handled by empty response, but fallback here)
  if (!trainerData) {
    return (
        <div className="flex flex-col h-screen w-full items-center justify-center bg-background gap-4">
            <h2 className="text-xl font-semibold">Trainer Not Found</h2>
            <p className="text-muted-foreground">We couldn&apos;t find your profile data.</p>
        </div>
    );
  }

  // Map courses to batches structure
  const courses = trainerData.courses || [];
  
  const batches = courses.map((c: any) => ({
    id: c.id || c._id,
    name: c.name || "Untitled Course",
    code: c.code || "C-XXX",
    schedule: c.schedule || "TBD",
    students: c.studentsCount || 0,
    active: true,
    color: "#e0f2fe", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg", 
    instructor: trainerData.name,
    branch: trainerData.branch?.name || "Online", 
  }));

  return (
    <TrainerDashboardComponent
      trainer={{ name: trainerData.name, designation: trainerData.designation || "Trainer" }}
      batches={batches}
      todoList={mockTodoList}
      trainerId={user?.id || (typeof window !== 'undefined' ? localStorage.getItem("trainerId") || "" : "")}
      token={token || ""}
    />
  );
}
