"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";
import {
  CreateBatchFormValues,
  createBatchSchema,
} from "@/Schemas/adminForms";
import { createBatch } from "@/Services/Batch";
import { getAllTrainers } from "@/Services/Trainer";
import { useAuth } from "@/Context/AuthContext";

interface CreateBatchFormProps {
  onSuccess: () => void;
}

interface TrainerOption {
  _id: string; // Assuming API returns _id
  name: string;
}

export default function CreateBatchForm({ onSuccess }: CreateBatchFormProps) {
  const { token } = useAuth();
  const [trainers, setTrainers] = useState<TrainerOption[]>([]);
  const [isLoadingTrainers, setIsLoadingTrainers] = useState(false);

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

  useEffect(() => {
    const fetchTrainers = async () => {
        if (!token) return;
        setIsLoadingTrainers(true);
        try {
            const res = await getAllTrainers(token);
            // Assuming res is the array or res.data is the array. 
            // Based on previous Service code: `return res.data;`
            // Let's assume res.data is the list of trainers or res is the list.
            // If the API returns { trainers: [...] } or just [...], we'll need to adapt.
            // Safe bet: check if Array.isArray(res) or res.trainers.
            const trainerList = Array.isArray(res) ? res : (res.trainers || []);
            setTrainers(trainerList);
        } catch (error) {
            console.error("Failed to fetch trainers", error);
            toast.error("Failed to load trainers");
        } finally {
            setIsLoadingTrainers(false);
        }
    };
    fetchTrainers();
  }, [token]);

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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="glass-input">
                      <SelectValue placeholder="Select Branch" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Main Branch">Main Branch</SelectItem>
                    <SelectItem value="Downtown Branch">Downtown Branch</SelectItem>
                    <SelectItem value="Online">Online</SelectItem>
                  </SelectContent>
                </Select>
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="glass-input">
                      <SelectValue placeholder="Select Trainer" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {isLoadingTrainers ? (
                        <SelectItem value="loading" disabled>Loading trainers...</SelectItem>
                    ) : trainers.length > 0 ? (
                        trainers.map((trainer) => (
                            <SelectItem key={trainer._id} value={trainer.name}>
                                {trainer.name}
                            </SelectItem>
                        ))
                    ) : (
                        <SelectItem value="none" disabled>No trainers available</SelectItem>
                    )}
                  </SelectContent>
                </Select>
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
                  <ToggleGroup
                    type="multiple"
                    className="justify-start gap-2 flex-wrap"
                    value={field.value ? field.value.split(", ") : []}
                    onValueChange={(value) => {
                      const daysOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
                      const sortedDays = value.sort(
                        (a, b) => daysOrder.indexOf(a) - daysOrder.indexOf(b)
                      );
                      field.onChange(sortedDays.join(", "));
                    }}
                  >
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                      <ToggleGroupItem
                        key={day}
                        value={day}
                        aria-label={`Toggle ${day}`}
                        className="glass-input data-[state=on]:bg-primary data-[state=on]:text-primary-foreground hover:bg-primary/10 hover:text-primary border-transparent"
                      >
                        {day}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
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
