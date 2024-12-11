"use client";
import { useUserStore } from "@/store/userStore";
import { Button } from "./ui/button";
import { handleSignOut } from "@/actions/auth.actions";
import { useToast } from "./ui/use-toast";
import { useRouter } from "next/navigation";
export default function Greet() {
  const { username, sub } = useUserStore();
  console.log("username", username);

  // hooks
  const router = useRouter();
  const { toast } = useToast();

  // Render the component with the fetched username

  const SignOutHandler = async () => {
    // Sign out the user
    try {
      const result = await handleSignOut();
      if (result === true) {
        router.push("/login");
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error Signing Out",
        description: `${error}`,
      });
    }
  };
  return (
    <div className="flex justify-between w-full">
      Hello, {username}!
      <div className="flex gap-5">
        <Button onClick={SignOutHandler} variant="outline" className="ml-5">
          Sign Out
        </Button>
        <Button onClick={() => router.push("/cart")}>Checkout</Button>
      </div>
    </div>
  );
}
