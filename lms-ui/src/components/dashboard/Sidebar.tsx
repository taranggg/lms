"use client";
import React from "react";
import {
  Home,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
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

export default function Sidebar({ items }: SidebarProps) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <aside
      className={`bg-white rounded-2xl shadow flex flex-col py-8 px-4 min-h-screen transition-all duration-300 relative ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex items-center gap-2 mb-10 justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-tr from-cyan-400 to-orange-300 rounded-lg" />
          {!collapsed && (
            <span className="font-bold text-lg text-gray-800">Learninja</span>
          )}
          <span className="ml-1 text-xs text-orange-500">•</span>
        </div>
        {collapsed ? (
          <button
            className="absolute -right-6 top-8 p-1 rounded-full bg-white shadow border hover:bg-gray-100 z-10"
            onClick={() => setCollapsed(false)}
            aria-label="Expand sidebar"
          >
            <ChevronRight size={20} />
          </button>
        ) : (
          <button
            className="ml-auto p-1 rounded hover:bg-gray-100"
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
            className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer text-gray-700 font-medium ${
              item.active ? "bg-gray-900 text-white" : "hover:bg-gray-100"
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
            className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer text-gray-700 font-medium hover:bg-gray-100 relative w-full text-left border-none bg-transparent`}
            aria-label="Settings"
          >
            <Settings />
            {!collapsed && <span>Settings</span>}
          </button>
        ) : (
          <Popover>
            <PopoverTrigger asChild>
              <button
                className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer text-gray-700 font-medium hover:bg-gray-100 relative w-full text-left border-none bg-transparent`}
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
            <PopoverContent align="start" className="w-40 p-2">
              <button
                className="flex items-center gap-2 w-full px-2 py-2 rounded hover:bg-red-100 text-red-600 font-semibold"
                onClick={() => {
                  localStorage.clear();
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
