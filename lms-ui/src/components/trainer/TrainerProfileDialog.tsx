"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Mail, Briefcase, User, Camera, BookOpen, GraduationCap } from "lucide-react";
import { useAuth } from "@/Context/AuthContext";
import { useRouter } from "next/navigation";

interface TrainerProfileDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  trainer: {
    name: string;
    email: string;
    designation: string;
    image?: string;
    id: string;
  };
  onImageUpdate?: (newImageUrl: string) => void;
}

export function TrainerProfileDialog({
  isOpen,
  onOpenChange,
  trainer,
  onImageUpdate,
}: TrainerProfileDialogProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleLogout = () => {
    dispatch({ type: "SIGN_OUT", payload: null });
    router.push("/trainer/login");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (onImageUpdate) {
          onImageUpdate(URL.createObjectURL(file));
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] overflow-hidden p-0 border-0 shadow-2xl bg-card">
        <DialogTitle className="sr-only">Trainer Profile</DialogTitle>
        {/* Header Background */}
        <div className="h-32 bg-gradient-to-r from-primary/20 to-secondary/20 relative overflow-hidden">
             <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
             
             {/* Decorative Background Icons */}
             <BookOpen className="absolute -bottom-4 -left-4 w-24 h-24 text-primary/5 rotate-12" />
             <GraduationCap className="absolute top-4 right-8 w-16 h-16 text-secondary/5 -rotate-12" />
             <User className="absolute top-8 left-12 w-12 h-12 text-primary/5 rotate-45" />
             <Camera className="absolute -bottom-2 right-1/4 w-20 h-20 text-secondary/5 rotate-6" />
        </div>

        {/* Profile Content */}
        <div className="px-6 pb-6 relative">
             {/* Avatar with Edit Overlay */}
             <div className="relative -mt-16 mb-4 w-32 h-32 mx-auto group">
                <div className="relative w-full h-full rounded-full ring-4 ring-background shadow-xl overflow-hidden bg-background">
                    <Avatar className="w-full h-full">
                        <AvatarImage src={trainer.image} alt={trainer.name} className="object-cover" />
                        <AvatarFallback className="text-4xl bg-primary/10 text-primary font-bold">
                            {trainer.name ? trainer.name.charAt(0).toUpperCase() : "T"}
                        </AvatarFallback>
                    </Avatar>
                    
                    {/* Hover Overlay */}
                    <div 
                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center cursor-pointer backdrop-blur-[2px]"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Camera className="text-white w-8 h-8 drop-shadow-md" />
                        <span className="sr-only">Upload Image</span>
                    </div>
                </div>
                {/* Hidden File Input */}
                <input 
                    type="file" 
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                />
             </div>

             <div className="text-center mb-6">
                 <h2 className="text-2xl font-bold text-foreground tracking-tight">{trainer.name}</h2>
                 <p className="text-muted-foreground font-medium">{trainer.designation}</p>
             </div>

             <div className="space-y-4 mb-8">
                 <div className="flex items-center gap-3 text-sm p-3 rounded-lg bg-muted/50 border border-border/50">
                     <Mail className="w-4 h-4 text-primary" />
                     <span className="text-foreground/80 truncate">{trainer.email || "No email provided"}</span>
                 </div>
                 <div className="flex items-center gap-3 text-sm p-3 rounded-lg bg-muted/50 border border-border/50">
                     <Briefcase className="w-4 h-4 text-secondary" />
                     <span className="text-foreground/80">{trainer.designation || "Trainer"}</span>
                 </div>
                 <div className="flex items-center gap-3 text-sm p-3 rounded-lg bg-muted/50 border border-border/50">
                     <User className="w-4 h-4 text-green-600" />
                     <span className="text-foreground/80">ID: {trainer.id.substring(0, 12).toUpperCase()}...</span>
                 </div>
             </div>

             <Button 
                className="w-full gap-2 font-semibold bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/20 hover:shadow-red-500/40 transition-all active:scale-[0.98]"
                onClick={handleLogout}
             >
                 <LogOut size={16} />
                 Sign Out
             </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
