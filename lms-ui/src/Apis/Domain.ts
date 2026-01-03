import axiosInstance from "@/Utils/Axiosinstance";
import { ApiPaths } from "@/constants/ApiPaths";

export interface DomainData {
  name: string;
  description: string;
}

export const createDomain = async (data: DomainData) => {
  try {
    const response = await axiosInstance.post(ApiPaths.DOMAIN.CREATE, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllDomains = async () => {
  try {
    const response = await axiosInstance.get(ApiPaths.DOMAIN.GET_ALL);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getDomainById = async (id: string) => {
  try {
    const response = await axiosInstance.get(
      `${ApiPaths.DOMAIN.GET_BY_ID}/${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateDomain = async (id: string, data: Partial<DomainData>) => {
  try {
    const response = await axiosInstance.put(
      `${ApiPaths.DOMAIN.UPDATE}/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteDomain = async (id: string) => {
  try {
    const response = await axiosInstance.delete(
      `${ApiPaths.DOMAIN.DELETE}/${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
