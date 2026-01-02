'use client';

// Changed to relative path which is safer from 'app' directory
import { CartProvider } from '../context/CartContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
    </CartProvider>
  );
}