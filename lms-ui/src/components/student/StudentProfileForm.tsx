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

export type StudentProfile = {
  image?: string;
  name: string;
  age: string;
  profession: "College Student" | "School Student" | "Working";
  gender: "Male" | "Female" | "Other";
  email?: string;
};

const defaultProfile: StudentProfile = {
  image: "",
  name: "",
  age: "",
  profession: "College Student",
  gender: "Other",
  email: "",
};

interface StudentProfileFormProps {
  open: boolean;
  onClose: () => void;
  initialProfile?: StudentProfile;
  onSave: (profile: StudentProfile) => void;
}

export default function StudentProfileForm({
  open,
  onClose,
  initialProfile,
  onSave,
}: StudentProfileFormProps) {
  // Use latest initialProfile (or default) as base
  const initialMerged: StudentProfile = initialProfile
    ? { ...defaultProfile, ...initialProfile }
    : defaultProfile;

  const [profile, setProfile] = useState<StudentProfile>(initialMerged);
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

  const handleDialogChange = (isOpen: boolean) => {
    if (isOpen) {
      // When opening, sync with latest initialProfile
      resetFromInitial();
    } else {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="max-w-lg sm:max-w-xl border-border/70 bg-[var(--card)]/95 backdrop-blur-md">
        <DialogHeader className="space-y-1">
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Sparkles className="w-5 h-5 text-sky-500" />
            <span>Edit your profile</span>
          </DialogTitle>
          <p className="text-xs sm:text-sm text-muted-foreground">
            This helps us personalize your learning journey and keep your
            dashboard up to date.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-3 space-y-5">
          {/* Avatar + name/email block */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <div className="flex flex-col items-center gap-2">
              <label htmlFor="profile-image" className="cursor-pointer group">
                <div className="relative">
                  {imagePreview ? (
                    <Image
                      src={imagePreview}
                      alt="Profile"
                      width={80}
                      height={80}
                      className="rounded-full object-cover ring-2 ring-sky-200 shadow-sm"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-sky-100 to-indigo-100 flex items-center justify-center ring-2 ring-sky-200 shadow-sm">
                      <Upload className="w-6 h-6 text-sky-500" />
                    </div>
                  )}
                  <div className="absolute inset-0 rounded-full bg-black/10 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] text-white font-medium transition-opacity">
                    Change
                  </div>
                </div>
              </label>
              <Input
                id="profile-image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
              <span className="text-[11px] text-muted-foreground">
                JPG / PNG, max ~2MB
              </span>
            </div>

            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div className="space-y-1.5">
                <label
                  className="text-xs font-medium flex items-center gap-1 text-muted-foreground"
                  htmlFor="profile-name"
                >
                  <User className="w-3.5 h-3.5" /> Name
                </label>
                <Input
                  id="profile-name"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  required
                  placeholder="Your full name"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label
                  className="text-xs font-medium flex items-center gap-1 text-muted-foreground"
                  htmlFor="profile-email"
                >
                  <Mail className="w-3.5 h-3.5" /> Email
                </label>
                <Input
                  id="profile-email"
                  name="email"
                  type="email"
                  value={profile.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                />
              </div>
            </div>
          </div>

          {/* Main details grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Profession */}
            <div className="space-y-1.5">
              <label
                className="text-xs font-medium flex items-center gap-1 text-muted-foreground"
                htmlFor="profile-profession"
              >
                <Briefcase className="w-3.5 h-3.5" /> Profession
              </label>
              <Select
                value={profile.profession}
                onValueChange={(val) =>
                  setProfile((prev) => ({
                    ...prev,
                    profession: val as StudentProfile["profession"],
                  }))
                }
              >
                <SelectTrigger
                  id="profile-profession"
                  className="h-9 text-xs sm:text-sm"
                >
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="College Student">
                    College Student
                  </SelectItem>
                  <SelectItem value="School Student">School Student</SelectItem>
                  <SelectItem value="Working">Working</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Age */}
            <div className="space-y-1.5">
              <label
                className="text-xs font-medium flex items-center gap-1 text-muted-foreground"
                htmlFor="profile-age"
              >
                <Calendar className="w-3.5 h-3.5" /> Age
              </label>
              <Input
                id="profile-age"
                name="age"
                type="number"
                min={1}
                value={profile.age}
                onChange={handleChange}
                required
                placeholder="18"
              />
            </div>

            {/* Gender */}
            <div className="space-y-1.5">
              <label
                className="text-xs font-medium flex items-center gap-1 text-muted-foreground"
                htmlFor="profile-gender"
              >
                Gender
              </label>
              <Select
                value={profile.gender}
                onValueChange={(val) =>
                  setProfile((prev) => ({
                    ...prev,
                    gender: val as StudentProfile["gender"],
                  }))
                }
              >
                <SelectTrigger
                  id="profile-gender"
                  className="h-9 text-xs sm:text-sm"
                >
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="mt-3 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleDialogChange(false)}
              className="text-xs sm:text-sm"
            >
              Cancel
            </Button>
            <Button type="submit" className="text-xs sm:text-sm px-4 sm:px-5">
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
