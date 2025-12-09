"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Upload,
  User,
  Calendar,
  Briefcase,
  Mail,
  Sparkles,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type TrainerProfile = {
  image?: string;
  name: string;
  age: string;
  profession: "Senior Trainer" | "Trainer" | "Associate Trainer";
  gender: "Male" | "Female" | "Other";
  email?: string;
};

const defaultProfile: TrainerProfile = {
  image: "",
  name: "",
  age: "",
  profession: "Trainer",
  gender: "Other",
  email: "",
};

interface TrainerProfileFormProps {
  open: boolean;
  onClose: () => void;
  initialProfile?: TrainerProfile;
  onSave: (profile: TrainerProfile) => void;
}

export default function TrainerProfileForm({
  open,
  onClose,
  initialProfile,
  onSave,
}: TrainerProfileFormProps) {
  // Use latest initialProfile (or default) as base
  const initialMerged: TrainerProfile = initialProfile
    ? { ...defaultProfile, ...initialProfile }
    : defaultProfile;

  const [profile, setProfile] = useState<TrainerProfile>(initialMerged);
  const [imagePreview, setImagePreview] = useState<string>(
    initialMerged.image ?? ""
  );

  const resetFromInitial = () => {
    const merged = initialProfile
      ? { ...defaultProfile, ...initialProfile }
      : defaultProfile;
    setProfile(merged);
    setImagePreview(merged.image ?? "");
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImagePreview(result);
      setProfile((prev) => ({ ...prev, image: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    onSave(profile);
    onClose();
  };

  React.useEffect(() => {
    if (open && initialProfile) {
      const merged = { ...defaultProfile, ...initialProfile };
      setProfile(merged);
      setImagePreview(merged.image ?? "");
    }
  }, [open, initialProfile]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden">
        <DialogHeader className="bg-gradient-to-br from-sky-500 to-blue-600 p-6 pb-4 text-white">
          <div className="flex items-center gap-3 mb-1">
            <Sparkles className="w-5 h-5" />
            <DialogTitle className="text-lg font-semibold">
              Edit Profile
            </DialogTitle>
          </div>
          <p className="text-sky-50 text-sm">Update your trainer information</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Image Upload */}
          <div className="flex flex-col items-center">
            <div className="relative group mb-3">
              <Image
                src={
                  imagePreview ||
                  "https://randomuser.me/api/portraits/men/32.jpg"
                }
                alt="Profile preview"
                width={80}
                height={80}
                className="rounded-full object-cover ring-4 ring-sky-100"
              />
              <label
                htmlFor="imageUpload"
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
              >
                <Upload className="w-6 h-6 text-white" />
              </label>
              <input
                type="file"
                id="imageUpload"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
            <span className="text-xs text-muted-foreground">
              Click the image to upload a new photo
            </span>
          </div>

          {/* Name */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm font-medium text-[var(--card-foreground)]">
              <User className="w-4 h-4 text-sky-600" />
              Full Name
            </label>
            <Input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
              className="focus-visible:ring-sky-500"
            />
          </div>

          {/* Age */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm font-medium text-[var(--card-foreground)]">
              <Calendar className="w-4 h-4 text-sky-600" />
              Age
            </label>
            <Input
              type="text"
              name="age"
              value={profile.age}
              onChange={handleChange}
              placeholder="Enter your age"
              className="focus-visible:ring-sky-500"
            />
          </div>

          {/* Profession */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm font-medium text-[var(--card-foreground)]">
              <Briefcase className="w-4 h-4 text-sky-600" />
              Profession
            </label>
            <Select
              value={profile.profession}
              onValueChange={(value) =>
                setProfile((prev) => ({
                  ...prev,
                  profession: value as TrainerProfile["profession"],
                }))
              }
            >
              <SelectTrigger className="w-full focus:ring-sky-500">
                <SelectValue placeholder="Select profession" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Senior Trainer">Senior Trainer</SelectItem>
                <SelectItem value="Trainer">Trainer</SelectItem>
                <SelectItem value="Associate Trainer">
                  Associate Trainer
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Gender */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm font-medium text-[var(--card-foreground)]">
              <User className="w-4 h-4 text-sky-600" />
              Gender
            </label>
            <Select
              value={profile.gender}
              onValueChange={(value) =>
                setProfile((prev) => ({
                  ...prev,
                  gender: value as TrainerProfile["gender"],
                }))
              }
            >
              <SelectTrigger className="w-full focus:ring-sky-500">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm font-medium text-[var(--card-foreground)]">
              <Mail className="w-4 h-4 text-sky-600" />
              Email
            </label>
            <Input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="focus-visible:ring-sky-500"
            />
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetFromInitial();
                onClose();
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
