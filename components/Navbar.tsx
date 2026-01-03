'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ShoppingBag, Menu, X, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  const { toggleCart, cart } = useCart();
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const totalItems = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  return (
    <>
      {/* Responsive Capsule Navigation 
        - Mobile: Slightly wider (95%), closer to top (top-4), flex layout for safety.
        - Desktop: Standard (90%), top-6, grid layout for precision centering.
      */}
      <nav 
        aria-label="Main Navigation"
        className={`
          fixed z-50 
          left-1/2 -translate-x-1/2
          transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
          
          /* Mobile Specifics */
          top-4 w-[95%] px-4 flex justify-between items-center
          
          /* Desktop Specifics */
          md:top-6 md:w-[90%] md:max-w-5xl md:grid md:grid-cols-3 md:px-6 md:justify-items-center

          rounded-full
          ${isScrolled 
            ? 'h-14 bg-black/40 backdrop-blur-2xl backdrop-saturate-200 border border-white/15 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.8)]' 
            : 'h-16 bg-transparent border border-transparent'
          }
        `}
      >
        
        {/* LEFT: MENU TOGGLE */}
        <div className="flex items-center justify-start shrink-0 md:w-full">
          <button 
            className="text-zinc-400 hover:text-white transition-colors active:scale-90 p-2 -ml-2 md:ml-0 hover:bg-white/5 rounded-full"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* CENTER: LOGO */}
        {/* Absolute centering on mobile to ensure it never drifts */}
        <div className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 flex items-center justify-center">
            <Link href="/" className="group flex items-center justify-center" aria-label="Home">
                <span className="text-lg md:text-2xl font-black tracking-tighter uppercase italic text-white transition-colors duration-300 whitespace-nowrap">
                Blayzex
                <span className="text-red-600 drop-shadow-[0_0_8px_rgba(220,38,38,0.8)] inline-block ml-0.5 animate-pulse">.</span>
                </span>
            </Link>
        </div>

        {/* RIGHT: ACTIONS */}
        <div className="flex items-center justify-end gap-1 md:gap-4 shrink-0 md:w-full">
          <Link 
            href="/admin" 
            className="hidden md:flex items-center justify-center w-9 h-9 rounded-full hover:bg-white/5 text-zinc-400 hover:text-white transition-all" 
            aria-label="Account"
          >
            <User size={18} />
          </Link>
          
          <button 
            onClick={toggleCart} 
            className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/5 text-zinc-400 hover:text-white transition-all group -mr-2 md:mr-0"
            aria-label={`Open Cart (${totalItems} items)`}
          >
            <ShoppingBag size={20} className="group-hover:text-red-500 transition-colors duration-300" />
            
            {isMounted && totalItems > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2 items-center justify-center rounded-full bg-red-600 shadow-[0_0_8px_red] animate-pulse">
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* MOBILE COMMAND MENU OVERLAY */}
      <div 
        className={`
          fixed inset-0 z-40 bg-black/95 backdrop-blur-3xl 
          flex flex-col items-center justify-center gap-8
          transition-all duration-300 ease-in-out
          ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
      >
        <Link 
          href="/admin" 
          className="text-2xl font-black uppercase italic text-zinc-500 hover:text-white transition-colors tracking-tighter"
          onClick={() => setMobileMenuOpen(false)}
        >
          Access Terminal
        </Link>
      </div>
    </>
  );
}