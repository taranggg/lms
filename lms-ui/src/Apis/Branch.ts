import axiosInstance from "@/Utils/Axiosinstance";
import { ApiPaths } from "@/constants/ApiPaths";

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
      ApiPaths.BRANCH.CREATE,
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

export const getAllBranches = async (
  token: string,
  filters?: { search?: string }
) => {
  try {
    const response = await axiosInstance.get(ApiPaths.BRANCH.GET_ALL, {
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

export const updateBranch = async (
  id: string,
  data: Partial<BranchData>,
  token: string
) => {
  try {
    const response = await axiosInstance.put(
      `${ApiPaths.BRANCH.UPDATE}/${id}`,
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
      `${ApiPaths.BRANCH.DELETE}/${id}`,
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
