/*
 * This OTP component is a simplified version of the Verify component.
 * It only asks for the OTP code and does not have the email verification part.
 * The Main Goal of this component is to integrate it with the sign up flow.
 */
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
import { handleSignUpConfirmation } from "@/actions/auth.actions";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { VerifyOTP } from "./VerifyOTP";

interface OTPProps {
  username: string; // email in our case from cognito
}
export default function OTP({ username }: OTPProps) {
  //state
  const [otp, setOtp] = useState("");

  // hooks
  const { toast } = useToast();
  const router = useRouter();

  //Action Handlers
  const handleVerify = async () => {
    // username is email
    try {
      const result = await handleSignUpConfirmation({
        username,
        confirmationCode: otp,
      });
      if (result === true) {
        router.push("/login");
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
        <Button>Enter OTP</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enter Code</DialogTitle>
          <DialogDescription>
            Check your inbox for the verification code.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center">
          <VerifyOTP setOtp={setOtp} />
        </div>
        <DialogFooter>
          <Button onClick={handleVerify} disabled={otp.length !== 6}>
            Verify
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
