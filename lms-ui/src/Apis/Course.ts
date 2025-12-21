import axiosInstance from "@/Utils/Axiosinstance";
import { ApiPaths } from "@/constants/ApiPaths";

// Interfaces
export interface CourseData {
  [key: string]: any;
}

export interface TopicData {
  [key: string]: any;
}

// --- Courses ---

export const createCourse = async (data: CourseData, token: string) => {
  try {
    const response = await axiosInstance.post(
      ApiPaths.COURSES_AND_TOPICS.CREATE_COURSE,
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

export const getAllCourses = async (
    token: string, 
    params?: { type?: string; page?: string; limit?: string }
) => {
  try {
    const response = await axiosInstance.get(
      ApiPaths.COURSES_AND_TOPICS.GET_ALL_COURSES,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
        params,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCourseById = async (id: string, token: string) => {
  try {
    const response = await axiosInstance.get(
      `${ApiPaths.COURSES_AND_TOPICS.GET_COURSE_BY_ID}/${id}`,
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

export const updateCourse = async (
  id: string,
  data: Partial<CourseData>,
  token: string
) => {
  try {
    const response = await axiosInstance.put(
      `${ApiPaths.COURSES_AND_TOPICS.UPDATE_COURSE}/${id}`,
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

export const deleteCourse = async (id: string, token: string) => {
  try {
    const response = await axiosInstance.delete(
      `${ApiPaths.COURSES_AND_TOPICS.DELETE_COURSE}/${id}`,
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

// --- Topics ---

export const createTopic = async (data: TopicData, token: string) => {
  try {
    const response = await axiosInstance.post(
      ApiPaths.COURSES_AND_TOPICS.CREATE_TOPIC,
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

export const getAllTopics = async (token: string) => {
  try {
    const response = await axiosInstance.get(
      ApiPaths.COURSES_AND_TOPICS.GET_ALL_TOPICS,
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

export const getTopicById = async (id: string, token: string) => {
  try {
    const response = await axiosInstance.get(
      `${ApiPaths.COURSES_AND_TOPICS.GET_TOPIC_BY_ID}/${id}`,
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

export const updateTopic = async (
  id: string,
  data: Partial<TopicData>,
  token: string
) => {
  try {
    const response = await axiosInstance.put(
      `${ApiPaths.COURSES_AND_TOPICS.UPDATE_TOPIC}/${id}`,
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

export const deleteTopic = async (id: string, token: string) => {
  try {
    const response = await axiosInstance.delete(
      `${ApiPaths.COURSES_AND_TOPICS.DELETE_TOPIC}/${id}`,
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

export const getCourseTopics = async (id: string, token: string) => {
    try {
        const response = await axiosInstance.get(
            `${ApiPaths.COURSES_AND_TOPICS.GET_COURSE_TOPICS}/${id}`,
            {
                headers: {
                    authorization: `Bearer ${token}`,
                }
            }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
}

// --- Assignments ---

export const assignTopicsToCourse = async (
  data: { courseId: string; topicIds: string[] },
  token: string
) => {
  try {
    const response = await axiosInstance.post(
      ApiPaths.COURSES_AND_TOPICS.ASSIGN_TOPICS_TO_COURSE,
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

export const assignCourseToStudent = async (
  data: { courseId: string; studentId: string },
  token: string
) => {
  try {
    const response = await axiosInstance.post(
      ApiPaths.COURSES_AND_TOPICS.ASSIGN_COURSE_TO_STUDENT,
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
