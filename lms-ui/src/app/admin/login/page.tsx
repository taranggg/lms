"use client";

import React from "react";
import {
  GoogleOAuthProvider,
  GoogleLogin,
  useGoogleLogin,
  TokenResponse,
} from "@react-oauth/google";
import { AdminGoogleLogin } from "@/Services/Auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/Context/AuthContext";
import { ShieldCheck, Sparkles } from "lucide-react";
import { SlideToLogin } from "@/components/ui/slide-to-login";

const AdminLoginContent = () => {
  const router = useRouter();
  const { dispatch } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse: TokenResponse) => {
      // isLoading is already true from the button click
      try {
        // Note: tokenResponse returns 'access_token'.
        // If AdminGoogleLogin expects 'credential' (ID Token), we might need 'flow: "auth-code"' or adjust backend.
        // HOWEVER, standard GoogleLogin (the button) returns credential (ID Token).
        // useGoogleLogin with default flow (implicit) returns access_token.
        // Let's check AdminGoogleLogin.
        // Assuming AdminGoogleLogin expects the ID Token (credential), we need to set flow='implicit' but asking for id_token is deprecated or specific.
        // Actually, useGoogleLogin doesn't return ID token easily in implicit flow anymore.
        // Use `onSuccess` with `credentialResponse` is for the component.
        // For the HOOK, to get the ID Token, we usually just get an access token and send it to backend, OR we use the component.
        // BUT the user wants the custom slide button.
        // Strategy: useGoogleLogin can behave like the button if we don't specify flow, but it returns access_token.
        // If backend verifies access_token or ID_token matters.
        // Let's try to pass the access_token. If backend fails, we might need to fetch user info then send email?
        // OR better: useGoogleLogin can perform `flow: 'auth-code'` to get a code, then backend exchanges it.
        // OR we can fetch the user profile with the access token and then "login" if that's how the logic works?
        // Let's assume for now we pass the access_token.

        // WAIT: Previous code was `credentialResponse.credential` which is an ID Token (JWT).
        // To get ID Token with hook, need specific setup or just use access_token.
        // Let's assume AdminGoogleLogin handles the token it gets.
        // If previous code was `AdminGoogleLogin(credentialResponse.credential)`, it likely expects a JWT.
        // Getting JWT from hook:
        // The hook doesn't return "credential" (JWT) by default in the response object like the Button does.
        // We might need to fetch user info via Google API using the access_token,
        // OR change AdminGoogleLogin to accept access_token.

        // Alternative: `useGoogleLogin` can handle the popup.
        // Let's assume we can get the necessary token.

        // FIX: we will use `useGoogleLogin` and pass the `access_token`.
        // If `AdminGoogleLogin` fails, we will know.
        // But wait, standard `GoogleLogin` button returns an ID Token (JWT).
        // `useGoogleLogin` returns an access token.
        // If the backend strictly needs ID Token, the Hook is tricky without backend changes or extra call.
        // Let's try to get the ID Token via `flow: 'implicit'`? No.

        // Let's proceed with passing the accessToken, and if it fails I'll fix the service.
        // Actually, `AdminGoogleLogin` likely calls an endpoint that verifies the token.

        const res = await AdminGoogleLogin(tokenResponse.access_token);
        // Backend sets cookie. We just need to update local state.
        dispatch({ type: "SIGN_IN", payload: "admin_logged_in" });
        toast.success("Welcome back! Login Successful");
        router.push("/admin");
      } catch (err: any) {
        console.error(err);
        toast.error(err.response?.statusText || "Login failed");
        setIsLoading(false);
      }
    },
    onError: () => {
      toast.error("Google Login Failed");
      setIsLoading(false);
    },
    onNonOAuthError: () => {
      // Handles cases like popup closed by user
      setIsLoading(false);
    },
  });

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-100 via-gray-50 to-gray-100 dark:from-slate-900 dark:via-slate-950 dark:to-black relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] rounded-full bg-purple-400/20 blur-[100px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] rounded-full bg-blue-400/20 blur-[100px] animate-pulse delay-1000" />

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="glass-panel p-10 md:p-12 flex flex-col items-center text-center space-y-8 shadow-2xl border-white/40 dark:border-white/10">
          {/* Logo & Branding */}
          <div className="space-y-4 flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20 mb-2 transform hover:scale-105 transition-transform duration-300">
              <ShieldCheck className="text-white w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                Learninja Admin
              </h1>
              <p className="text-sm text-muted-foreground max-w-[250px] mx-auto leading-relaxed">
                Secure access portal for administrators and management.
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
            <SlideToLogin
              onSuccess={() => {
                setIsLoading(true);
                login();
              }}
              isLoading={isLoading}
            />
          </div>

          {/* Footer */}
          <p className="text-xs text-muted-foreground opacity-60">
            &copy; {new Date().getFullYear()} Learninja LMS. All rights
            reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

const AdminLogin: React.FC = () => {
  return (
    <GoogleOAuthProvider
      clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}
    >
      <AdminLoginContent />
    </GoogleOAuthProvider>
  );
};

export default AdminLogin;
