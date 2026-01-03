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

export const addTrainer = async (data: TrainerData) => {
  try {
    const response = await axiosInstance.post(ApiPaths.TRAINER.CREATE, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllTrainers = async (params?: {
  branch?: string;
  domain?: string;
  page?: string;
  limit?: string;
  search?: string;
}) => {
  try {
    const response = await axiosInstance.get(ApiPaths.TRAINER.GET_ALL, {
      params,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTrainerById = async (id: string) => {
  try {
    const response = await axiosInstance.get(
      `${ApiPaths.TRAINER.GET_BY_ID}/${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateTrainer = async (id: string, data: Partial<TrainerData>) => {
  try {
    const response = await axiosInstance.put(
      `${ApiPaths.TRAINER.UPDATE}/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteTrainer = async (id: string) => {
  try {
    const response = await axiosInstance.delete(
      `${ApiPaths.TRAINER.DELETE}/${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
