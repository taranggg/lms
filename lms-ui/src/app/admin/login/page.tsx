"use client"
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";

export default function AdminLogin() {
  // Dummy state for alert
  const [error, setError] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <Card className="w-full max-w-md p-6 bg-[var(--card)] text-[var(--card-foreground)]">
        <CardHeader>
          <CardTitle className="text-xl">Admin Login</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form className="flex flex-col gap-4">
            <Input
              type="email"
              placeholder="Email"
              required
              className="bg-[var(--input)] text-[var(--foreground)]"
            />
            <Input
              type="password"
              placeholder="Password"
              required
              className="bg-[var(--input)] text-[var(--foreground)]"
            />
            <Button
              type="submit"
              className="w-full bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--secondary)]"
            >
              Login
            </Button>
          </form>
          <div className="mt-4 text-center">
            <Link
              href="#"
              className="text-[var(--color-login-link,#2563eb)] hover:underline text-sm"
            >
              Forgot password?
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
