import React, { useState } from "react";
import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { ModeToggle } from "@/components/ui/mode-toggle";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

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
}

export default function TrainerSidebar({
  items,
  trainerName,
  trainerImage,
  trainerDesignation = "Senior Trainer",
}: TrainerSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);


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

      {/* Profile Section (Replaces Settings) */}
      <div className="mt-auto mb-2">
        <HoverCard openDelay={0} closeDelay={200}>
          <HoverCardTrigger asChild>
            <div
              className={`flex items-center gap-3 px-2 py-2 rounded-xl cursor-pointer hover:bg-primary/5 transition-colors border border-transparent hover:border-primary/10 ${
                collapsed ? "justify-center" : ""
              }`}
            >
              <Avatar className="h-9 w-9 border-2 border-background shadow-sm">
                <AvatarImage src={trainerImage} alt={trainerName} />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {trainerName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {!collapsed && (
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-sidebar-foreground truncate">
                    {trainerName}
                  </span>
                  <span className="text-[10px] text-muted-foreground truncate">
                    {trainerDesignation}
                  </span>
                </div>
              )}
            </div>
          </HoverCardTrigger>
          <HoverCardContent
            align="end"
            side="right"
            className="w-64 p-4 ml-4 shadow-xl border-border bg-popover"
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border border-border">
                  <AvatarImage src={trainerImage} alt={trainerName} />
                  <AvatarFallback className="text-lg bg-sky-100 text-sky-700">
                    {trainerName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold text-popover-foreground">{trainerName}</h4>
                  <p className="text-xs text-muted-foreground">{trainerDesignation}</p>
                  <p className="text-xs text-muted-foreground">{trainerDesignation}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between px-1">
                 <span className="text-sm font-medium text-popover-foreground">Theme</span>
                 <ModeToggle />
              </div>

              <Button
                variant="destructive"
                size="sm"
                className="w-full gap-2"
                onClick={() => {
                  window.location.href = "/login";
                }}
              >
                <LogOut size={14} />
                Sign Out
              </Button>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
    </aside>
  );
}
