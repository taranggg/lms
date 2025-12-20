import axiosInstance from "@/Utils/Axiosinstance";

export async function AdminGoogleLogin(token: string) {
  try {
    const res = await axiosInstance.post("/auth/admin/signin", {
      token,
    });
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function TrainerGoogleLogin(token: string) {
  try {
    const res = await axiosInstance.post("/auth/trainer/signin", {
      token,
    });
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function StudentLogin() {
  try {
  } catch (error) {}
}
