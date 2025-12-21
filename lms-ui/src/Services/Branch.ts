import axiosInstance from "@/Utils/Axiosinstance";

export interface BranchData {
  name: string;
  address: string;
}

export interface BranchResponse extends BranchData {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export const addBranch = async (data: BranchData, token: string) => {
  try {
    const response = await axiosInstance.post(
      "/api/v1/branch/addBranch",
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

export const getAllBranches = async (token: string) => {
  try {
    const response = await axiosInstance.get("/api/v1/branch/getAllBranches", {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateBranch = async (
  id: string,
  data: Partial<BranchData>,
  token: string
) => {
  try {
    const response = await axiosInstance.put(
      `/api/v1/branch/updateBranch/${id}`,
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

export const deleteBranch = async (id: string, token: string) => {
  try {
    const response = await axiosInstance.delete(
      `/api/v1/branch/deleteBranch/${id}`,
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
