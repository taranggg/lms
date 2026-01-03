import axiosInstance from "@/Utils/Axiosinstance";
import { ApiPaths } from "@/constants/ApiPaths";

// Placeholder interface - expand as needed based on actual API payload
export interface BatchData {
  title: string;
  branch: string;
  trainer: string;
  startDate: string;
  endDate?: string;
  startTime: string;
  endTime: string;
  type: "Weekdays" | "Weekends";
  [key: string]: any; // Keep index signature for flexibility if needed
}

export const createBatch = async (data: BatchData) => {
  try {
    const response = await axiosInstance.post(ApiPaths.BATCH.CREATE, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllBatches = async (filters?: {
  branch?: string;
  trainer?: string;
  type?: string;
  status?: string;
  search?: string;
}) => {
  try {
    const response = await axiosInstance.get(ApiPaths.BATCH.GET_ALL, {
      params: filters,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getBatchById = async (id: string) => {
  try {
    const response = await axiosInstance.get(
      `${ApiPaths.BATCH.GET_BY_ID}/${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateBatch = async (id: string, data: Partial<BatchData>) => {
  try {
    const response = await axiosInstance.put(
      `${ApiPaths.BATCH.UPDATE}/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteBatch = async (id: string) => {
  try {
    const response = await axiosInstance.delete(
      `${ApiPaths.BATCH.DELETE}/${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getBatchesByFilters = async (filters: {
  branchId?: string;
  trainerId?: string;
  type?: string;
}) => {
  try {
    const response = await axiosInstance.get(ApiPaths.BATCH.GET_BY_FILTERS, {
      params: filters,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const assignBatchToStudent = async (data: {
  batchId: string;
  studentId: string;
}) => {
  try {
    const response = await axiosInstance.post(
      ApiPaths.BATCH.ASSIGN_TO_STUDENT,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
