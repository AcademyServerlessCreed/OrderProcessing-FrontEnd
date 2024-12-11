"use client";

import Cart from "@/components/Cart";

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12 lg:p-24">
      <div className="w-full">
        <Cart />
      </div>
    </main>
  );
}
