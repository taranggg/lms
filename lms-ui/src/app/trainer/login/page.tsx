"use client";

import React from "react";
import {
  GoogleOAuthProvider,
  useGoogleLogin,
  TokenResponse,
} from "@react-oauth/google";
import { TrainerGoogleLogin } from "@/Services/Auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/Context/AuthContext";
import { BookOpen, Sparkles } from "lucide-react";
import { SlideToLogin } from "@/components/ui/slide-to-login";
import { ConnectGoogleModal } from "@/components/trainer/ConnectGoogleModal";

const TrainerLoginContent = () => {
  const router = useRouter();
  const { dispatch } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);
  const [showGoogleModal, setShowGoogleModal] = React.useState(false);
  const [currentTrainerId, setCurrentTrainerId] = React.useState("");

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse: TokenResponse) => {
      setIsLoading(true);
      try {
        const res = await TrainerGoogleLogin(tokenResponse.access_token);
        dispatch({ type: "SIGN_IN", payload: res.token });
        toast.success("Login Successful");

        if (res.firstLogin && res.trainerId) {
          setCurrentTrainerId(res.trainerId);
          setShowGoogleModal(true);
          // Do not redirect yet
        } else {
          router.push("/trainer/dashboard");
        }
      } catch (err: any) {
        console.error(err);
        toast.error(err.response?.statusText || "Login failed");
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      toast.error("Google Login Failed");
      setIsLoading(false);
    },
  });

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100 via-gray-50 to-gray-100 dark:from-slate-900 dark:via-slate-950 dark:to-black relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[40rem] h-[40rem] rounded-full bg-indigo-400/20 blur-[100px] animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40rem] h-[40rem] rounded-full bg-purple-400/20 blur-[100px] animate-pulse delay-1000" />

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="bg-white/50 dark:bg-black/50 backdrop-blur-xl border border-white/50 dark:border-white/10 p-10 md:p-12 flex flex-col items-center text-center space-y-8 shadow-2xl rounded-3xl">
          {/* Logo & Branding */}
          <div className="space-y-4 flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-2 transform hover:scale-105 transition-transform duration-300">
              <BookOpen className="text-white w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                Trainer Portal
              </h1>
              <p className="text-sm text-muted-foreground max-w-[250px] mx-auto leading-relaxed">
                Secure access for managing your batches and students.
              </p>
            </div>
          </div>

          {/* Divider with Sparkle */}
          <div className="relative w-full flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200 dark:border-gray-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white/50 dark:bg-black/50 backdrop-blur-sm px-2 text-muted-foreground flex items-center gap-1">
                <Sparkles size={12} /> Sign in
              </span>
            </div>
          </div>

          {/* Login Button Area */}
          <div className="w-full flex justify-center pb-2">
            <SlideToLogin onSuccess={() => login()} isLoading={isLoading} />
          </div>

          {/* Footer */}
          <p className="text-xs text-muted-foreground opacity-60">
            &copy; {new Date().getFullYear()} Learninja LMS. All rights
            reserved.
          </p>
        </div>
      </div>

      <ConnectGoogleModal
        isOpen={showGoogleModal}
        trainerId={currentTrainerId}
        onSuccess={() => router.push("/trainer/dashboard")}
      />
    </div>
  );
};

const TrainerLogin: React.FC = () => {
  return (
    <GoogleOAuthProvider
      clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}
    >
      <TrainerLoginContent />
    </GoogleOAuthProvider>
  );
};

export default TrainerLogin;
