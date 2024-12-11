"use client";
import {
  handleConfirmResetPassword,
  handleResetPassword,
} from "@/actions/auth.actions";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";

export function ForgotPassword() {
  // state
  const [email, setEmail] = useState("");
  const [showResetInstructions, setShowResetInstructions] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");

  // hooks
  const { toast } = useToast();

  // action handlers
  const resetHandler = async () => {
    // username is email
    try {
      const result = await handleResetPassword({
        username: email,
      });
      if (result === true) {
        // show success message
        setShowResetInstructions(true);
        toast({
          title: "Password Reset Instructions Sent",
          description: `Please check your email for instructions to reset your password`,
        });
      }
    } catch (error: any) {
      // show error message
      toast({
        title: "Error Resetting Password",
        description: error.message,
      });
    }
  };

  const confirmResetPasswordHandler = async () => {
    try {
      const result = await handleConfirmResetPassword({
        username: email,
        newPassword,
        confirmationCode,
      });
      if (result === true) {
        // show success message
        toast({
          title: "Password Reset",
          description: `Your password has been reset successfully`,
        });

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error: any) {
      // show error message
      toast({
        title: "Error Resetting Password",
        description: error.message,
      });
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Link href="#" className="ml-auto inline-block text-sm underline">
          Forgot your password?
        </Link>
      </DialogTrigger>

      {!showResetInstructions && (
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Enter your email</DialogTitle>
            <DialogDescription>
              Enter your email address to receive a password reset link.
            </DialogDescription>
          </DialogHeader>
          <div className="mb-2">
            <Label htmlFor="name" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="col-span-3"
              type="email"
              required
              placeholder="Enter your email"
            />
          </div>

          <Button type="submit" onClick={resetHandler}>
            Send Reset Code
          </Button>
        </DialogContent>
      )}

      {showResetInstructions && (
        <DialogContent className="sm:max-w-[425px] py-2">
          <div className="mb-2">
            <Label htmlFor="name" className="text-right">
              Code
            </Label>
            <Input
              id="text"
              value={confirmationCode}
              onChange={(e) => setConfirmationCode(e.target.value)}
              type="text"
              required
              placeholder="Enter the code recieved"
            />

            <Label htmlFor="newPassword" className="text-right">
              New Password
            </Label>
            <Input
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              type="password"
              required
              placeholder="Enter your new password"
            />
          </div>

          <Button type="submit" onClick={confirmResetPasswordHandler}>
            Reset Password
          </Button>
        </DialogContent>
      )}
    </Dialog>
  );
}
