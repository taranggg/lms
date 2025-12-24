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
import { Calendar, Loader2 } from "lucide-react";
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
        toast.success("Google Calendar connected successfully!");
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
        className="sm:max-w-md"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="mx-auto bg-indigo-100 p-3 rounded-full w-fit mb-4">
            <Calendar className="w-8 h-8 text-indigo-600" />
          </div>
          <DialogTitle className="text-center text-xl">
            Connect Google Calendar
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            To automatically generate meeting links and access recordings for
            your batches, please connect your Google Account.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
            <strong>Note:</strong> You must approve access to your{" "}
            <strong>Calendar</strong> and <strong>Drive</strong> when prompted.
          </div>

          <Button
            onClick={() => googleLogin()}
            disabled={isConnecting}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {isConnecting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Connecting...
              </>
            ) : (
              "Connect Google Account"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
