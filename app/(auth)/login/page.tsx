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
import { useToast } from "@/components/ui/use-toast";
import { handleSignIn } from "@/actions/auth.actions";
import { useRouter } from "next/navigation";
import { ForgotPassword } from "@/components/shared/ForgotPassword/ForgotPassword";

export default function LoginForm() {
  // state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  //hooks
  const { toast } = useToast();
  const router = useRouter();

  //handler

  const loginHandler = async () => {
    try {
      // handle login
      const result = await handleSignIn({ username: email, password });
      setLoading(true);
      if (result === true) {
        setLoading(false);
        router.push("/");
      }
    } catch (error: any) {
      toast({
        title: "Error Logging In",
        description: `${error.message}`,
      });
    }
  };
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex min-h-screen flex-col items-center justify-between p-24">
        <Card className="mx-auto max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
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
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <ForgotPassword />
                </div>
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
                onClick={loginHandler}
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
              <Verify />
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="underline">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
