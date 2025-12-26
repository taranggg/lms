import { z } from "zod";

export const createResourceSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().optional(),
  type: z.enum(["PDF", "Video", "Link"], { required_error: "Please select a resource type" }),
  url: z.string().url("Please enter a valid URL"),
});

export type CreateResourceFormValues = z.infer<typeof createResourceSchema>;
