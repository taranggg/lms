import axiosInstance from "@/Utils/Axiosinstance";
import { ApiPaths } from "@/constants/ApiPaths";

export interface MaterialData {
  [key: string]: any;
}

export const createMaterial = async (data: MaterialData, token: string) => {
  try {
    const response = await axiosInstance.post(
      ApiPaths.MATERIAL.CREATE,
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

export const getAllMaterials = async (
    token: string,
    params?: { type?: string; page?: string; limit?: string }
) => {
  try {
    const response = await axiosInstance.get(ApiPaths.MATERIAL.GET_ALL, {
      headers: {
        authorization: `Bearer ${token}`,
      },
      params
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMaterialById = async (id: string, token: string) => {
  try {
    const response = await axiosInstance.get(
      `${ApiPaths.MATERIAL.GET_BY_ID}/${id}`,
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

export const updateMaterial = async (
  id: string,
  data: Partial<MaterialData>,
  token: string
) => {
  try {
    const response = await axiosInstance.put(
      `${ApiPaths.MATERIAL.UPDATE}/${id}`,
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

export const deleteMaterial = async (id: string, token: string) => {
  try {
    const response = await axiosInstance.delete(
      `${ApiPaths.MATERIAL.DELETE}/${id}`,
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
