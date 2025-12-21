import { z } from "zod";

export const addTrainerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  branch: z.string().min(1, "Branch is required"),
  domain: z.string().min(1, "Domain is required"),
  mobileNumber: z
    .string()
    .min(10, "Mobile number must be at least 10 digits")
    .regex(/^\d+$/, "Must be only digits"),
  designation: z.string().min(1, "Designation is required"),
  gender: z.string().min(1, "Gender is required"),
});

export type AddTrainerFormValues = z.infer<typeof addTrainerSchema>;

export const addStudentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});

export type AddStudentFormValues = z.infer<typeof addStudentSchema>;

export const createBatchSchema = z.object({
  title: z.string().min(2, "Batch title is required"),
  branch: z.string().min(1, "Branch is required"),
  trainer: z.string().min(1, "Trainer is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  type: z.enum(["Weekdays", "Weekends"]),
});

export type CreateBatchFormValues = z.infer<typeof createBatchSchema>;
