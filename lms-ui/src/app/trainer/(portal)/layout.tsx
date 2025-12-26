"use client";

import React from "react";
import TrainerSidebar, { TrainerSidebarItem } from "@/components/trainer/TrainerSidebar";
import { usePathname, useRouter } from "next/navigation";
import { Home, Users, BookOpen, Calendar, FileText } from "lucide-react";
import { useAuth } from "@/Context/AuthContext";
import { Loader2 } from "lucide-react";

export default function TrainerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, token } = useAuth();
  const [trainerData, setTrainerData] = React.useState<any>(null);
  
  // Auth Check & Data Fetch
  React.useEffect(() => {
    const init = async () => {
        if (!isLoading) {
            if (!user) {
                 const storedToken = localStorage.getItem("token");
                 if (!storedToken) {
                    router.push("/trainer/login");
                    return;
                 }
            }

            // Fetch full profile if we have a user/token
            const idToUse = user?.id || localStorage.getItem("trainerId");
            const tokenToUse = token || localStorage.getItem("token");

            if (idToUse && tokenToUse) {
                try {
                    // Assuming getTrainerById is imported, if not I will auto-import or it should be there from context
                    // We need to import it properly.
                     const { getTrainerById } = await import("@/Apis/Trainer");
                     const data = await getTrainerById(idToUse, tokenToUse);
                     setTrainerData(data);
                } catch (err) {
                    console.error("Failed to fetch trainer profile for sidebar", err);
                    // Fallback to user context if API fails
                    setTrainerData(user); 
                }
            }
        }
    };
    init();
  }, [isLoading, user, router, token]);

  const items: TrainerSidebarItem[] = [
    {
      label: "Overview",
      icon: <Home size={20} />,
      active: pathname === "/trainer",
      onClick: () => router.push("/trainer"),
    },
    {
      label: "My Batches",
      icon: <Users size={20} />,
      active: pathname.includes("/trainer/batches"),
      onClick: () => router.push("/trainer/batches"),
    },
    {
      label: "Resources",
      icon: <BookOpen size={20} />,
      active: pathname.includes("/trainer/resources"),
      onClick: () => router.push("/trainer/resources"),
    },
    {
      label: "Schedule",
      icon: <Calendar size={20} />,
      active: pathname.includes("/trainer/schedule"),
      onClick: () => router.push("/trainer/schedule"),
    },
    {
      label: "Assignments",
      icon: <FileText size={20} />,
      active: pathname.includes("/trainer/assignments"),
      onClick: () => router.push("/trainer/assignments"),
    },
  ];

  if (isLoading) {
       return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
  }

  // Allow rendering if we have some user data (either from context or fetched)
  // Logic: if !user && !trainerData, we might be redirecting.
  // But let's be safe.
  if (!user && !trainerData) return null;

  // Use fetched data first, then user context
  const displayName = trainerData?.name || user?.name || "Trainer";
  const displayImage = trainerData?.image || user?.image || "";
  const displayDesignation = trainerData?.designation || user?.designation || "Training Staff";
  const displayEmail = trainerData?.email || user?.email || "";
  const displayId = trainerData?._id || user?.id || "";

  return (
    <div className="flex bg-background h-screen overflow-hidden font-sans text-foreground">
       {/* Desktop Sidebar */}
       <div className="hidden md:flex shrink-0 z-20 h-screen sticky top-0">
         <TrainerSidebar 
            items={items} 
            trainerName={displayName} 
            trainerDesignation={displayDesignation}
            trainerImage={displayImage}
            trainerEmail={displayEmail}
            trainerId={displayId}
         />
       </div>

       {/* Mobile Nav could be injected here or handled in individual pages if heavily layout dependent. 
           For consistent layout, main content area: */}
       <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
          {children}
       </main>
    </div>
  );
}
