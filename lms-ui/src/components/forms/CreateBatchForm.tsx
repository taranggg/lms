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
  CreateBatchFormValues,
  createBatchSchema,
} from "@/Schemas/adminForms";
import { createBatch } from "@/Apis/Batch";
import { getAllTrainers, getTrainerById } from "@/Apis/Trainer";
import { getAllBranches } from "@/Apis/Branch";
import { useAuth } from "@/Context/AuthContext";

interface CreateBatchFormProps {
  onSuccess: () => void;
  fixedTrainerId?: string; // If provided, auto-selects and hides trainer field
  fixedBranchId?: string;  // If provided, auto-selects and hides branch field
}

interface TrainerOption {
  _id: string;
  name: string;
}

export default function CreateBatchForm({ onSuccess, fixedTrainerId, fixedBranchId }: CreateBatchFormProps) {
  const { token } = useAuth();
  const [trainers, setTrainers] = useState<TrainerOption[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [isLoadingTrainers, setIsLoadingTrainers] = useState(false);
  const [isLoadingBranches, setIsLoadingBranches] = useState(false);

  const form = useForm<CreateBatchFormValues>({
    resolver: zodResolver(createBatchSchema),
    defaultValues: {
      title: "",
      branch: fixedBranchId || "",
      trainer: fixedTrainerId || "",
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: "",
      type: "Weekdays",
    },
  });

  const selectedBranch = form.watch("branch");
  const isLoading = form.formState.isSubmitting;

  // 1. Fetch Initial Data (Branches) - Only if branch not fixed
  useEffect(() => {
    const fetchBranches = async () => {
        if (!token || fixedBranchId || fixedTrainerId) return; // Skip if fixed or if trainer is fixed (we derive branch)
        setIsLoadingBranches(true);
        try {
            const branchesRes = await getAllBranches(token);
            const branchList = Array.isArray(branchesRes) ? branchesRes : (branchesRes.data || []);
            setBranches(branchList);
        } catch (error) {
            console.error("Failed to fetch branches", error);
            toast.error("Failed to load branches");
        } finally {
            setIsLoadingBranches(false);
        }
    };
    fetchBranches();
  }, [token, fixedBranchId]);


  // 2. Fetch Trainers (when Branch Selected) - Only if trainer not fixed
  useEffect(() => {
      const fetchTrainersByBranch = async () => {
          if (!token || !selectedBranch || fixedTrainerId) return; // Skip if no branch or trainer fixed
          
          setIsLoadingTrainers(true);
          try {
              const trainersRes = await getAllTrainers(token, { branch: selectedBranch });
              const trainerList = Array.isArray(trainersRes) ? trainersRes : (trainersRes.trainers || trainersRes.data || []);
              setTrainers(trainerList);
          } catch (error) {
              console.error("Failed to fetch trainers", error);
              setTrainers([]);
          } finally {
              setIsLoadingTrainers(false);
          }
      };

      // Reset trainer if not fixed and branch changed (and it's not the initial mount with existing value)
      // Actually, be careful not to reset if we just set it.
      if (!fixedTrainerId) {
          // If branch changes, we might want to reset trainer, but only if it doesn't match current trainers?
          // For now, simpler logic: if branch changes, clear trainer unless it's the same.
          // let's just fetch. form reset logic is tricky.
          // form.setValue("trainer", ""); 
          fetchTrainersByBranch();
      }
  }, [selectedBranch, token, fixedTrainerId]);


  // 3. Special Case: Fixed Trainer but NO Fixed Branch (Trainer Dashboard Case)
  // We need to fetch the trainer's branch to auto-fill it.
  useEffect(() => {
      const autoFillBranchFromTrainer = async () => {
          if (!token || !fixedTrainerId || fixedBranchId) return; 
          // If we have a fixed trainer but no fixed branch, we need to find the branch.
          
          try {
             // We can use getTrainerById to find their branch
             const trainerRes = await getTrainerById(fixedTrainerId, token);
             if (trainerRes) {
                const trainerBranchId = typeof trainerRes.branch === 'object' ? trainerRes.branch?._id : trainerRes.branch;
                if (trainerBranchId) {
                     form.setValue("branch", trainerBranchId);
                }
             }
          } catch (error) {
              console.error("Failed to fetch trainer details for branch", error);
          }
      };
      
      autoFillBranchFromTrainer();
  }, [token, fixedTrainerId, fixedBranchId, form]);


  // Keep fixed values in sync
  useEffect(() => {
      if (fixedTrainerId) form.setValue("trainer", fixedTrainerId);
  }, [fixedTrainerId, form]);

  useEffect(() => {
    if (fixedBranchId) form.setValue("branch", fixedBranchId);
  }, [fixedBranchId, form]);


  async function onSubmit(data: CreateBatchFormValues) {
    if (!token) {
      toast.error("Authentication token missing");
      return;
    }
    try {
      // Ensure fixed values are enforced
      const payload = { 
          ...data, 
          trainer: fixedTrainerId || data.trainer, 
          branch: fixedBranchId || data.branch 
      };
      
      await createBatch(payload, token);
      toast.success("Batch created successfully!");
      form.reset();
      // Restore fixed values after reset
      if(fixedTrainerId) form.setValue("trainer", fixedTrainerId);
      if(fixedBranchId) form.setValue("branch", fixedBranchId);
      
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

        {/* Branch Selection - Hidden if fixedBranchId is present OR if we are auto-handling it (Trainer Case) */}
        {/* Note: logic for hiding: if fixedBranchId is passed, definitely hide. 
            If fixedTrainerId passed but NO fixedBranch_id, we fetch it and set it. 
            Ideally we still hide it to avoid confusion or disable it. 
            Let's hide it if fixedBranchId is set OR if fixedTrainerId is set (implying we derive branch) 
        */}
        {(!fixedBranchId && !fixedTrainerId) ? (
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

              <FormField
                control={form.control}
                name="trainer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trainer</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={!selectedBranch}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Trainer" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isLoadingTrainers ? (
                            <SelectItem value="loading" disabled>Loading trainers...</SelectItem>
                        ) : trainers.length > 0 ? (
                            trainers.map((trainer) => (
                                <SelectItem key={trainer._id} value={trainer._id}>
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
        ) : (
             <>
                <input type="hidden" {...form.register("branch")} />
                <input type="hidden" {...form.register("trainer")} />
             </>
        )}

        {/* Date Fields */}
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
