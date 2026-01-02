'use client';

// USING RELATIVE PATH TO FIX BUILD ERROR
import { CartProvider } from '../context/CartContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
    </CartProvider>
  );
}