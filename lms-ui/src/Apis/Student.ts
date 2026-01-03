import axiosInstance from "@/Utils/Axiosinstance";
import { ApiPaths } from "@/constants/ApiPaths";

export interface StudentData {
  name: string;
  email: string;
}

export const createStudent = async (data: StudentData) => {
  try {
    const response = await axiosInstance.post(ApiPaths.STUDENT.CREATE, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllStudents = async (filters?: {
  branch?: string;
  batch?: string;
  course?: string;
  search?: string;
  trainer?: string;
}) => {
  try {
    const response = await axiosInstance.get(ApiPaths.STUDENT.GET_ALL, {
      params: filters,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getStudentById = async (id: string) => {
  try {
    const response = await axiosInstance.get(
      `${ApiPaths.STUDENT.GET_BY_ID}/${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getStudentByBranch = async (branch: string) => {
  try {
    const response = await axiosInstance.get(
      `${ApiPaths.STUDENT.GET_BY_BRANCH}/${branch}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateStudent = async (id: string, data: Partial<StudentData>) => {
  try {
    const response = await axiosInstance.put(
      `${ApiPaths.STUDENT.UPDATE}/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteStudent = async (id: string) => {
  try {
    const response = await axiosInstance.delete(
      `${ApiPaths.STUDENT.DELETE}/${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
