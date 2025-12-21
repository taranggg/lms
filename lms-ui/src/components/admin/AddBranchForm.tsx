import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { addBranch, BranchData } from "@/Apis/Branch";
import { useAuth } from "@/Context/AuthContext";

const branchSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
});

type BranchFormValues = z.infer<typeof branchSchema>;

interface AddBranchFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function AddBranchForm({
  open,
  onOpenChange,
  onSuccess,
}: AddBranchFormProps) {
  const { token } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<BranchFormValues>({
    resolver: zodResolver(branchSchema),
    defaultValues: {
      name: "",
      address: "",
    },
  });

  const onSubmit = async (data: BranchFormValues) => {
    try {
      if (!token) {
        toast.error("Authentication failed. Please login again.");
        return;
      }
      await addBranch(data, token);
      toast.success("Branch added successfully!");
      reset();
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Failed to add branch:", error);
      toast.error(error.response?.data?.message || "Failed to add branch");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-background/90 backdrop-blur-xl border border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add New Branch</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Branch Name</Label>
            <Input
              id="name"
              placeholder="e.g. Downtown Branch"
              {...register("name")}
              className="bg-transparent border-input"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              placeholder="e.g. 123 Tech Park, London"
              {...register("address")}
               className="bg-transparent border-input"
            />
            {errors.address && (
              <p className="text-sm text-destructive">{errors.address.message}</p>
            )}
          </div>
          <div className="flex justify-end gap-3 mt-6">
           
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Branch"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
