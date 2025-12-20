"use client";

import * as React from "react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

export interface MobileNavItem {
  label: string;
  icon: ReactNode;
  active: boolean;
  onClick: () => void;
}

interface MobileBottomNavProps {
  items: MobileNavItem[];
}

/**
 * Reusable mobile bottom navigation bar.
 * Hidden on md+ by default.
 */
export default function MobileBottomNav({ items }: MobileBottomNavProps) {
  if (!items || items.length === 0) return null;

  return (
    <nav className="lg:hidden fixed bottom-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
      {/* Container: Color Tinted Glass - Scrollable */}
      <div className="pointer-events-auto max-w-[90%] flex items-center gap-2 bg-sky-100/30 dark:bg-sky-950/30 backdrop-blur-2xl border border-white/40 dark:border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] rounded-full p-2 pr-2.5 transition-all duration-300 overflow-x-auto scrollbar-hide">
        {items.map((item) => (
          <Button
            key={item.label}
            type="button"
            variant="ghost"
            size="icon"
            className={`relative flex-shrink-0 flex items-center justify-center h-12 rounded-full transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) overflow-hidden ${
              item.active 
                ? "w-auto px-5 bg-sky-500/15 text-sky-700 dark:text-sky-300 shadow-[inset_0_0_20px_rgba(56,189,248,0.2)] border border-sky-500/20" 
                : "w-12 text-slate-500 dark:text-slate-400 hover:bg-sky-500/10 hover:text-sky-600"
            }`}
            onClick={item.onClick}
          >
           
            {/* Icon */}
            <span
              className={`relative z-10 transition-transform duration-300 ${
                item.active ? "scale-110 drop-shadow-sm" : "scale-100"
              }`}
            >
              {item.icon}
            </span>

            {/* Label - slides in when active */}
            <span
              className={`relative z-10 text-sm font-bold ml-2 whitespace-nowrap overflow-hidden transition-all duration-500 ease-in-out ${
                item.active
                  ? "max-w-[100px] opacity-100 translate-x-0"
                  : "max-w-0 opacity-0 -translate-x-4"
              }`}
            >
              {item.label}
            </span>
            
          </Button>
        ))}
      </div>
    </nav>
  );
}
