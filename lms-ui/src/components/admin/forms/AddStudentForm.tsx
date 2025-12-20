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
  AddStudentFormValues,
  addStudentSchema,
} from "@/Schemas/adminForms";
import { createStudent } from "@/Services/Student";
import { useAuth } from "@/Context/AuthContext";

interface AddStudentFormProps {
  onSuccess: () => void;
}

// ... (imports)

// ...

export default function AddStudentForm({ onSuccess }: AddStudentFormProps) {
  const { token } = useAuth();
  const form = useForm<AddStudentFormValues>({
    resolver: zodResolver(addStudentSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  async function onSubmit(data: AddStudentFormValues) {
    if (!token) {
      toast.error("Authentication token missing");
      return;
    }
    try {
      await createStudent(data, token);
      toast.success("Student added successfully!");
      form.reset();
      onSuccess();
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to add student");
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
              <FormLabel className="text-gray-700 font-medium">Name</FormLabel>
              <FormControl>
                <Input placeholder="Jane Doe" {...field} className="glass-input" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 font-medium">Email</FormLabel>
              <FormControl>
                <Input placeholder="jane@example.com" {...field} className="glass-input" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-4 flex justify-end">
          <Button 
            type="submit" 
            disabled={isLoading}
            className="btn-primary"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Add Student
          </Button>
        </div>
      </form>
    </Form>
  );
}
