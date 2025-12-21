import axiosInstance from "@/Utils/Axiosinstance";
import { ApiPaths } from "@/constants/ApiPaths";

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
      ApiPaths.TRAINER.ADD,
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
    const response = await axiosInstance.get(ApiPaths.TRAINER.GET_ALL, {
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
      `${ApiPaths.TRAINER.GET_BY_ID}/${id}`,
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
      `${ApiPaths.TRAINER.UPDATE}/${id}`,
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
      `${ApiPaths.TRAINER.DELETE}/${id}`,
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
      `${ApiPaths.TRAINER.GET_BY_BRANCH}/${branch}`,
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
