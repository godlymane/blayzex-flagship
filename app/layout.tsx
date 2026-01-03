import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import CartSidebar from "../components/CartSidebar";
import { Providers } from "./providers";
import Script from "next/script";
import { ToastProvider } from "../context/ToastContext"; // New Import

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
  icons: {
    icon: '/favicon.ico', 
  },
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
        <Script src="https://checkout.razorpay.com/v1/checkout.js" />
        
        {/* Wrap ToastProvider INSIDE or OUTSIDE Providers depending on preference, 
            but usually needs to wrap components using it. 
            Since Providers wraps CartProvider which uses Toast, ToastProvider must be parent or inside Providers. 
            Let's put it inside Providers for cleaner code in this file, or update Providers.tsx.
            Actually, let's update this file to wrap Providers with ToastProvider. 
        */}
        <ToastProvider>
            <Providers>
            <Navbar />
            <CartSidebar />
            {children}
            </Providers>
        </ToastProvider>
      </body>
    </html>
  );
}