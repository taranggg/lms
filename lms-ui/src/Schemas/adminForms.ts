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
});

export type AddTrainerFormValues = z.infer<typeof addTrainerSchema>;

export const addStudentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});

export type AddStudentFormValues = z.infer<typeof addStudentSchema>;

export const createBatchSchema = z.object({
  name: z.string().min(2, "Batch name is required"),
  branch: z.string().min(1, "Branch is required"),
  trainer: z.string().optional(), // Trainer name or ID
  startDate: z.string().optional(), // Optional for now
  schedule: z.string().optional(), // Optional for now
});

export type CreateBatchFormValues = z.infer<typeof createBatchSchema>;
