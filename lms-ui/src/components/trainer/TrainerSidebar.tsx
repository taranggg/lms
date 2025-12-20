import React, { useState } from "react";
import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";
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
      className={`bg-cardcs rounded-2xl shadow flex flex-col py-8 px-4 h-[calc(100vh-2rem)] transition-all duration-300 relative ml-4 my-4 border border-sidebar-border ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Brand / Logo */}
      <div className="flex items-center gap-2 mb-10 justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-tr from-cyan-400 to-orange-300 rounded-lg shrink-0" />
          {!collapsed && (
            <span className="font-bold text-lg text-sidebar-foreground">Learninja</span>
          )}
          <span className="ml-1 text-xs text-orange-500">•</span>
        </div>
        {collapsed ? (
          <button
            className="absolute -right-6 top-8 p-1 rounded-full bg-sidebar shadow border border-sidebar-border hover:bg-sidebar-accent z-10 text-sidebar-foreground"
            onClick={() => setCollapsed(false)}
            aria-label="Expand sidebar"
          >
            <ChevronRight size={20} />
          </button>
        ) : (
          <button
            className="ml-auto p-1 rounded hover:bg-sidebar-accent text-sidebar-foreground"
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
            className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer font-medium transition-colors ${
              item.active ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent"
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
              className={`flex items-center gap-3 px-2 py-2 rounded-lg cursor-pointer hover:bg-sidebar-accent transition-colors border border-transparent hover:border-sidebar-border ${
                collapsed ? "justify-center" : ""
              }`}
            >
              <Avatar className="h-9 w-9 border-2 border-background shadow-sm">
                <AvatarImage src={trainerImage} alt={trainerName} />
                <AvatarFallback className="bg-sky-100 text-sky-700 font-semibold">
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
                </div>
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
