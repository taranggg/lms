"use client";

import React from "react";
import Link from "next/link";
import { GraduationCap, Users, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100 via-gray-50 to-gray-100 dark:from-slate-900 dark:via-slate-950 dark:to-black relative overflow-hidden font-sans selection:bg-indigo-500/30">
      
      {/* Animated Background Blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50rem] h-[50rem] rounded-full bg-indigo-400/20 blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50rem] h-[50rem] rounded-full bg-purple-400/20 blur-[120px] animate-pulse delay-1000" />
      
      <main className="relative z-10 w-full max-w-7xl px-4 py-20 flex flex-col items-center">
        
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center mb-16 space-y-4">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/50 dark:bg-black/50 backdrop-blur-sm border border-black/5 dark:border-white/10 text-xs font-medium text-muted-foreground animate-fade-in mb-4">
                <Sparkles size={12} className="text-indigo-500" />
                <span>Next-Gen Learning Experience</span>
             </div>
             
             <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-br from-gray-900 via-indigo-800 to-gray-600 dark:from-white dark:via-indigo-200 dark:to-gray-400 bg-clip-text text-transparent drop-shadow-sm pb-2">
                Learninja LMS
             </h1>
             
             <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                A powerful, intuitive platform for managing education. <br className="hidden md:block"/> Connects admins, trainers, and students seamlessly.
             </p>
        </div>

        {/* Portals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">


            {/* Trainer Portal */}
            <Link href="/trainer/login" className="group">
                <div className="h-full bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-white/50 dark:border-white/10 p-8 rounded-3xl shadow-xl hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 transform hover:-translate-y-1 group-hover:bg-white/60 dark:group-hover:bg-black/60 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-6 group-hover:scale-110 transition-transform duration-300">
                        <Users className="text-white w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Trainer</h2>
                    <p className="text-sm text-muted-foreground mb-8">
                        Tools for batch management, grading, and student interaction.
                    </p>
                    <div className="mt-auto flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 group-hover:gap-3 transition-all">
                        Access Portal <ArrowRight size={16} />
                    </div>
                </div>
            </Link>

            {/* Student Portal */}
            <Link href="/student/login" className="group">
                <div className="h-full bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-white/50 dark:border-white/10 p-8 rounded-3xl shadow-xl hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 transform hover:-translate-y-1 group-hover:bg-white/60 dark:group-hover:bg-black/60 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-500 to-sky-500 flex items-center justify-center shadow-lg shadow-blue-500/20 mb-6 group-hover:scale-110 transition-transform duration-300">
                        <GraduationCap className="text-white w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Student</h2>
                    <p className="text-sm text-muted-foreground mb-8">
                        Your personal dashboard for courses, progress, and results.
                    </p>
                    <div className="mt-auto flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 group-hover:gap-3 transition-all">
                        Access Portal <ArrowRight size={16} />
                    </div>
                </div>
            </Link>

        </div>

        {/* Footer */}
        <div className="mt-24 text-center">
           <p className="text-sm text-muted-foreground/60">
             &copy; {new Date().getFullYear()} Learninja LMS. Powered by Next.js & Shadcn UI.
           </p>
        </div>

      </main>
    </div>
  );
}
