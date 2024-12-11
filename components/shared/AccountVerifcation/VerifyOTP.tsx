"use client";
import {
  InputOTP,
  InputOTPSlot,
  InputOTPGroup,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { useState } from "react";

interface VerifyOTPProps {
  setOtp: (otp: string) => void;
}

export function VerifyOTP({ setOtp }: VerifyOTPProps) {
  const [value, setValue] = useState("");
  return (
    <InputOTP
      maxLength={6}
      value={value}
      onChange={(value: string) => {
        setValue(value);
      }}
      onComplete={() => {
        setOtp(value);
      }}
    >
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  );
}
