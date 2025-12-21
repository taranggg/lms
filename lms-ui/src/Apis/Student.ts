import axiosInstance from "@/Utils/Axiosinstance";
import { ApiPaths } from "@/constants/ApiPaths";

export interface StudentData {
  name: string;
  email: string;
}

export const createStudent = async (data: StudentData, token: string) => {
  try {
    const response = await axiosInstance.post(
      ApiPaths.STUDENT.CREATE,
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

export const getAllStudents = async (
  token: string,
  filters?: {
    branch?: string;
    batch?: string;
    course?: string;
    search?: string;
  }
) => {
  try {
    const response = await axiosInstance.get(ApiPaths.STUDENT.GET_ALL, {
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

export const getStudentById = async (id: string, token: string) => {
  try {
    const response = await axiosInstance.get(
      `${ApiPaths.STUDENT.GET_BY_ID}/${id}`,
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

export const getStudentByBranch = async (branch: string, token: string) => {
  try {
    const response = await axiosInstance.get(
      `${ApiPaths.STUDENT.GET_BY_BRANCH}/${branch}`,
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

export const updateStudent = async (
  id: string,
  data: Partial<StudentData>,
  token: string
) => {
  try {
    const response = await axiosInstance.put(
      `${ApiPaths.STUDENT.UPDATE}/${id}`,
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

export const deleteStudent = async (id: string, token: string) => {
  try {
    const response = await axiosInstance.delete(
      `${ApiPaths.STUDENT.DELETE}/${id}`,
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
