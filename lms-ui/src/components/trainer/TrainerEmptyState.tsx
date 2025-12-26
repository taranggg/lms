"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Users, Info } from "lucide-react";
import { updateTrainer } from "@/Apis/Trainer";
import { toast } from "sonner";
import { ProfileUpload } from "@/components/ui/profile-picture-upload";

interface EmptyStateModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAction?: () => void;
  trainerId?: string;
  token?: string;
}

export const EmptyStateModal: React.FC<EmptyStateModalProps> = ({
  isOpen,
  onOpenChange,
  onAction,
  trainerId,
  token,
}) => {
  const [step, setStep] = React.useState(1);
  const [file, setFile] = React.useState<File | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);

  // Reset step when modal opens
  React.useEffect(() => {
    if (isOpen) {
        setStep(1);
        setFile(null);
    }
  }, [isOpen]);

  const handleFileUpload = (file: File | null) => {
      setFile(file);
  };

  const handleNext = async () => {
      if (file && trainerId && token) {
          setIsUploading(true);
          try {
              const formData = new FormData();
              formData.append("profilePicture", file);
              
              // We cast formData to any because the existing API type expects strict object
              await updateTrainer(trainerId, formData as any, token);
              toast.success("Profile picture updated successfully!");
              setStep(2);
          } catch (error) {
              console.error("Upload failed", error);
              toast.error("Failed to upload profile picture. Moving to next step.");
              setStep(2);
          } finally {
              setIsUploading(false);
          }
      } else {
          // If no file, just move to next step (equivalent to Skip)
          setStep(2);
      }
  };

  const handleSkip = () => {
      setStep(2);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-none shadow-2xl bg-background/95 backdrop-blur-xl">
        {step === 1 ? (
            <>
                <DialogHeader className="flex flex-col items-center text-center space-y-2 pt-6">
                     <DialogTitle className="text-2xl font-semibold tracking-tight">Complete Your Profile</DialogTitle>
                     <DialogDescription className="text-base text-muted-foreground">
                        Upload a professional photo to help students recognize you.
                     </DialogDescription>
                </DialogHeader>

                <div className="py-6 flex justify-center w-full">
                    <ProfileUpload onChange={handleFileUpload} />
                </div>

                <DialogFooter className="flex flex-row items-center justify-between w-full sm:justify-between gap-4 px-2 pb-2">
                    <Button variant="ghost" onClick={handleSkip} disabled={isUploading} className="text-muted-foreground hover:text-foreground">
                        Skip for now
                    </Button>
                    <Button onClick={handleNext} disabled={isUploading || !file} className="min-w-[100px]">
                        {isUploading ? "Uploading..." : "Continue"}
                    </Button>
                </DialogFooter>
            </>
        ) : (
            <>
                <div className="flex flex-col items-center text-center space-y-6 pt-8 pb-6 px-4">
                  <div className="relative">
                    <div className="absolute -inset-4 bg-primary/20 rounded-full blur-xl animate-pulse" />
                    <div className="relative w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border-4 border-background shadow-sm">
                        <Users className="w-10 h-10 text-primary" />
                    </div>
                  </div>
                  
                  <div className="space-y-2 max-w-xs mx-auto">
                      <DialogTitle className="text-2xl font-bold tracking-tight">
                        No Batches Assigned
                      </DialogTitle>
                      <DialogDescription className="text-base leading-relaxed">
                        You currently don't have any active batches. Once an administrator assigns you a batch, it will appear on your dashboard immediately.
                      </DialogDescription>
                  </div>
                </div>

                <DialogFooter className="flex flex-col sm:flex-row justify-center w-full gap-3 pb-4">
                    <Button 
                        variant="outline" 
                        className="w-full sm:w-auto min-w-[140px]"
                        onClick={() => window.location.reload()} 
                    >
                        Refresh Status
                    </Button>
                    <Button 
                        variant="default" 
                        className="w-full sm:w-auto min-w-[140px]"
                        onClick={() => {}} // Placeholder logic for creating batch
                    >
                        Create Batch
                    </Button>
                </DialogFooter>
            </>
        )}
      </DialogContent>
    </Dialog>
  );
};
