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
import {
  CreateBatchFormValues,
  createBatchSchema,
} from "@/Schemas/adminForms";
import { createBatch } from "@/Services/Batch";
import { useAuth } from "@/Context/AuthContext";

interface CreateBatchFormProps {
  onSuccess: () => void;
}

// ... (imports)

// ...

export default function CreateBatchForm({ onSuccess }: CreateBatchFormProps) {
  const { token } = useAuth();
  const form = useForm<CreateBatchFormValues>({
    resolver: zodResolver(createBatchSchema),
    defaultValues: {
      name: "",
      branch: "",
      trainer: "",
      startDate: "",
      schedule: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  async function onSubmit(data: CreateBatchFormValues) {
    if (!token) {
      toast.error("Authentication token missing");
      return;
    }
    try {
      await createBatch(data, token);
      toast.success("Batch created successfully!");
      form.reset();
      onSuccess();
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to create batch");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        
        <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">Batch Name</FormLabel>
                <FormControl>
                  <Input placeholder="React Mastery 2024" {...field} className="glass-input" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <FormField
            control={form.control}
            name="branch"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">Branch</FormLabel>
                <FormControl>
                  <Input placeholder="Main Branch" {...field} className="glass-input" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="trainer"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">Trainer</FormLabel>
                <FormControl>
                  <Input placeholder="Trainer Name or ID" {...field} className="glass-input" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} className="glass-input" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="schedule"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">Schedule</FormLabel>
                <FormControl>
                  <Input placeholder="Mon, Wed, Fri" {...field} className="glass-input" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="pt-4 flex justify-end">
          <Button 
            type="submit" 
            disabled={isLoading}
            className="btn-primary"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Batch
          </Button>
        </div>
      </form>
    </Form>
  );
}
