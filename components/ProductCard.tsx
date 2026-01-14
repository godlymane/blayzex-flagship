'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Product } from '@/types';
import { ArrowUpRight } from 'lucide-react';

export default function ProductCard({ product, onClick }: { product: Product, onClick: () => void }) {
  return (
    <motion.div 
      layout
      className="group cursor-pointer relative"
      onClick={onClick}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      {/* Image Container with Technical Markers */}
      <div className="relative aspect-[3/4] overflow-hidden bg-zinc-900 mb-6 border border-white/5">
        
        {/* Technical Frame - Desktop Only */}
        <div className="hidden md:block absolute inset-0 z-20 border border-white/0 group-hover:border-white/20 transition-colors duration-500 pointer-events-none">
            {/* Corner Markers */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/0 group-hover:border-white transition-all duration-500"></div>
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/0 group-hover:border-white transition-all duration-500"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/0 group-hover:border-white transition-all duration-500"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/0 group-hover:border-white transition-all duration-500"></div>
        </div>

        {/* Main Image - FULL COLOR ON MOBILE, Grayscale on Desktop */}
        <Image 
          src={product.image} 
          alt={product.name} 
          fill 
          className="object-cover transition-all duration-700 md:group-hover:scale-105 grayscale-0 md:grayscale md:group-hover:grayscale-0 contrast-125" 
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        
        {/* Tag Overlay */}
        <div className="absolute top-0 left-0 p-3 z-20">
          <span className="bg-red-600 text-white px-2 py-1 text-[8px] font-black uppercase tracking-widest shadow-lg">
            {product.tag}
          </span>
        </div>

        {/* Hover Action - Desktop Only */}
        <div className="hidden md:flex absolute inset-0 z-10 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-[2px]">
            <div className="bg-white text-black rounded-full p-4 transform scale-50 group-hover:scale-100 transition-transform duration-300">
                <ArrowUpRight size={20} strokeWidth={2.5} />
            </div>
        </div>
      </div>

      {/* Editorial Details */}
      <div className="space-y-1 px-1">
        <div className="flex justify-between items-start border-t border-white/10 pt-3 md:group-hover:border-red-600/50 transition-colors">
            <h3 className="text-xs md:text-sm font-bold uppercase text-white tracking-wider max-w-[70%] leading-tight md:group-hover:text-red-500 transition-colors">
                {product.name}
            </h3>
            <span className="text-xs font-mono text-zinc-300 md:text-zinc-400 md:group-hover:text-white transition-colors font-bold">
                {product.price}
            </span>
        </div>
        <p className="text-[9px] text-zinc-500 font-mono uppercase tracking-[0.2em]">
            // {product.category}
        </p>
      </div>
    </motion.div>
  );
}