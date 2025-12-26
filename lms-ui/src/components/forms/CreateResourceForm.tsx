"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/Context/AuthContext";
// Define API function locally or import if exists (will define stub here if not found, but ideally should be in Apis/Material)
import axios from "axios";
import {
    createResourceSchema,
    CreateResourceFormValues
} from "@/Schemas/trainerForms";

// Stubbing the API call here if not imported, but best practice is to have it in Apis/Material
// I'll assume an API function exists or create a simple fetcher
const createMaterial = async (data: any, token: string) => {
    // Determine BE URL based on context or env, defaulting to standard
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const response = await axios.post(`${BASE_URL}/api/v1/material/createMaterial`, data, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
}

interface CreateResourceFormProps {
  onSuccess: () => void;
}

export default function CreateResourceForm({ onSuccess }: CreateResourceFormProps) {
  const { token } = useAuth();

  const form = useForm<CreateResourceFormValues>({
    resolver: zodResolver(createResourceSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "Link" as "Link" | "PDF" | "Video", // Default
      url: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  async function onSubmit(data: CreateResourceFormValues) {
    if (!token) {
      toast.error("Authentication token missing");
      return;
    }
    try {
      await createMaterial(data, token);
      toast.success("Resource created successfully!");
      form.reset();
      onSuccess();
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to create resource");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        
        <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Course Syllabus" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Brief description of the material..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Link">Link</SelectItem>
                    <SelectItem value="PDF">PDF</SelectItem>
                    <SelectItem value="Video">Video</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Resource URL</FormLabel>
                <FormControl>
                    <Input placeholder="https://..." {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />

        <div className="pt-4 flex justify-end">
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Resource
          </Button>
        </div>
      </form>
    </Form>
  );
}
