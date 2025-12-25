"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import { Calendar, HardDrive, Loader2 } from "lucide-react";
import axiosInstance from "@/Utils/Axiosinstance";

interface ConnectGoogleModalProps {
  isOpen: boolean;
  trainerId: string;
  onSuccess: () => void;
}

export const ConnectGoogleModal: React.FC<ConnectGoogleModalProps> = ({
  isOpen,
  trainerId,
  onSuccess,
}) => {
  const [isConnecting, setIsConnecting] = useState(false);

  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    scope:
      "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/drive.readonly",
    onSuccess: async (codeResponse) => {
      setIsConnecting(true);
      try {
        await axiosInstance.post(`/auth/connect-google`, {
          code: codeResponse.code,
          trainerId: trainerId,
        });
        toast.success("Google Workspace connected successfully!");
        onSuccess();
      } catch (error) {
        console.error("Connection failed", error);
        toast.error("Failed to connect Google Account");
      } finally {
        setIsConnecting(false);
      }
    },
    onError: () => {
      toast.error("Google Login Failed");
      setIsConnecting(false);
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent
        className="sm:max-w-[425px] overflow-hidden border-0 shadow-2xl bg-background p-0 gap-0"
        onInteractOutside={(e) => e.preventDefault()}
      >
        {/* Subtle Background Icons */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
           <Calendar className="absolute -top-12 -right-12 w-64 h-64 text-primary/10 rotate-12" strokeWidth={0.5} />
           <HardDrive className="absolute -bottom-12 -left-12 w-56 h-56 text-primary/10 -rotate-12" strokeWidth={0.5} />
        </div>

        <div className="relative z-10 p-8 flex flex-col items-center justify-center text-center space-y-8">
            <div className="space-y-3">
                <DialogTitle className="text-2xl font-bold tracking-tight text-foreground">
                    Sync with Google
                </DialogTitle>
                <DialogDescription className="text-base text-muted-foreground max-w-xs mx-auto leading-relaxed">
                    Seamlessly integrate your Calendar and Drive to automate scheduling and resource sharing.
                </DialogDescription>
            </div>

            <div className="w-full space-y-4">
                <Button
                    onClick={() => googleLogin()}
                    disabled={isConnecting}
                    className="w-full h-12 text-base font-medium rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-200 hover:shadow-primary/40 hover:scale-[1.02] border-0"
                >
                    {isConnecting ? (
                    <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Connecting...
                    </>
                    ) : (
                    <div className="flex items-center justify-center gap-2">
                         <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                           <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#FFFFFF" />
                           <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#FFFFFF" />
                           <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FFFFFF" />
                           <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#FFFFFF" />
                         </svg>
                        Connect Google Account
                    </div>
                    )}
                </Button>
                
                 <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                    Secure Access • Read Only Drive
                 </p>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
