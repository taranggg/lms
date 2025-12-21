import axiosInstance from "@/Utils/Axiosinstance";
import { ApiPaths } from "@/constants/ApiPaths";

export interface DomainData {
  name: string;
  description: string;
}

export const createDomain = async (data: DomainData, token: string) => {
  try {
    const response = await axiosInstance.post(
      ApiPaths.DOMAIN.CREATE,
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

export const getAllDomains = async (token: string) => {
  try {
    const response = await axiosInstance.get(ApiPaths.DOMAIN.GET_ALL, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getDomainById = async (id: string, token: string) => {
  try {
    const response = await axiosInstance.get(
      `${ApiPaths.DOMAIN.GET_BY_ID}/${id}`,
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

export const updateDomain = async (
  id: string,
  data: Partial<DomainData>,
  token: string
) => {
  try {
    const response = await axiosInstance.put(
      `${ApiPaths.DOMAIN.UPDATE}/${id}`,
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

export const deleteDomain = async (id: string, token: string) => {
  try {
    const response = await axiosInstance.delete(
      `${ApiPaths.DOMAIN.DELETE}/${id}`,
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
