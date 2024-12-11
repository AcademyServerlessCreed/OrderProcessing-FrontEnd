"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { VerifyOTP } from "./VerifyOTP";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { handleSignUpConfirmation } from "@/actions/auth.actions";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

export default function Verify() {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [showOtp, setShowOtp] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  const handleVerify = async (username: string) => {
    // username is email
    try {
      const result = await handleSignUpConfirmation({
        username,
        confirmationCode: otp,
      });
      if (result === true) {
        router.push("/");
      }
    } catch (error: any) {
      toast({
        title: "Error Confirming User",
        description: error.message,
      });
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Verify your account</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enter Code</DialogTitle>
          <DialogDescription>
            Check your inbox for the verification code.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center">
          {showOtp === true ? (
            <VerifyOTP setOtp={setOtp} />
          ) : (
            <div className="flex flex-row gap-2 justify-evenly items-center">
              <Label htmlFor="email" className="text-md">
                Email
              </Label>
              <Input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required={true}
              />
              <Button onClick={() => setShowOtp(true)}>
                {showOtp ? "Resend OTP" : "Send OTP"}
              </Button>
            </div>
          )}
        </div>

        <DialogFooter>
          {showOtp && (
            <div className="flex justify-evenly items-baseline w-full">
              {" "}
              <div
                className="underline cursor-pointe"
                onClick={() => setShowOtp(false)}
              >
                <DialogDescription>Re-enter Email</DialogDescription>
              </div>
              <div>
                <Button
                  disabled={showOtp ? otp.length !== 4 : email.length === 0}
                  onClick={() => handleVerify(email)}
                >
                  Verify
                </Button>
              </div>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
