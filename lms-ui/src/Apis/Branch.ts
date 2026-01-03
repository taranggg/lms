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

export const addBranch = async (data: BranchData) => {
  try {
    const response = await axiosInstance.post(ApiPaths.BRANCH.CREATE, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllBranches = async (filters?: { search?: string }) => {
  try {
    const response = await axiosInstance.get(ApiPaths.BRANCH.GET_ALL, {
      params: filters,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateBranch = async (id: string, data: Partial<BranchData>) => {
  try {
    const response = await axiosInstance.put(
      `${ApiPaths.BRANCH.UPDATE}/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteBranch = async (id: string) => {
  try {
    const response = await axiosInstance.delete(
      `${ApiPaths.BRANCH.DELETE}/${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
