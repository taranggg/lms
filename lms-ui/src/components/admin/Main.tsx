import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { AdminGoogleLogin } from "@/Services/Auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/Context/AuthContext";
const Main: React.FC = () => {
  const router = useRouter();
  const { dispatch } = useAuth();
  const handleGoogleLoginSuccess = async (credentialResponse: any) => {
    try {
      if (credentialResponse.credential) {
        const res = await AdminGoogleLogin(credentialResponse.credential);
        dispatch({ type: "SIGN_IN", payload: res.token });
        toast("Login Successful");
        router.push("/admin/dashboard");
      }
    } catch (err: any) {
      console.log(err);
      toast(err.response.statusText);
    }
  };
  return (
    <GoogleOAuthProvider
      clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}
    >
      <div>
        <div className="w-full flex justify-center">
          <GoogleLogin onSuccess={handleGoogleLoginSuccess} />
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Main;
