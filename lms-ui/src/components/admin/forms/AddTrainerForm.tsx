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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AddTrainerFormValues, addTrainerSchema } from "@/Schemas/adminForms";
import { addTrainer } from "@/Apis/Trainer";
import { getAllBranches } from "@/Apis/Branch";
import { getAllDomains } from "@/Apis/Domain";

import { useAuth } from "@/Context/AuthContext";
import { useEffect, useState } from "react";

interface AddTrainerFormProps {
  onSuccess: () => void;
}

// ... (imports)

// ...

export default function AddTrainerForm({ onSuccess }: AddTrainerFormProps) {
  const { isAuthenticated } = useAuth();
  const [domains, setDomains] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [isLoadingDomains, setIsLoadingDomains] = useState(false);
  const [isLoadingBranches, setIsLoadingBranches] = useState(false);

  const form = useForm<AddTrainerFormValues>({
    resolver: zodResolver(addTrainerSchema),
    defaultValues: {
      name: "",
      email: "",
      gender: "",
      branch: "",
      domain: "",
      mobileNumber: "",
      designation: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated) return;
      setIsLoadingDomains(true);
      setIsLoadingBranches(true);
      try {
        const [domainsRes, branchesRes] = await Promise.all([
          getAllDomains(),
          getAllBranches(),
        ]);

        const domainList = Array.isArray(domainsRes)
          ? domainsRes
          : domainsRes.data || [];
        setDomains(domainList);

        const branchList = Array.isArray(branchesRes)
          ? branchesRes
          : branchesRes.data || [];
        setBranches(branchList);
      } catch (error) {
        console.error("Failed to fetch data", error);
        toast.error("Failed to load form data");
      } finally {
        setIsLoadingDomains(false);
        setIsLoadingBranches(false);
      }
    };
    fetchData();
  }, [isAuthenticated]);

  async function onSubmit(data: AddTrainerFormValues) {
    if (!isAuthenticated) {
      toast.error("Authentication required");
      return;
    }
    try {
      await addTrainer(data);
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
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
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
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input placeholder="john@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="branch"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Branch</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
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
            name="domain"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Domain</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          isLoadingDomains ? "Loading..." : "Select Domain"
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {isLoadingDomains ? (
                      <SelectItem value="loading" disabled>
                        Loading domains...
                      </SelectItem>
                    ) : domains.length > 0 ? (
                      domains.map((domain) => (
                        <SelectItem key={domain._id} value={domain._id}>
                          {domain.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>
                        No domains found
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
            name="mobileNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mobile Number</FormLabel>
                <FormControl>
                  <Input placeholder="9876543210" {...field} />
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
                <FormLabel>Designation</FormLabel>
                <FormControl>
                  <Input placeholder="Senior Developer" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="pt-4 flex justify-end gap-2">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Add Trainer
          </Button>
        </div>
      </form>
    </Form>
  );
}
