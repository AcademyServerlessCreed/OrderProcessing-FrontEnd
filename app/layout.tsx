"use client";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import ConfigureAmplifyClientSide from "@/ConfigureAmplifyClientSide";
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from "@/context/CartContext";
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <CartProvider>
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          <ConfigureAmplifyClientSide />
          <main>{children}</main>
          <Toaster />
        </body>
      </CartProvider>
    </html>
  );
}
