import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    process.env.MODE == "dev"
      ? process.env.NEXT_PUBLIC_DEV_BASE_URL
      : process.env.NEXT_PUBLIC_PROD_BASE_URL,
});

export default axiosInstance;
