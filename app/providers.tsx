'use client';

// Changed to relative path to fix Vercel build error
import { CartProvider } from '../context/CartContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
    </CartProvider>
  );
}