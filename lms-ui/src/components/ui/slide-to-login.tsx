"use client";

import React, { useState, useRef, useEffect } from "react";
import { ArrowRight, ChevronRight } from "lucide-react";

export interface SlideToLoginProps {
  onSuccess: () => void;
  isLoading?: boolean;
  text?: string;
  icon?: React.ReactNode;
}

export function SlideToLogin({ onSuccess, isLoading = false, text = "Slide to sign in", icon }: SlideToLoginProps) {
  const [complete, setComplete] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const [dragWidth, setDragWidth] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Constants
  const minDrag = 0;
  // We'll calculate maxDrag dynamically

  useEffect(() => {
    if (!isLoading) {
      setComplete(false);
      setDragWidth(0);
      setIsDragging(false);
    }
  }, [isLoading]);

  const handleDragStart = (e: React.PointerEvent) => {
    if (complete || isLoading) return;
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleDrag = (e: React.PointerEvent) => {
    if (!isDragging || !trackRef.current || !thumbRef.current) return;
    
    const trackRect = trackRef.current.getBoundingClientRect();
    const thumbWidth = thumbRef.current.offsetWidth;
    const maxDrag = trackRect.width - thumbWidth - 8; // 8px total padding

    let newX = e.clientX - trackRect.left - (thumbWidth / 2);
    
    // Clamp
    newX = Math.max(minDrag, Math.min(newX, maxDrag));
    
    setDragWidth(newX);

    // Check completion threshold (e.g., 95%)
    if (newX >= maxDrag * 0.95) {
      setComplete(true);
      setDragWidth(maxDrag);
      setIsDragging(false);
      onSuccess();
    }
  };

  const handleDragEnd = () => {
    if (complete) return;
    setIsDragging(false);
    // Snap back
    setDragWidth(0);
  };

  // Google Logo SVG Component
  const DefaultGoogleLogo = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );

  return (
    <div 
        className="w-full max-w-[320px] select-none touch-none"
        onPointerUp={handleDragEnd}
        onPointerLeave={handleDragEnd}
    >
      <div 
        ref={trackRef}
        className="relative h-14 bg-white/50 dark:bg-black/30 backdrop-blur-md rounded-full border border-white/20 shadow-inner flex items-center p-1 overflow-hidden group hover:border-white/40 transition-colors"
      >
        {/* Track Text */}
        <div 
            className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300"
            style={{ opacity: isDragging || complete ? 0 : 1 }}
        >
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400 group-hover:text-primary animate-pulse">
             {text}
          </span>
          <ArrowRight className="ml-2 w-4 h-4 text-gray-400 group-hover:text-primary" />
        </div>
        
        {/* Progress Fill */}
        <div 
            className="absolute left-0 top-0 bottom-0 bg-primary/10 transition-[width] ease-out duration-75"
            style={{ width: `${Math.max(0, dragWidth + 28)}px` }} // + 28 centers the fill roughly behind the thumb
        />

        {/* Draggable Thumb */}
        <div
            ref={thumbRef}
            className={`
                absolute left-1 h-12 w-16 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-100 dark:border-gray-700
                flex items-center justify-center cursor-grab active:cursor-grabbing z-10
                transition-transform
                ${!isDragging ? "duration-300 ease-out" : "duration-0"}
            `}
            style={{ transform: `translateX(${dragWidth}px)` }}
            onPointerDown={handleDragStart}
            onPointerMove={handleDrag}
        >
             {/* Logo or Loading Spinner */}
             {isLoading ? (
                 <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
             ) : (
                icon || <DefaultGoogleLogo />
             )}
        </div>
      </div>
    </div>
  );
}
