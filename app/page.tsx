"use client";

import { useUserStore } from "@/store/userStore";
import { useEffect } from "react";
import Greet from "@/components/Greet";
import Product from "@/components/Product";

export default function Home() {
  const { fetchUsername } = useUserStore();

  useEffect(() => {
    fetchUsername();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12 lg:p-24">
      <div className="w-full">
        <Greet />
      </div>
      <div className="w-full">
        <Product />
      </div>
    </main>
  );
}
