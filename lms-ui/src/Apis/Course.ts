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

export const createCourse = async (data: CourseData) => {
  try {
    const response = await axiosInstance.post(
      ApiPaths.COURSES_AND_TOPICS.CREATE_COURSE,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllCourses = async (params?: {
  type?: string;
  page?: string;
  limit?: string;
}) => {
  try {
    const response = await axiosInstance.get(
      ApiPaths.COURSES_AND_TOPICS.GET_ALL_COURSES,
      {
        params,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCourseById = async (id: string) => {
  try {
    const response = await axiosInstance.get(
      `${ApiPaths.COURSES_AND_TOPICS.GET_COURSE_BY_ID}/${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateCourse = async (id: string, data: Partial<CourseData>) => {
  try {
    const response = await axiosInstance.put(
      `${ApiPaths.COURSES_AND_TOPICS.UPDATE_COURSE}/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteCourse = async (id: string) => {
  try {
    const response = await axiosInstance.delete(
      `${ApiPaths.COURSES_AND_TOPICS.DELETE_COURSE}/${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// --- Topics ---

export const createTopic = async (data: TopicData) => {
  try {
    const response = await axiosInstance.post(
      ApiPaths.COURSES_AND_TOPICS.CREATE_TOPIC,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllTopics = async () => {
  try {
    const response = await axiosInstance.get(
      ApiPaths.COURSES_AND_TOPICS.GET_ALL_TOPICS
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTopicById = async (id: string) => {
  try {
    const response = await axiosInstance.get(
      `${ApiPaths.COURSES_AND_TOPICS.GET_TOPIC_BY_ID}/${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateTopic = async (id: string, data: Partial<TopicData>) => {
  try {
    const response = await axiosInstance.put(
      `${ApiPaths.COURSES_AND_TOPICS.UPDATE_TOPIC}/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteTopic = async (id: string) => {
  try {
    const response = await axiosInstance.delete(
      `${ApiPaths.COURSES_AND_TOPICS.DELETE_TOPIC}/${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCourseTopics = async (id: string) => {
  try {
    const response = await axiosInstance.get(
      `${ApiPaths.COURSES_AND_TOPICS.GET_COURSE_TOPICS}/${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// --- Assignments ---

export const assignTopicsToCourse = async (data: {
  courseId: string;
  topicIds: string[];
}) => {
  try {
    const response = await axiosInstance.post(
      ApiPaths.COURSES_AND_TOPICS.ASSIGN_TOPICS_TO_COURSE,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const assignCourseToStudent = async (data: {
  courseId: string;
  studentId: string;
}) => {
  try {
    const response = await axiosInstance.post(
      ApiPaths.COURSES_AND_TOPICS.ASSIGN_COURSE_TO_STUDENT,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
