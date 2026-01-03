import axiosInstance from "@/Utils/Axiosinstance";
import { ApiPaths } from "@/constants/ApiPaths";

export interface MaterialData {
  [key: string]: any;
}

export const createMaterial = async (data: MaterialData) => {
  try {
    const response = await axiosInstance.post(ApiPaths.MATERIAL.CREATE, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllMaterials = async (params?: {
  type?: string;
  page?: string;
  limit?: string;
}) => {
  try {
    const response = await axiosInstance.get(ApiPaths.MATERIAL.GET_ALL, {
      params,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMaterialById = async (id: string) => {
  try {
    const response = await axiosInstance.get(
      `${ApiPaths.MATERIAL.GET_BY_ID}/${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateMaterial = async (
  id: string,
  data: Partial<MaterialData>
) => {
  try {
    const response = await axiosInstance.put(
      `${ApiPaths.MATERIAL.UPDATE}/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteMaterial = async (id: string) => {
  try {
    const response = await axiosInstance.delete(
      `${ApiPaths.MATERIAL.DELETE}/${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
