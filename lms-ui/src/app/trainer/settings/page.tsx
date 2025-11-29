"use client"
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export default function TrainerSettings() {
  // Dummy state for UI
  const [notifications, setNotifications] = React.useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md p-6">
        <CardHeader>
          <CardTitle className="text-xl">Trainer Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4">
            <Input type="text" placeholder="Full Name" required />
            <Input type="email" placeholder="Email" required />
            <Input type="password" placeholder="New Password" />
            <div className="flex items-center gap-2">
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
              />
              <span className="text-sm">Enable Notifications</span>
            </div>
            <Button type="submit" className="w-full">
              Update Settings
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
