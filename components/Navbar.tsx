'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, User } from 'lucide-react';
import Link from 'next/link';
import { useCart } from "../context/CartContext";


export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toggleCart, cart } = useCart(); 

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-500 border-b ${
        isScrolled 
          ? 'bg-black/50 backdrop-blur-xl backdrop-saturate-150 border-white/10 py-4 shadow-[0_4px_30px_rgba(0,0,0,0.5)]' 
          : 'bg-transparent border-transparent py-8'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white hover:text-red-500 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Links - Left */}
        <div className="hidden md:flex items-center gap-8 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
          <Link href="#" className="hover:text-white hover:glow-text transition-all duration-300">Shop All</Link>
          <Link href="#" className="hover:text-white hover:glow-text transition-all duration-300">New Arrivals</Link>
        </div>

        {/* Center: BRAND TEXT (Clean Luxury) */}
        <Link href="/" className="absolute left-1/2 -translate-x-1/2 group">
           <span className="text-2xl md:text-3xl font-black tracking-tighter uppercase italic text-white group-hover:text-red-500 transition-colors duration-300">
             Blayzex<span className="text-red-600 group-hover:text-white transition-colors duration-300">.</span>
           </span>
        </Link>

        {/* Right: Icons */}
        <div className="flex items-center gap-6">
          <button className="hidden md:block text-gray-400 hover:text-white transition-colors">
            <User size={20} />
          </button>
          
          <button onClick={toggleCart} className="relative text-white group">
            <ShoppingBag size={20} className="group-hover:text-red-500 transition-colors duration-300" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-red-600 text-[8px] font-bold animate-pulse">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-black/95 backdrop-blur-xl border-t border-white/10 p-6 flex flex-col gap-8 md:hidden h-screen z-40">
          <Link href="#" className="text-3xl font-black uppercase italic text-white hover:text-red-600 tracking-tighter">Shop All</Link>
          <Link href="#" className="text-3xl font-black uppercase italic text-white hover:text-red-600 tracking-tighter">New Arrivals</Link>
          <Link href="#" className="text-xl font-mono uppercase text-gray-500 mt-auto">Account Login</Link>
        </div>
      )}
    </nav>
  );
}