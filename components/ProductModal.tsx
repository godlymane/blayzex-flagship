'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, ShieldCheck, Zap, ArrowRight, Ruler, Fingerprint } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext'; 
import { Product } from '@/types'; 

export default function ProductModal({ product, onClose }: { product: Product | null, onClose: () => void }) {
  const { addItemToCart } = useCart(); 
  const [selectedSize, setSelectedSize] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const scrollPositionRef = useRef(0);

  // --- ROBUST SCROLL LOCK & NAVBAR SIGNAL ---
  useEffect(() => {
    if (product) {
      // 1. Signal Navbar to Hide
      window.dispatchEvent(new Event('modal-open'));

      // 2. Lock Scroll
      scrollPositionRef.current = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPositionRef.current}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      // 3. Signal Navbar to Show
      window.dispatchEvent(new Event('modal-close'));

      // 4. Restore Scroll
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
      window.scrollTo(0, scrollPositionRef.current);
    }
    
    return () => {
      // Cleanup: Always show navbar if component unmounts unexpectedly
      window.dispatchEvent(new Event('modal-close'));
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [product]);

  if (!product) return null;

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("SELECT SIZE PROTOCOL");
      return;
    }
    setIsAdding(true);
    setTimeout(() => {
      addItemToCart({ ...product, size: selectedSize });
      setIsAdding(false);
      onClose();
      setSelectedSize(""); 
    }, 600);
  };

  return (
    <AnimatePresence>
      {product && (
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            // Z-Index higher than everything
            className="fixed inset-0 z-[99999] flex items-end md:items-center justify-center bg-black/95 backdrop-blur-3xl"
        >
            {/* CLICK OUTSIDE */}
            <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>

            <motion.div 
                initial={{ y: "100%" }} 
                animate={{ y: 0 }} 
                exit={{ y: "100%" }}
                transition={{ duration: 0.5, type: "spring", damping: 30, stiffness: 300 }} 
                className="relative w-full h-[100dvh] md:h-auto md:max-h-[90vh] md:max-w-6xl bg-[#050505] md:border border-white/10 shadow-[0_0_100px_rgba(0,0,0,1)] flex flex-col md:flex-row overflow-hidden md:rounded-3xl z-20"
                onClick={(e) => e.stopPropagation()}
            >
                {/* --- FLOATING CLOSE BUTTON --- */}
                <button 
                    onClick={onClose} 
                    className="absolute top-6 right-6 z-[60] w-12 h-12 flex items-center justify-center rounded-full bg-black/50 text-white border border-white/10 hover:bg-red-600 hover:border-red-600 transition-all backdrop-blur-md shadow-2xl group"
                >
                    <X size={24} className="group-hover:rotate-90 transition-transform" />
                </button>

                {/* --- IMAGE ASSET SIDE --- */}
                <div className="w-full md:w-1/2 h-[45vh] md:h-auto bg-zinc-900 relative shrink-0">
                     <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover" 
                    />
                    {/* Image Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-90 md:hidden"></div>
                    
                    <div className="absolute bottom-6 left-6 z-10 flex flex-col gap-2">
                         <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest bg-black/60 backdrop-blur-md px-2 py-1 w-fit border border-white/5 rounded-sm">
                            Asset ID: {product.id.slice(0, 4).toUpperCase()}
                        </span>
                        <span className="bg-red-600 text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest border border-red-500 shadow-lg w-fit rounded-sm">
                            {product.tag}
                        </span>
                    </div>
                </div>

                {/* --- DATA SCHEMATIC SIDE --- */}
                <div className="flex flex-col flex-1 bg-[#050505] relative overflow-hidden h-full">
                    
                    {/* TACTICAL GRID BACKGROUND */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

                    {/* Inner Scroll Container */}
                    <div className="flex-1 overflow-y-auto p-6 pb-32 md:p-12 md:pb-12 custom-scrollbar relative z-10">
                        
                        {/* Status Header */}
                        <div className="mb-4 flex items-center justify-between border-b border-white/5 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]"></div>
                                <span className="text-[9px] uppercase tracking-[0.2em] text-zinc-400 font-mono">Status: Available</span>
                            </div>
                            <Fingerprint size={16} className="text-zinc-600 opacity-50"/>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-white leading-[0.9] mb-3">
                            {product.name}
                        </h2>
                        
                        <div className="flex items-baseline gap-4 mb-8">
                            <p className="text-3xl font-bold text-transparent stroke-text font-mono">{product.price}</p>
                            <span className="text-[10px] text-zinc-600 font-mono uppercase tracking-widest">Global Currency</span>
                        </div>
                        
                        <p className="text-zinc-400 text-xs md:text-sm leading-relaxed font-mono uppercase tracking-wide mb-10 border-l-2 border-zinc-800 pl-4 py-2">
                            {product.description}
                        </p>

                        {/* Size Matrix */}
                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between items-end">
                                <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Configuration (Size)</span>
                                <button className="flex items-center gap-1 text-[9px] text-zinc-500 uppercase tracking-wider hover:text-white transition-colors border-b border-zinc-800 hover:border-white pb-0.5">
                                    <Ruler size={10} /> Calibrate Fit
                                </button>
                            </div>
                            
                            <div className="grid grid-cols-4 gap-2">
                                {product.variants.map((variant) => (
                                    <button
                                        key={variant.id}
                                        onClick={() => setSelectedSize(variant.size)}
                                        className={`
                                            h-12 relative flex flex-col items-center justify-center border transition-all duration-200 overflow-hidden group rounded-sm
                                            ${selectedSize === variant.size 
                                            ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.15)]' 
                                            : 'bg-zinc-900/30 text-zinc-500 border-zinc-800 hover:border-zinc-500 hover:text-white'
                                            }
                                        `}
                                    >
                                        <span className="relative z-10 text-sm font-bold">{variant.size}</span>
                                        {/* Hover Glint */}
                                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Trust Module */}
                        <div className="grid grid-cols-2 gap-px bg-white/5 border border-white/5 rounded-sm overflow-hidden">
                             <div className="bg-[#0a0a0a] p-3 flex flex-col items-center justify-center gap-1 text-zinc-500">
                                 <ShieldCheck size={14} />
                                 <span className="text-[8px] uppercase tracking-wider text-center">Encrypted</span>
                             </div>
                             <div className="bg-[#0a0a0a] p-3 flex flex-col items-center justify-center gap-1 text-zinc-500">
                                 <Zap size={14} />
                                 <span className="text-[8px] uppercase tracking-wider text-center">Fast Dispatch</span>
                             </div>
                        </div>
                    </div>

                    {/* --- FIXED BOTTOM COMMAND DECK --- */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-[#050505]/95 backdrop-blur-xl border-t border-white/10 z-30 pb-safe md:relative md:p-8 md:border-t-0 md:bg-transparent">
                        <button
                            onClick={handleAddToCart}
                            disabled={isAdding}
                            className={`
                                w-full h-14 text-xs font-black uppercase tracking-[0.3em] transition-all relative overflow-hidden group border rounded-sm
                                flex items-center justify-center gap-3 clip-path-slant
                                ${isAdding 
                                ? 'bg-zinc-800 border-zinc-800 text-zinc-500 cursor-not-allowed' 
                                : 'bg-red-600 border-red-600 text-white hover:bg-white hover:text-black hover:border-white'
                                }
                            `}
                        >
                            {isAdding ? (
                                <span className="animate-pulse">Processing...</span>
                            ) : (
                                <>
                                    <span className="relative z-10">INITIATE LOADOUT</span>
                                    <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform"/>
                                </>
                            )}
                            {/* Fill Effect */}
                            <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></div>
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}