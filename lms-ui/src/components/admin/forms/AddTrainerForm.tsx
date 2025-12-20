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
  AddTrainerFormValues,
  addTrainerSchema,
} from "@/Schemas/adminForms";
import { addTrainer } from "@/Services/Trainer";
import { useAuth } from "@/Context/AuthContext";

interface AddTrainerFormProps {
  onSuccess: () => void;
}

// ... (imports)

// ...

export default function AddTrainerForm({ onSuccess }: AddTrainerFormProps) {
  const { token } = useAuth();
  const form = useForm<AddTrainerFormValues>({
    resolver: zodResolver(addTrainerSchema),
    defaultValues: {
      name: "",
      email: "",
      branch: "",
      domain: "",
      mobileNumber: "",
      designation: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  async function onSubmit(data: AddTrainerFormValues) {
    if (!token) {
      toast.error("Authentication token missing");
      return;
    }
    try {
      await addTrainer(data, token);
      toast.success("Trainer added successfully!");
      form.reset();
      onSuccess();
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to add trainer");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} className="glass-input" />
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
                  <Input placeholder="john@example.com" {...field} className="glass-input" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

           <FormField
            control={form.control}
            name="mobileNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">Mobile Number</FormLabel>
                <FormControl>
                  <Input placeholder="9876543210" {...field} className="glass-input" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="designation"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">Designation</FormLabel>
                <FormControl>
                  <Input placeholder="Senior Developer" {...field} className="glass-input" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
            name="domain"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">Domain</FormLabel>
                <FormControl>
                  <Input placeholder="Full Stack" {...field} className="glass-input" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="pt-4 flex justify-end gap-2">
            <Button 
                type="submit" 
                disabled={isLoading}
                className="btn-primary"
            >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Add Trainer
          </Button>
        </div>
      </form>
    </Form>
  );
}
