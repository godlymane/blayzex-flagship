'use client';

import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Star, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import Image from 'next/image';

interface Variant {
  size: string;
  id: string;
}

interface Product {
  id: string;
  name: string;
  price: string;
  category: string;
  image: string;
  tag: string;
  description: string;
  variants: Variant[];
}

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const { addItemToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (product) {
        if (product.variants && product.variants.length > 0) {
            setSelectedSize(product.variants[0].size);
        }
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!product || !selectedSize) return;
    
    setIsAdding(true);
    setTimeout(() => {
        addItemToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            size: selectedSize,
        });
        setIsAdding(false);
        onClose();
    }, 500);
  };

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!product) return null;

  return (
    <AnimatePresence>
      {product && (
        <div className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center isolate">
          
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="
                relative w-full max-w-5xl bg-zinc-950 text-white shadow-2xl
                flex flex-col sm:flex-row overflow-hidden
                h-[100dvh] sm:h-auto sm:max-h-[85vh] 
                sm:rounded-xl border border-zinc-800
            "
          >
            
            {/* Close Button - Optimized for Thumb Reach */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 z-50 p-2.5 bg-black/60 backdrop-blur-xl rounded-full border border-white/10 text-white hover:bg-white hover:text-black transition-all active:scale-90 shadow-lg"
            >
              <X size={22} />
            </button>

            {/* --- VISUALS --- */}
            <div className="w-full h-[40dvh] sm:h-[550px] sm:w-[55%] bg-zinc-900 relative shrink-0">
              <div className="absolute top-6 left-6 z-10 flex gap-2">
                <span className="bg-red-600 text-white text-[10px] font-bold px-3 py-1 tracking-widest uppercase shadow-lg shadow-red-900/20">
                  {product.category}
                </span>
                <span className="bg-black/50 backdrop-blur text-white text-[10px] font-bold px-3 py-1 tracking-widest uppercase border border-white/10">
                  {product.tag}
                </span>
              </div>

              {/* Image Container - Using object-fit: cover for perfect mobile fit */}
              <div className="relative w-full h-full">
                <Image 
                    src={product.image} 
                    alt={product.name} 
                    fill
                    className="object-cover object-center"
                    priority
                />
                {/* Gradient Overlay for Text Readability if needed, but keeping it clean for now */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent sm:bg-gradient-to-b sm:from-transparent sm:to-zinc-950/20 pointer-events-none" />
              </div>
            </div>

            {/* --- CONTENT --- */}
            <div className="w-full h-[60dvh] sm:h-auto sm:w-[45%] flex flex-col bg-zinc-950 border-l border-zinc-800 relative">
              
              {/* Scrollable Details */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-8 pb-32 sm:pb-8 custom-scrollbar">
                <div className="flex items-center gap-2 mb-2 text-zinc-500 text-xs font-mono tracking-[0.2em] uppercase">
                  <Zap size={12} className="text-red-500" />
                  BLAYZEX // {product.id.split('-')[1]?.toUpperCase() || 'CORE'}
                </div>

                <h1 className="text-2xl sm:text-4xl font-black text-white uppercase italic leading-none mb-3">
                    {product.name}
                </h1>

                <div className="flex items-center gap-4 mb-6">
                  <span className="text-xl sm:text-2xl font-bold text-red-500 font-mono">{product.price}</span>
                  <div className="h-4 w-px bg-zinc-800"></div>
                  <div className="flex items-center gap-1 text-sm text-zinc-400">
                    <Star size={14} className="fill-zinc-400" />
                    <span>5.0</span>
                  </div>
                </div>

                <p className="text-zinc-400 text-sm leading-relaxed mb-8 border-l-2 border-red-600 pl-4">
                    {product.description}
                </p>

                {/* Variant Selector - Bigger Touch Targets */}
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-3">
                       <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Select Size</label>
                    </div>
                    <div className="grid grid-cols-4 gap-3 sm:gap-2">
                      {product.variants.map((variant, idx) => (
                        <button 
                            key={`${variant.id}-${idx}`} 
                            onClick={() => setSelectedSize(variant.size)} 
                            className={`
                                py-4 sm:py-3 text-sm font-bold border transition-all relative overflow-hidden group rounded-sm
                                ${selectedSize === variant.size 
                                    ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)] scale-[1.02]' 
                                    : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-600 active:bg-zinc-800'
                                }
                            `}
                        >
                          <span className="relative z-10">{variant.size}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sticky Bottom Action Bar */}
              <div className="absolute bottom-0 left-0 right-0 bg-[#09090b] border-t border-white/10 p-4 sm:p-6 z-30 pb-safe">
                <button 
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className="w-full bg-red-600 text-white h-14 font-bold uppercase tracking-widest hover:bg-red-500 active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(220,38,38,0.4)] disabled:opacity-70 disabled:cursor-wait rounded-sm"
                >
                    {isAdding ? (
                        <>PROCESSING...</>
                    ) : (
                        <>
                            <ShoppingBag size={18} />
                            <span>Add to Loadout</span>
                        </>
                    )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}