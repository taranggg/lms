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

export const createBatch = async (data: BatchData, token: string) => {
  try {
    const response = await axiosInstance.post(ApiPaths.BATCH.CREATE, data, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllBatches = async (
  token: string,
  filters?: {
    branch?: string;
    trainer?: string;
    type?: string;
    status?: string;
    search?: string;
  }
) => {
  try {
    const response = await axiosInstance.get(ApiPaths.BATCH.GET_ALL, {
      headers: {
        authorization: `Bearer ${token}`,
      },
      params: filters,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getBatchById = async (id: string, token: string) => {
  try {
    const response = await axiosInstance.get(`${ApiPaths.BATCH.GET_BY_ID}/${id}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateBatch = async (
  id: string,
  data: Partial<BatchData>,
  token: string
) => {
  try {
    const response = await axiosInstance.put(
      `${ApiPaths.BATCH.UPDATE}/${id}`,
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

export const deleteBatch = async (id: string, token: string) => {
  try {
    const response = await axiosInstance.delete(
      `${ApiPaths.BATCH.DELETE}/${id}`,
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

export const getBatchesByFilters = async (
  filters: { branchId?: string; trainerId?: string; type?: string },
  token: string
) => {
  try {
    const response = await axiosInstance.get(ApiPaths.BATCH.GET_BY_FILTERS, {
      headers: {
        authorization: `Bearer ${token}`,
      },
      params: filters,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const assignBatchToStudent = async (
  data: { batchId: string; studentId: string },
  token: string
) => {
  try {
    const response = await axiosInstance.post(
      ApiPaths.BATCH.ASSIGN_TO_STUDENT,
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
