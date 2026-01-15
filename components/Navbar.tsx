'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ShoppingBag, Menu, X, Globe, Shield } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion'; 
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const { toggleCart, cart } = useCart();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Menu Toggle Logic
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen]);

  // Listen for Modal Signals
  useEffect(() => {
    const handleModalOpen = () => setIsHidden(true);
    const handleModalClose = () => setIsHidden(false);
    window.addEventListener('modal-open', handleModalOpen);
    window.addEventListener('modal-close', handleModalClose);
    return () => {
      window.removeEventListener('modal-open', handleModalOpen);
      window.removeEventListener('modal-close', handleModalClose);
    };
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const totalItems = useMemo(() => cart.reduce((acc, item) => acc + item.quantity, 0), [cart]);

  const handleManifestoClick = () => {
    setMobileMenuOpen(false);
    const manifestoSection = document.getElementById('manifesto');
    if (manifestoSection) {
      manifestoSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const shouldHide = isHidden && !mobileMenuOpen;

  return (
    <>
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ 
            y: shouldHide ? -100 : 0, 
            opacity: shouldHide ? 0 : 1,
            width: isScrolled ? "90%" : "95%", 
        }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        // HYPER GLASS STYLE
        className={`fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-[60] h-16 md:h-20 rounded-full flex items-center transition-all duration-500 max-w-5xl
            ${isScrolled || mobileMenuOpen
                ? 'bg-white/5 backdrop-blur-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]' 
                : 'bg-transparent border border-transparent'
            }
        `}
      >
        <div className="w-full h-full px-6 flex justify-between items-center relative">
          
          {/* LEFT: COMMAND */}
          <div className="flex items-center gap-4 w-1/3">
             <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="group flex items-center gap-3 text-white focus:outline-none"
             >
                <div className="relative w-10 h-10 border border-white/10 rounded-full flex items-center justify-center overflow-hidden group-hover:border-red-600 transition-all bg-white/5 backdrop-blur-md active:scale-95">
                    <AnimatePresence mode="wait">
                        {mobileMenuOpen ? (
                            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                                <X size={18} />
                            </motion.div>
                        ) : (
                            <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                                <Menu size={18} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                <span className="hidden md:flex items-center gap-2 text-[9px] font-mono text-zinc-400 uppercase tracking-widest group-hover:text-white transition-colors">
                     <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                     CMD
                </span>
             </button>
          </div>

          {/* CENTER: IDENTITY */}
          <div className="flex justify-center w-1/3">
            <Link href="/" className="group relative flex flex-col items-center">
              <span className="text-2xl md:text-3xl font-black italic tracking-tighter uppercase text-white z-10 relative transition-all duration-300 group-hover:opacity-0">
                Blayzex
              </span>
              <span className="absolute inset-0 text-2xl md:text-3xl font-black italic tracking-tighter uppercase text-red-600 opacity-0 group-hover:opacity-100 transition-all duration-100 blur-[2px] select-none pointer-events-none">
                Blayzex
              </span>
              <span className="absolute inset-0 text-2xl md:text-3xl font-black italic tracking-tighter uppercase text-white opacity-0 group-hover:opacity-100 transition-all duration-100 translate-x-[1px] translate-y-[-1px] select-none pointer-events-none mix-blend-overlay">
                Blayzex
              </span>
            </Link>
          </div>

          {/* RIGHT: LOADOUT */}
          <div className="flex justify-end items-center gap-6 w-1/3">
            <button 
              onClick={toggleCart} 
              className="relative group text-white focus:outline-none flex items-center gap-3"
            >
              <div className="relative w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center group-hover:bg-red-600 group-hover:border-red-600 group-hover:text-black transition-all duration-300 shadow-sm active:scale-95 backdrop-blur-md">
                <ShoppingBag size={18} />
                {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[9px] font-black text-black border border-black shadow-lg">
                        {totalItems}
                    </span>
                )}
              </div>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* FULL SCREEN MENU OVERLAY */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[50] bg-black/95 backdrop-blur-2xl flex flex-col"
          >
             {/* REDUNDANT CLOSE BUTTON (Top Right) */}
             <button 
                onClick={() => setMobileMenuOpen(false)}
                className="absolute top-6 right-6 z-[70] w-12 h-12 flex md:hidden items-center justify-center rounded-full bg-white/10 border border-white/10 text-white active:scale-90 transition-transform backdrop-blur-md"
             >
                 <X size={24} />
             </button>

             {/* Background Noise */}
             <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
                 <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
             </div>
             
             {/* Content Container - REFINED TYPOGRAPHY */}
             <div className="relative z-10 flex flex-col justify-center items-center h-full gap-6 p-6">
                {['Shop All', 'New Arrivals'].map((item, i) => (
                    <motion.div
                        key={item}
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 + i * 0.1, duration: 0.4, ease: "easeOut" }}
                    >
                        <Link 
                            href="#" 
                            // SCALED DOWN TEXT FOR CLEANER LOOK
                            className="block text-3xl md:text-5xl font-bold uppercase tracking-[0.1em] text-transparent stroke-text hover:text-white hover:stroke-0 transition-all duration-300 hover:scale-105 active:scale-95"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {item}
                        </Link>
                    </motion.div>
                ))}
                
                {/* READ MANIFESTO */}
                 <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.4, ease: "easeOut" }}
                >
                    <button 
                        onClick={handleManifestoClick}
                        className="block text-3xl md:text-5xl font-bold uppercase tracking-[0.1em] text-white transition-all duration-300 hover:text-red-600 hover:scale-105 active:scale-95"
                    >
                        Read Manifesto
                    </button>
                </motion.div>

                {/* Account Links */}
                 {['Account', 'Support'].map((item, i) => (
                    <motion.div
                        key={item}
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 + i * 0.1, duration: 0.4, ease: "easeOut" }}
                    >
                         <Link 
                            href="#" 
                            className="block text-3xl md:text-5xl font-bold uppercase tracking-[0.1em] text-transparent stroke-text hover:text-white hover:stroke-0 transition-all duration-300 hover:scale-105 active:scale-95"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {item}
                        </Link>
                    </motion.div>
                ))}

             </div>

             {/* Menu Footer */}
             <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="relative z-10 p-8 border-t border-white/5 flex justify-between items-end bg-black/20 backdrop-blur-md w-full"
             >
                <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">System Status</span>
                    <span className="text-[10px] font-mono text-green-500 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                        Optimal
                    </span>
                </div>
                <div className="flex gap-4">
                    {['IG', 'TW', 'YT'].map(social => (
                        <a key={social} href="#" className="w-8 h-8 border border-white/10 rounded-full flex items-center justify-center text-[9px] font-bold hover:bg-white hover:text-black hover:border-white transition-all">
                            {social}
                        </a>
                    ))}
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}