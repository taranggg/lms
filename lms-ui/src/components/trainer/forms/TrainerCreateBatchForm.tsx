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
// Reusing admin schema for now, essentially same fields but trainer is fixed
import {
  CreateBatchFormValues,
  createBatchSchema,
} from "@/Schemas/adminForms";
import { createBatch } from "@/Apis/Batch";
import { getAllBranches } from "@/Apis/Branch";
import { useAuth } from "@/Context/AuthContext";

interface TrainerCreateBatchFormProps {
  onSuccess: () => void;
  trainerId: string;
}

export default function TrainerCreateBatchForm({ onSuccess, trainerId }: TrainerCreateBatchFormProps) {
  const { token } = useAuth();
  const [branches, setBranches] = useState<any[]>([]);
  const [isLoadingBranches, setIsLoadingBranches] = useState(false);

  // We set default trainer to the current trainerId
  const form = useForm<CreateBatchFormValues>({
    resolver: zodResolver(createBatchSchema),
    defaultValues: {
      title: "",
      branch: "",
      trainer: trainerId, // Auto-set trainer
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: "",
      type: "Weekdays",
    },
  });

  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    const fetchBranches = async () => {
        if (!token) return;
        setIsLoadingBranches(true);
        try {
            const branchesRes = await getAllBranches(token);
            const branchList = Array.isArray(branchesRes) ? branchesRes : (branchesRes.data || []);
            setBranches(branchList);
            
            // If only one branch exists, auto-select it? Optional UX enhancement
            // if (branchList.length === 1) form.setValue("branch", branchList[0]._id);
        } catch (error) {
            console.error("Failed to fetch branches", error);
            toast.error("Failed to load branches");
        } finally {
            setIsLoadingBranches(false);
        }
    };
    fetchBranches();
  }, [token]);

  // Keep the hidden field updated just in case
  useEffect(() => {
      if(trainerId) {
          form.setValue("trainer", trainerId);
      }
  }, [trainerId, form.setValue]);

  async function onSubmit(data: CreateBatchFormValues) {
    if (!token) {
      toast.error("Authentication token missing");
      return;
    }
    try {
      // Ensure trainer is definitely set to current user, overriding any potential tampering
      const payload = { ...data, trainer: trainerId };
      await createBatch(payload, token);
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
                  <Input placeholder="e.g. React Fundamentals" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        {/* Branch Selection */}
        <div className="grid grid-cols-1 gap-4"> 
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
                        <SelectItem value="loading" disabled>Loading branches...</SelectItem>
                     ) : branches.length > 0 ? (
                        branches.map((branch) => (
                           <SelectItem key={branch._id} value={branch._id}>
                             {branch.name}
                           </SelectItem>
                        ))
                     ) : (
                        <SelectItem value="none" disabled>No branches found</SelectItem>
                     )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {/* Hidden Trainer Field: logic is handled in onSubmit/defaultValues */}
        <input type="hidden" {...form.register("trainer")} />

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

        <div className="grid grid-cols-1 gap-4">
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
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Batch
          </Button>
        </div>
      </form>
    </Form>
  );
}
