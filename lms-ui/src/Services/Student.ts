import axiosInstance from "@/Utils/Axiosinstance";

export interface StudentData {
  name: string;
  email: string;
}

export const createStudent = async (data: StudentData, token: string) => {
  try {
    const response = await axiosInstance.post(
      "/api/v1/student/createStudent",
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
    const response = await axiosInstance.get("/api/v1/student/getAllStudents", {
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
      `/api/v1/student/getStudentById/${id}`,
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
      `/api/v1/student/getStudentByBranch/${branch}`,
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
      `/api/v1/student/updateStudent/${id}`,
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
      `/api/v1/student/deleteStudent/${id}`,
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
