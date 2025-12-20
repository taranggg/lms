import axiosInstance from "@/Utils/Axiosinstance";

export interface TrainerData {
  name: string;
  email: string;
  branch: string;
  domain: string;
  mobileNumber: string;
  designation: string;
}

export const addTrainer = async (data: TrainerData, token: string) => {
  try {
    const response = await axiosInstance.post(
      "/api/v1/trainer/addTrainer",
      data,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllTrainers = async (token: string) => {
  try {
    const response = await axiosInstance.get("/api/v1/trainer/getAllTrainers", {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTrainerById = async (id: string, token: string) => {
  try {
    const response = await axiosInstance.get(
      `/api/v1/trainer/getTrainerById/${id}`,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateTrainer = async (
  id: string,
  data: Partial<TrainerData>,
  token: string
) => {
  try {
    const response = await axiosInstance.put(
      `/api/v1/trainer/updateTrainer/${id}`,
      data,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteTrainer = async (id: string, token: string) => {
  try {
    const response = await axiosInstance.delete(
      `/api/v1/trainer/deleteTrainer/${id}`,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTrainersByBranch = async (branch: string, token: string) => {
  try {
    const response = await axiosInstance.get(
      `/api/v1/trainer/getTrainersByBranch/${branch}`,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
