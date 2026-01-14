import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Providers from './providers';
import Navbar from '@/components/Navbar';
import CartSidebar from '@/components/CartSidebar';
import CustomCursor from '@/components/CustomCursor';
import { ToastProvider } from '@/context/ToastContext';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'BLAYZEX | The 1%',
  description: 'Exclusive Streetwear for the Elite. Engineered in Silence.',
  openGraph: {
    title: 'BLAYZEX | The 1%',
    description: 'Exclusive Streetwear for the Elite.',
    url: 'https://blayzex.com', // Replace with your actual URL
    siteName: 'BLAYZEX',
    images: [
      {
        url: '/opengraph-image.png', // Add this image to public folder
        width: 1200,
        height: 630,
        alt: 'BLAYZEX - The 1% Standard',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BLAYZEX',
    description: 'Engineered in Silence.',
    creator: '@blayzex',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#000000',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body className="bg-black text-white antialiased overflow-x-hidden w-full max-w-[100vw]">
        <ToastProvider>
          <Providers>
            <CustomCursor />
            <Navbar />
            <CartSidebar />
            <main className="min-h-screen pt-20 relative z-10">
              {children}
            </main>
          </Providers>
        </ToastProvider>
      </body>
    </html>
  );
}