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
import { CreateBatchFormValues, createBatchSchema } from "@/Schemas/adminForms";
import { createBatch } from "@/Apis/Batch";
import { getAllTrainers } from "@/Apis/Trainer";
import { getAllBranches } from "@/Apis/Branch";

import { useAuth } from "@/Context/AuthContext";

interface CreateBatchFormProps {
  onSuccess: () => void;
}

interface TrainerOption {
  _id: string; // Assuming API returns _id
  name: string;
}

export default function CreateBatchForm({ onSuccess }: CreateBatchFormProps) {
  const { isAuthenticated } = useAuth();
  const [trainers, setTrainers] = useState<TrainerOption[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [isLoadingTrainers, setIsLoadingTrainers] = useState(false);
  const [isLoadingBranches, setIsLoadingBranches] = useState(false);

  const form = useForm<CreateBatchFormValues>({
    resolver: zodResolver(createBatchSchema),
    defaultValues: {
      title: "",
      branch: "",
      trainer: "",
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: "",
      type: "Weekdays",
    },
  });

  const selectedBranch = form.watch("branch");
  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!isAuthenticated) return;
      setIsLoadingBranches(true);
      try {
        const branchesRes = await getAllBranches();
        const branchList = Array.isArray(branchesRes)
          ? branchesRes
          : branchesRes.data || [];
        setBranches(branchList);
      } catch (error) {
        console.error("Failed to fetch data", error);
        toast.error("Failed to load form data");
      } finally {
        setIsLoadingBranches(false);
      }
    };
    fetchInitialData();
  }, [isAuthenticated]);

  useEffect(() => {
    const fetchTrainersByBranch = async () => {
      if (!isAuthenticated || !selectedBranch) {
        setTrainers([]);
        return;
      }

      setIsLoadingTrainers(true);
      try {
        const trainersRes = await getAllTrainers({ branch: selectedBranch });
        const trainerList = Array.isArray(trainersRes)
          ? trainersRes
          : trainersRes.trainers || trainersRes.data || [];
        setTrainers(trainerList);
      } catch (error) {
        console.error("Failed to fetch trainers", error);
        setTrainers([]);
      } finally {
        setIsLoadingTrainers(false);
      }
    };

    // Reset trainer selection when branch changes
    form.setValue("trainer", "");

    if (selectedBranch) {
      fetchTrainersByBranch();
    } else {
      setTrainers([]);
    }
  }, [selectedBranch, isAuthenticated, form.setValue]);

  async function onSubmit(data: CreateBatchFormValues) {
    if (!isAuthenticated) {
      toast.error("Authentication required");
      return;
    }
    try {
      await createBatch(data);
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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Batch Title</FormLabel>
              <FormControl>
                <Input placeholder="React Mastery 2024" {...field} />
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
                <FormLabel>Branch</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Branch" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {isLoadingBranches ? (
                      <SelectItem value="loading" disabled>
                        Loading branches...
                      </SelectItem>
                    ) : branches.length > 0 ? (
                      branches.map((branch) => (
                        <SelectItem key={branch._id} value={branch._id}>
                          {branch.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>
                        No branches found
                      </SelectItem>
                    )}
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
                <FormLabel>Trainer</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={!selectedBranch}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Trainer" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {isLoadingTrainers ? (
                      <SelectItem value="loading" disabled>
                        Loading trainers...
                      </SelectItem>
                    ) : trainers.length > 0 ? (
                      trainers.map((trainer) => (
                        <SelectItem key={trainer._id} value={trainer._id}>
                          {trainer.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>
                        No trainers available
                      </SelectItem>
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
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
                    <SelectItem value="Weekdays">Weekdays</SelectItem>
                    <SelectItem value="Weekends">Weekends</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="pt-4 flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Batch
          </Button>
        </div>
      </form>
    </Form>
  );
}
