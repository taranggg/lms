"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

type StudentNavbarProps = {
  studentId: string;
};

const navItems: { label: string; href: (id: string) => string }[] = [
  {
    label: "Dashboard",
    href: (id) => `/student/${id}`,
  },
  {
    label: "Courses",
    href: (id) => `/student/${id}/courses`,
  },
  {
    label: "Resources",
    href: (id) => `/student/${id}/resources`,
  },
];

export default function StudentNavbar({ studentId }: StudentNavbarProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  const handleNavClick = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <nav className="w-full bg-[var(--card)]/95 backdrop-blur border-b border-border shadow-sm px-3 sm:px-4 md:px-6 lg:px-8 py-2 flex items-center justify-between sticky top-0 z-30">
      {/* Branding */}
      <button
        type="button"
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => handleNavClick(`/student/${studentId}`)}
      >
        <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
          L
        </div>
        <span className="font-bold text-lg sm:text-xl text-[var(--card-foreground)]">
          LearnSpace
        </span>
      </button>

      {/* Desktop nav */}
      <div className="hidden md:flex gap-6 text-sm text-[var(--muted-foreground)] items-center">
        {navItems.map((item) => (
          <button
            key={item.label}
            type="button"
            className="hover:text-[var(--primary)] transition-colors"
            onClick={() => handleNavClick(item.href(studentId))}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Right side – avatar + mobile menu */}
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[var(--muted)] flex items-center justify-center">
            <span className="text-[var(--muted-foreground)] font-semibold">
              S
            </span>
          </div>
        </div>

        {/* Mobile menu button */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="md:hidden rounded-full"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 flex flex-col">
            <SheetHeader className="px-4 pt-4 pb-2 border-b">
              <SheetTitle className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                  L
                </div>
                <span className="text-base font-semibold">LearnSpace</span>
              </SheetTitle>
            </SheetHeader>
            <div className="flex-1 flex flex-col gap-1 px-2 py-3">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-[var(--muted-foreground)] hover:bg-muted hover:text-[var(--card-foreground)] transition-colors"
                  onClick={() => handleNavClick(item.href(studentId))}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="border-t px-4 py-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[var(--muted)] flex items-center justify-center">
                <span className="text-[var(--muted-foreground)] font-semibold">
                  S
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-[var(--card-foreground)]">
                  Student
                </span>
                <span className="text-xs text-[var(--muted-foreground)]">
                  learner@learnspace.io
                </span>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
