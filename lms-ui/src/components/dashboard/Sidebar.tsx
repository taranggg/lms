"use client";
import React from "react";
import {
  Home,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { ModeToggle } from "@/components/ui/mode-toggle";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tooltip } from "@/components/ui/tooltip";

export type SidebarItem = {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
};

interface SidebarProps {
  items: SidebarItem[];
}

import { useRouter } from "next/navigation";
import axiosInstance from "@/Utils/Axiosinstance";

export default function Sidebar({ items }: SidebarProps) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <aside
      className={`bg-white/50 dark:bg-black/50 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl shadow-sm flex flex-col py-8 px-4 min-h-screen transition-all duration-300 relative ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
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
            className="absolute -right-6 top-8 p-1 rounded-full bg-background shadow border border-border hover:bg-muted z-10"
            onClick={() => setCollapsed(false)}
            aria-label="Expand sidebar"
          >
            <ChevronRight size={20} className="text-foreground" />
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
            {item.icon}
            {!collapsed && <span>{item.label}</span>}
          </div>
        ))}
      </nav>
      {/* Settings with popover menu at bottom, always visible */}
      <div className="mt-auto mb-2">
        {!mounted ? (
          <button
            className={`flex items-center gap-3 px-4 py-2 rounded-xl cursor-pointer text-muted-foreground font-medium hover:bg-primary/10 hover:text-primary relative w-full text-left border-none bg-transparent transition-colors`}
            aria-label="Settings"
          >
            <Settings />
            {!collapsed && <span>Settings</span>}
          </button>
        ) : (
          <Popover>
            <PopoverTrigger asChild>
              <button
                className={`flex items-center gap-3 px-4 py-2 rounded-xl cursor-pointer text-muted-foreground font-medium hover:bg-primary/10 hover:text-primary relative w-full text-left border-none bg-transparent transition-colors`}
                aria-label="Settings"
              >
                <Settings />
                {!collapsed && <span>Settings</span>}
                {collapsed && (
                  <span className="absolute left-12 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    Settings
                  </span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-48 p-2">
              <div className="flex items-center justify-between px-2 py-2 mb-1 rounded hover:bg-gray-100">
                <span className="text-sm font-medium text-gray-700">Theme</span>
                <ModeToggle />
              </div>
              <div className="h-px bg-gray-200 my-1" />
              import axiosInstance from "@/Utils/Axiosinstance"; // ... imports
              // ... inside component
              <button
                className="flex items-center gap-2 w-full px-2 py-2 rounded hover:bg-red-100 text-red-600 font-semibold"
                onClick={async () => {
                  try {
                    await axiosInstance.post("/auth/logout");
                  } catch (e) {
                    console.error("Logout failed", e);
                  }
                  // Even if API fails, redirect to login
                  window.location.href = "/login";
                }}
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </aside>
  );
}
