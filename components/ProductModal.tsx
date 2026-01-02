'use client';

import React, { useState } from 'react';
import { X, Check, Ruler } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
// RELATIVE PATH FIX
import { useCart } from '../context/CartContext';

type Variant = {
  size: string;
  id: string;
};

type Product = {
  name: string;
  price: string;
  image: string;
  tag: string;
  description?: string;
  variants: Variant[];
  sizeGuide?: string; 
};

export default function ProductModal({ product, onClose }: { product: Product | null, onClose: () => void }) {
  const { addItemToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  if (!product) return null;

  const handleAddToCart = () => {
    if (!selectedSize) return;
    
    const variant = product.variants.find(v => v.size === selectedSize);
    if (!variant) return;

    addItemToCart({
      id: variant.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: selectedSize
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {product && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-[80]"
          />

          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 m-auto w-full max-w-5xl h-[90vh] md:h-[600px] bg-zinc-950 border border-white/10 shadow-2xl z-[90] flex flex-col md:flex-row overflow-hidden"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 z-50 p-2 bg-black/50 rounded-full text-white hover:bg-white hover:text-black transition-colors"
            >
              <X size={24} />
            </button>

            <div className="relative w-full md:w-1/2 h-1/2 md:h-full bg-zinc-900 group">
              <AnimatePresence mode="wait">
                {showSizeGuide && product.sizeGuide ? (
                  <motion.div 
                    key="size-guide"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="relative w-full h-full bg-white text-black p-4 flex items-center justify-center"
                  >
                    <Image src={product.sizeGuide} alt="Size Guide" fill className="object-contain" />
                  </motion.div>
                ) : (
                  <motion.div 
                    key="product-image"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="relative w-full h-full"
                  >
                    <Image src={product.image} alt={product.name} fill className="object-cover" />
                    <div className="absolute bottom-6 left-6">
                      <span className="bg-red-600 text-white px-4 py-2 text-xs font-bold uppercase tracking-widest">{product.tag}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {product.sizeGuide && (
                <button 
                  onClick={() => setShowSizeGuide(!showSizeGuide)}
                  className="absolute bottom-6 right-6 bg-black/50 backdrop-blur-md text-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest border border-white/20 hover:bg-white hover:text-black hover:border-transparent transition-all flex items-center gap-2 z-20"
                >
                  <Ruler size={14} /> {showSizeGuide ? "View Product" : "Size Guide"}
                </button>
              )}
            </div>

            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-zinc-950">
              <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter mb-2 text-white">{product.name}</h2>
              <p className="text-xl text-red-500 font-light mb-8 font-mono">{product.price}</p>
              
              <p className="text-gray-400 text-sm leading-relaxed mb-8 border-l-2 border-red-600 pl-4">
                {product.description || "Engineered for the elite. This piece combines aerospace-grade durability with high-fashion aesthetics."}
              </p>

              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                   <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Select Size</span>
                   {product.sizeGuide && (
                     <button onClick={() => setShowSizeGuide(!showSizeGuide)} className="md:hidden text-[10px] text-red-500 underline uppercase tracking-widest">
                       {showSizeGuide ? "Close Guide" : "Size Guide"}
                     </button>
                   )}
                </div>
                
                <div className="flex gap-4">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.size}
                      onClick={() => setSelectedSize(variant.size)}
                      className={`w-12 h-12 flex items-center justify-center border text-sm font-bold transition-all uppercase ${
                        selectedSize === variant.size 
                          ? 'bg-white text-black border-white' 
                          : 'bg-transparent text-gray-500 border-white/20 hover:border-white hover:text-white'
                      }`}
                    >
                      {variant.size}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleAddToCart}
                disabled={!selectedSize}
                className={`w-full py-5 text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 ${
                  selectedSize 
                    ? 'bg-red-600 text-white hover:bg-white hover:text-black cursor-pointer' 
                    : 'bg-zinc-800 text-gray-500 cursor-not-allowed'
                }`}
              >
                {selectedSize ? 'Add to Arsenal' : 'Select a Size'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}