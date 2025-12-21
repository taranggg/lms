import React from "react";
import { Search, Bell } from "lucide-react";
import { ModeToggle } from "@/components/ui/mode-toggle";

export default function Header({
  name,
  onSearch,
}: {
  name: string;
  onSearch: (query: string) => void;
}) {
  return (
    <header className="flex items-center justify-between py-8 px-10">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
        Hello {name} <span className="text-yellow-500">👋</span>
      </h1>
      <div className="flex items-center gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search from courses..."
            className="rounded-full border px-4 py-2 w-64 text-sm focus:outline-none bg-background text-foreground"
            onChange={(e) => onSearch(e.target.value)}
          />
          <Search
            className="absolute right-3 top-2.5 text-muted-foreground"
            size={18}
          />
        </div>
        <ModeToggle />
        <Bell className="text-muted-foreground" size={22} />
      </div>
    </header>
  );
}
