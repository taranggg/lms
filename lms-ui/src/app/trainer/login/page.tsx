"use client";
import React, { useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { trainers } from "@/mock/trainer/trainers";
import { useRouter } from "next/navigation";

export default function TrainerLogin() {
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const email = emailRef.current?.value || "";
    const password = passwordRef.current?.value || "";
    const trainer = trainers.find(
      (t) => t.email === email && t.password === password
    );
    if (trainer) {
      setError(null);
      router.push(`/trainer/${trainer.id}`);
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md p-6">
        <CardHeader>
          <CardTitle className="text-xl">Trainer Login</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form className="flex flex-col gap-4" onSubmit={handleLogin}>
            <Input type="email" placeholder="Email" required ref={emailRef} />
            <Input
              type="password"
              placeholder="Password"
              required
              ref={passwordRef}
            />
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
          <div className="mt-4 text-center">
            <Link href="#" className="text-blue-600 hover:underline text-sm">
              Forgot password?
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
