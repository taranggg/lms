import axiosInstance from "@/Utils/Axiosinstance";

// Placeholder interface - expand as needed based on actual API payload
export interface BatchData {
  [key: string]: any;
}

export const createBatch = async (data: BatchData, token: string) => {
  try {
    const response = await axiosInstance.post("/api/v1/batch/createBatch", data, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllBatches = async (token: string) => {
  try {
    const response = await axiosInstance.get("/api/v1/batch/getAllBatches", {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getBatchById = async (id: string, token: string) => {
  try {
    const response = await axiosInstance.get(`/api/v1/batch/getBatchById/${id}`, {
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
      `/api/v1/batch/updateBatch/${id}`,
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
      `/api/v1/batch/deleteBatch/${id}`,
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
    const response = await axiosInstance.get("/api/v1/batch/getBatchesByFilters", {
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
      "/api/v1/batch/assignBatchToStudent",
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
