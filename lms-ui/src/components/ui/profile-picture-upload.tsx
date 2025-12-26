"use client";

import { cn } from "@/lib/utils";
import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { IconUpload, IconUser, IconX, IconCameraPlus } from "@tabler/icons-react";
import { useDropzone } from "react-dropzone";

// Define smooth spring transition
const springTransition = {
  type: "spring" as const,
  stiffness: 300,
  damping: 25,
};

// Animation variants for the main container elements
const containerVariants = {
  initial: { scale: 1, borderColor: "var(--neutral-200)" },
  hover: { scale: 1.02, borderColor: "var(--sky-400)" },
  drag: { scale: 1.05, borderColor: "var(--sky-500)", backgroundColor: "var(--sky-50)" },
};

// Animation for items entering/exiting (placeholder vs image)
const contentVariants = {
  enter: { opacity: 0, scale: 0.8 },
  center: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
};

export const ProfileUpload = ({
  onChange,
  initialImageSrc,
  className,
}: {
  onChange?: (file: File | null) => void;
  initialImageSrc?: string;
  className?: string;
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(initialImageSrc || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cleanup object URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (preview && preview !== initialImageSrc) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview, initialImageSrc]);

  const handleFileChange = (newFiles: File[]) => {
    const selected = newFiles[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      onChange && onChange(selected);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the dropzone click
    setFile(null);
    setPreview(null);
    onChange && onChange(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    multiple: false,
    noClick: true,
    accept: { "image/*": [] },
    onDrop: handleFileChange,
  });

  const { ref: dropzoneRef, ...inputProps } = getInputProps();

  const { onDrag, ...rootProps } = getRootProps();

  return (
    <div className={cn("w-full flex flex-col items-center justify-center p-6 bg-transparent", className)}>
      {/* Main Container */}
      <motion.div
        {...rootProps}
        onClick={() => open()}
        className="relative group/avatar cursor-pointer shrink-0"
        whileHover="hover"
        initial="initial"
        animate="animate"
      >
        <input
          {...inputProps}
          ref={(e) => {
            fileInputRef.current = e;
            if (dropzoneRef) {
              if (typeof dropzoneRef === "function") {
                dropzoneRef(e);
              } else {
                (dropzoneRef as React.MutableRefObject<HTMLInputElement | null>).current = e;
              }
            }
          }}
        />

        {/* Outer Rotating Gradient Ring (visible on hover or drag) */}
        <motion.div
             className="absolute -inset-1 rounded-full bg-gradient-to-tr from-primary/0 via-primary/40 to-primary/0 blur-md opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-500 pointer-events-none"
             animate={{ rotate: 360 }}
             transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
        />
        
        {/* The visible circle container */}
        <div
          className={cn(
            "relative w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden z-10 shrink-0", // Responsive sizes
            "border-4 border-white dark:border-neutral-900", // Inner white framing
            "shadow-xl ring-1 ring-black/5 dark:ring-white/10", // Depth
            "bg-neutral-50 dark:bg-neutral-800", // Base
            "transition-all duration-300 ease-out"
          )}
        >
          {/* Dashed Border for Empty State */}
          {!preview && (
              <div className={cn(
                  "absolute inset-0 border-2 border-dashed rounded-full transition-colors duration-300 m-1",
                  isDragActive ? "border-primary bg-primary/5" : "border-neutral-300 dark:border-neutral-600 group-hover/avatar:border-primary group-hover/avatar:bg-primary/5"
              )} />
          )}

          <AnimatePresence mode="wait">
            {preview ? (
              /* ----------------- IMAGE PREVIEW STATE ----------------- */
              <motion.div
                key="image-preview"
                variants={contentVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="relative w-full h-full"
              >
                <img
                  src={preview}
                  alt="Avatar preview"
                  className="w-full h-full object-cover"
                />

                {/* Hover Overlay for Edit/Remove actions */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex flex-col items-center justify-center gap-2 text-white"
                >
                  <IconCameraPlus className="w-8 h-8 opacity-90" />
                  <span className="text-xs font-bold tracking-wide uppercase">Edit</span>
                  
                  <motion.button
                    initial={{ scale: 0.8 }}
                    whileHover={{ scale: 1.1, backgroundColor: "rgba(239, 68, 68, 1)" }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleRemove}
                    className="absolute top-2 right-2 p-1.5 bg-white/20 rounded-full text-white transition-colors"
                  >
                    <IconX className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              </motion.div>
            ) : (
              /* ----------------- EMPTY PLACEHOLDER STATE ----------------- */
              <motion.div
                key="placeholder"
                variants={contentVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0 flex flex-col items-center justify-center text-neutral-400 dark:text-neutral-500"
              >
                {isDragActive ? (
                  <motion.div
                    animate={{ scale: [0.9, 1.1, 0.9], rotate: [0, 5, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <IconUpload className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <motion.div
                        className="p-3 bg-white dark:bg-neutral-900 rounded-full shadow-sm text-primary/80 group-hover/avatar:text-primary group-hover/avatar:scale-110 transition-all duration-300"
                    >
                        <IconUser className="w-6 h-6 sm:w-8 sm:h-8" />
                    </motion.div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Floating Badge (only when empty) */}
        {!preview && (
            <motion.div 
                className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground p-2 rounded-full shadow-lg border-[3px] border-white dark:border-neutral-950 z-20"
                whileHover={{ scale: 1.1, rotate: 90 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
                <IconCameraPlus className="w-3 h-3 sm:w-4 sm:h-4" />
            </motion.div>
        )}
      </motion.div>
       
       {/* Helper Text below */}
      <AnimatePresence>
        {!preview && (
            <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-5 flex flex-col items-center gap-1"
            >
                <span className="text-sm font-semibold text-foreground/80 group-hover/avatar:text-primary transition-colors">
                    {isDragActive ? "Drop to upload" : "Upload Photo"}
                </span>
                <span className="text-xs text-muted-foreground text-center">
                    Max 2MB
                </span>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};