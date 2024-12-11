"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Verify from "@/components/shared/AccountVerifcation/Verify";
import { useState } from "react";
import { handleSignUp } from "@/actions/auth.actions";
import { useToast } from "@/components/ui/use-toast";
import OTP from "@/components/shared/AccountVerifcation/OTP";

export default function SignUpForm() {
  // States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showOtp, setShowOtp] = useState(false);

  // hooks
  const { toast } = useToast();

  //Action Handlers
  const singUpHandler = async () => {
    try {
      const result = await handleSignUp({ email, password, name });

      if (result === true) {
        setShowOtp(true);
        toast({
          title: "Email Sent",
          description: "Please check your email for the verification code",
        });
      }
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Error Signing Up",
        description: `${error}`,
      });
    }
  };

  // JSX
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex min-h-screen flex-col items-center justify-between p-24">
        <Card className="mx-auto max-w-sm">
          <CardHeader>
            <CardTitle className="text-xl">Sign Up</CardTitle>
            <CardDescription>
              Enter your information to create an account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-1 gap-4">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Max"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                onClick={singUpHandler}
                disabled={showOtp === true}
              >
                Create an account
              </Button>
              {showOtp ? <OTP username={email} /> : <Verify />}
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
