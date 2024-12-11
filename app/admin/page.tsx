"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchAuthSession } from "aws-amplify/auth";
import { ProductForm } from "@/components/ProductForm";

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { tokens } = await fetchAuthSession({ forceRefresh: true });
        const groups = tokens?.idToken?.payload["cognito:groups"] as string[];

        const isAdmin = groups?.[0] === "admin";

        if (!isAdmin) {
          // Redirect to the home page if the user is not an admin
          router.push("/");
          return;
        }
      } catch (err) {
        console.log(err);
        // Redirect to the home page if an error occurs
        router.push("/");
      }
    };

    fetchSession();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-20">
      <ProductForm />
    </div>
  );
}
