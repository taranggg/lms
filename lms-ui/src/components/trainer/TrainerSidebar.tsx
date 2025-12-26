import React, { useState } from "react";
import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { TrainerProfileDialog } from "./TrainerProfileDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface TrainerSidebarItem {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

interface TrainerSidebarProps {
  items: TrainerSidebarItem[];
  trainerName: string;
  trainerImage: string;
  trainerDesignation?: string;
  trainerEmail?: string;
  trainerId?: string;
}

export default function TrainerSidebar({
  items,
  trainerName,
  trainerImage,
  trainerDesignation = "Senior Trainer",
  trainerEmail,
  trainerId,
}: TrainerSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);


  return (
    <aside
      className={`bg-white/50 dark:bg-black/50 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl shadow-sm flex flex-col py-8 px-4 h-[calc(100vh-2rem)] transition-all duration-300 relative ml-4 my-4 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Brand / Logo */}
      <div className="flex items-center gap-2 mb-10 justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
             <div className="w-4 h-4 bg-primary rounded-sm" />
          </div>
          {!collapsed && (
            <span className="font-bold text-lg text-foreground">Learninja</span>
          )}
        </div>
        {collapsed ? (
          <button
            className="absolute -right-6 top-8 p-1 rounded-full bg-background shadow border border-border hover:bg-muted z-10 text-foreground"
            onClick={() => setCollapsed(false)}
            aria-label="Expand sidebar"
          >
            <ChevronRight size={20} />
          </button>
        ) : (
          <button
            className="ml-auto p-1 rounded hover:bg-muted text-foreground"
            onClick={() => setCollapsed(true)}
            aria-label="Collapse sidebar"
          >
            <ChevronLeft size={20} />
          </button>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex flex-col gap-2 flex-1">
        {items.map((item) => (
          <div
            key={item.label}
            className={`flex items-center gap-3 px-4 py-2 rounded-xl cursor-pointer font-medium transition-all duration-200 ${
              item.active 
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" 
                : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
            }`}
            onClick={item.onClick}
          >
            <div className={`${collapsed ? "mx-auto" : ""}`}>{item.icon}</div>
            {!collapsed && <span>{item.label}</span>}
          </div>
        ))}
      </nav>

      {/* Profile Section */}
      <div className="mt-auto mb-2">
          {/* Profile Row Trigger */}
          <div
            className={`flex items-center gap-3 px-2 py-2 rounded-xl cursor-pointer hover:bg-primary/5 transition-colors border border-transparent hover:border-primary/10 group ${
              collapsed ? "justify-center" : ""
            }`}
            onClick={() => setShowProfileDialog(true)}
          >
            {/* Avatar Wrapper with Hover Indicator */}
            <div className="relative">
                <Avatar className="h-9 w-9 border-2 border-background shadow-sm transition-transform duration-300 group-hover:scale-105">
                    <AvatarImage src={trainerImage} alt={trainerName} />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {trainerName ? trainerName.charAt(0).toUpperCase() : "T"}
                    </AvatarFallback>
                </Avatar>
                {/* Subtle edit dot/indicator could go here */}
            </div>
            
            {!collapsed && (
              <div className="flex flex-col min-w-0 text-left">
                <span className="text-sm font-semibold text-sidebar-foreground truncate group-hover:text-primary transition-colors">
                  {trainerName}
                </span>
                <span className="text-[10px] text-muted-foreground truncate">
                  {trainerDesignation}
                </span>
              </div>
            )}
          </div>

          <TrainerProfileDialog 
            isOpen={showProfileDialog}
            onOpenChange={setShowProfileDialog}
            trainer={{
                name: trainerName,
                email: trainerEmail || "",
                designation: trainerDesignation || "",
                image: trainerImage,
                id: trainerId || ""
            }}
            onImageUpdate={(url) => {
                // Handle local update if needed, though usually layout refresh handles it
                console.log("Image updated", url);
            }}
          />
      </div>
    </aside>
  );
}
