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
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 border-t border-border bg-[var(--card)]/95 backdrop-blur z-40">
      <div className="flex justify-around py-2">
        {items.map((item) => (
          <Button
            key={item.label}
            type="button"
            variant="ghost"
            size="icon"
            className="flex flex-col items-center justify-center h-auto px-0 py-1 bg-transparent"
            onClick={item.onClick}
          >
            <span
              className={`flex items-center justify-center rounded-full p-1.5 ${
                item.active
                  ? "bg-sky-100 text-sky-600"
                  : "text-muted-foreground"
              }`}
            >
              {item.icon}
            </span>
            <span
              className={`mt-0.5 text-[10px] ${
                item.active
                  ? "text-sky-600 font-medium"
                  : "text-muted-foreground"
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
