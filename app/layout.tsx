import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Providers } from "./providers";
import CartSidebar from "@/components/CartSidebar";

<Script src="https://checkout.razorpay.com/v1/checkout.js" />

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BLAYZEX | Dominate Your Ambition",
  description: "High-performance luxury aesthetic wear. Engineered for the 1%.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-stone-950 text-stone-100`}
      >
        <Providers>
          <Navbar />
          <CartSidebar />
          {children}
        </Providers>
      </body>
    </html>
  );
}