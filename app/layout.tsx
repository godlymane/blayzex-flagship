import type { Metadata } from "next";
import { Oswald, Inter } from "next/font/google";
import "./globals.css";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BLAYZEX | For The 1%",
  description: "Engineered for the war. Premium gym wear for the 1% who never give up.",
  icons: {
    icon: '/icon.png', // We will set this up later, but this preps the code
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${oswald.variable} ${inter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
