'use client';

import { CartProvider, useCart } from '../context/CartContext'; 
import { useEffect } from 'react';
import Lenis from 'lenis';
import CheckoutModal from '@/components/CheckoutModal';

// Separate component to use the hook inside the provider
function ModalManager() {
    const { isCheckoutOpen, closeCheckout } = useCart();
    return <CheckoutModal isOpen={isCheckoutOpen} onClose={closeCheckout} />;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical', 
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <CartProvider>
      {children}
      <ModalManager />
    </CartProvider>
  );
}