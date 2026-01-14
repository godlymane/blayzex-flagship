'use client';

import React, { useEffect, useState } from 'react';
import { Home, ShoppingBag, Grid, User } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function MobileNav() {
  const { toggleCart, cart, isCartOpen } = useCart(); // Added isCartOpen
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
        setLastScrollY(window.scrollY);
      }
    };

    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY]);

  // HIDE IF: 1. In Admin, 2. In Desktop (hidden md:flex), 3. CART IS OPEN
  if (pathname.startsWith('/admin') || isCartOpen) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-[90] bg-black/90 backdrop-blur-xl border-t border-white/10 px-6 py-4 md:hidden pb-safe"
        >
          <div className="flex justify-between items-center">
            <Link href="/" className="flex flex-col items-center gap-1 text-zinc-500 hover:text-white">
              <Home size={20} />
              <span className="text-[9px] font-bold uppercase tracking-widest">HQ</span>
            </Link>

            <Link href="/#the-drop" className="flex flex-col items-center gap-1 text-zinc-500 hover:text-white">
              <Grid size={20} />
              <span className="text-[9px] font-bold uppercase tracking-widest">Shop</span>
            </Link>

            <button 
                onClick={toggleCart}
                className="relative -top-6 bg-red-600 text-white p-4 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.5)] border-4 border-black active:scale-90 transition-transform"
            >
              <ShoppingBag size={22} fill="currentColor" />
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 bg-white text-red-600 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cart.length}
                </span>
              )}
            </button>

            <Link href="/admin" className="flex flex-col items-center gap-1 text-zinc-500 hover:text-white">
              <User size={20} />
              <span className="text-[9px] font-bold uppercase tracking-widest">Ops</span>
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}