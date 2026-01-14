'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import ProductModal from '@/components/ProductModal';
import ProductCard from '@/components/ProductCard';
import Preloader from '@/components/Preloader';
import MagneticButton from '@/components/MagneticButton';
import Footer from '@/components/Footer'; 
import AccessGate from '@/components/AccessGate'; 
import { PRODUCTS, CATEGORIES } from '@/lib/data';
import { Product } from '@/types';
import { ArrowDown, Star } from 'lucide-react';

// Decrypting Text Component
const DecryptText = ({ text, className }: { text: string, className?: string }) => {
  const [displayText, setDisplayText] = useState("");
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";

  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((letter, index) => {
            if (index < iteration) return text[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iteration >= text.length) clearInterval(interval);
      iteration += 1 / 3;
    }, 30);
    return () => clearInterval(interval);
  }, [text]);

  return <span className={className}>{displayText}</span>;
};

// Infinite Marquee Component
const Marquee = () => {
  return (
    <div className="relative flex overflow-hidden py-4 md:py-6 bg-red-600 text-black border-y border-red-500 select-none">
      <motion.div 
        className="flex gap-12 whitespace-nowrap"
        animate={{ x: [0, -1000] }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
      >
        {[...Array(8)].map((_, i) => (
           <div key={i} className="flex items-center gap-8 text-sm md:text-lg font-black uppercase italic tracking-widest">
              <span>System Operational</span>
              <Star size={12} fill="black" />
              <span>Global Dispatch</span>
              <Star size={12} fill="black" />
              <span>The 1% Standard</span>
              <Star size={12} fill="black" />
           </div>
        ))}
      </motion.div>
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-red-600 to-transparent z-10"></div>
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-red-600 to-transparent z-10"></div>
    </div>
  );
};

// --- ISOLATED MAIN CONTENT COMPONENT ---
function MainSiteContent() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  
  // Video Loading States
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [manifestoLoaded, setManifestoLoaded] = useState(false);
  
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  
  const heroTextY = useTransform(scrollYProgress, [0, 0.2], ["0%", "50%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const filteredProducts = activeCategory === "All" 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-red-600 selection:text-white w-full overflow-x-hidden" ref={containerRef}>
      
      <Preloader />
      <div className="noise-overlay"></div>
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />

      {/* --- HERO SECTION --- */}
      <section className="relative h-[100dvh] w-full overflow-hidden flex flex-col items-center justify-center border-b border-white/5 bg-[#050505]">
        
        {/* Background Layer with Buffering Indicator */}
        <div className="absolute inset-0 z-0 bg-[#050505]">
            {!heroLoaded && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                    {/* Minimalist Spinner */}
                    <div className="w-8 h-8 border-2 border-white/10 border-t-red-600 rounded-full animate-spin backdrop-blur-md"></div>
                </div>
            )}
            
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: heroLoaded ? 0.6 : 0 }}
                transition={{ duration: 1.5 }}
                className="w-full h-full"
            >
              <video 
                autoPlay 
                loop 
                muted 
                playsInline
                preload="auto"
                onLoadedData={() => setHeroLoaded(true)}
                className="w-full h-full object-cover scale-105"
                poster="/logo.png" // Fallback image if video fails entirely
              >
                {/* Mobile Optimized Source (Vertical/Smaller) */}
                <source src="/hero-mobile.mp4" type="video/mp4" media="(max-width: 768px)" />
                {/* Desktop High-Res Source */}
                <source src="/hero.mp4" type="video/mp4" />
              </video>
            </motion.div>
        </div>

        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60 z-20"></div>
        <div className="absolute inset-0 bg-black/20 z-10"></div>

        <motion.div 
            style={{ y: heroTextY, opacity: heroOpacity }}
            className="relative z-30 text-center px-4 w-full max-w-7xl mx-auto flex flex-col items-center"
        >
            <h1 className="text-[13vw] md:text-[14vw] leading-[0.8] font-black uppercase italic tracking-tighter text-white mb-6 mix-blend-difference select-none">
                <DecryptText text="BLAYZEX" />
                <span className="text-red-600 inline-block">.</span>
            </h1>
            
            <div className="flex flex-col items-center gap-8">
              <p className="text-[10px] md:text-xs text-zinc-300 font-mono uppercase tracking-[0.3em] md:tracking-[0.4em] border-l border-red-600 pl-4 bg-black/40 backdrop-blur-md p-2">
                  Engineered for the 1% // Est. 2026
              </p>
              
              <MagneticButton strength={40}>
                  <button 
                      onClick={() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })}
                      className="mt-8 md:mt-12 group flex flex-col items-center gap-4 text-xs font-bold uppercase tracking-widest text-white hover:text-red-600 transition-colors cursor-pointer"
                  >
                      <span>Initiate</span>
                      <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:border-red-600 transition-colors bg-white/5 backdrop-blur-md">
                        <ArrowDown size={18} className="group-hover:translate-y-1 transition-transform" />
                      </div>
                  </button>
              </MagneticButton>
            </div>
        </motion.div>
      </section>

      {/* --- MARQUEE --- */}
      <section className="relative z-20 bg-black">
        <Marquee />
      </section>

      {/* --- SHOP SECTION --- */}
      <section id="shop" className="py-24 md:py-32 px-4 md:px-8 max-w-[1920px] mx-auto min-h-screen bg-black relative z-10 w-full">
        
        <div className="flex flex-col lg:flex-row justify-between items-end mb-16 md:mb-24 border-b border-white/10 pb-6 sticky top-16 md:top-20 z-30 bg-black/90 backdrop-blur-xl pt-4 w-full transition-all">
            <h2 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter text-white mb-8 lg:mb-0 leading-[0.8]">
              The <span className="text-transparent stroke-text">Drop</span>
            </h2>
            
            <div className="w-full lg:w-auto overflow-x-auto scrollbar-hide pb-2" style={{ overscrollBehaviorX: 'contain' }}>
                <div className="flex gap-2 p-1.5 bg-zinc-900/80 rounded-full border border-white/5 backdrop-blur-md min-w-max shadow-2xl">
                    {CATEGORIES.map((cat) => {
                        const isActive = activeCategory === cat;
                        return (
                            <button 
                                key={cat} 
                                onClick={() => setActiveCategory(cat)}
                                className={`
                                  relative px-6 py-2 md:px-8 md:py-3 rounded-full text-[10px] font-black uppercase tracking-[0.15em] transition-all z-10
                                  ${isActive ? "text-black scale-105" : "text-zinc-500 hover:text-white"}
                                `}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeCategory"
                                        className="absolute inset-0 bg-white rounded-full z-[-1] shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                {cat}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>

        <AnimatePresence mode="wait">
            <motion.div 
                key={activeCategory}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-16 md:gap-y-24 md:gap-x-12 w-full"
            >
                {filteredProducts.map((product) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      onClick={() => setSelectedProduct(product)} 
                    />
                ))}
            </motion.div>
        </AnimatePresence>
      </section>

      {/* --- MANIFESTO --- */}
      <section id="manifesto" className="relative w-full py-32 md:py-48 overflow-hidden border-t border-white/10 bg-[#050505]">
        
        <div className="absolute inset-0 z-0 bg-[#050505]">
            {!manifestoLoaded && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="w-8 h-8 border-2 border-white/10 border-t-red-600 rounded-full animate-spin backdrop-blur-md"></div>
                </div>
            )}

            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: manifestoLoaded ? 0.3 : 0 }}
                transition={{ duration: 1 }}
                className="w-full h-full"
            >
              <video 
                autoPlay 
                loop 
                muted 
                playsInline
                preload="auto"
                onLoadedData={() => setManifestoLoaded(true)}
                className="w-full h-full object-cover grayscale"
              >
                <source src="/athletes-mobile.mp4" type="video/mp4" media="(max-width: 768px)" />
                <source src="/athletes.mp4" type="video/mp4" />
              </video>
            </motion.div>
        </div>
        
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] z-10"></div>

        <div className="relative z-20 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center w-full">
            <div className="order-2 md:order-1">
              <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
              >
                <h3 className="text-red-600 font-mono text-xs uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                  <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse shadow-[0_0_10px_red]"></span>
                  Manifesto Protocol
                </h3>
                <p className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter leading-[0.9] mb-8">
                    We don't build for the masses. <br/>
                    We build for the <span className="text-transparent stroke-text">obsessed</span>.
                </p>
                <div className="border-l-2 border-red-600 pl-6 space-y-4">
                    <p className="text-zinc-300 font-mono text-xs md:text-sm leading-relaxed max-w-md">
                        Blayzex isn't just fabric; it's a statement of intent. Designed for those who clock in when the world sleeps. 
                    </p>
                </div>
              </motion.div>
            </div>

            <div className="flex justify-end order-1 md:order-2">
              <MagneticButton strength={20}>
                <div className="relative w-full md:w-[450px] aspect-[9/16] border border-white/10 bg-zinc-900 group cursor-pointer overflow-hidden rounded-sm shadow-2xl">
                    <video 
                      autoPlay 
                      loop 
                      muted 
                      playsInline
                      preload="auto"
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                    >
                      <source src="/athletes.mp4" type="video/mp4" />
                    </video>
                    <div className="absolute bottom-6 left-6 bg-black/60 backdrop-blur-md px-4 py-2 border border-white/10 flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <p className="text-[8px] font-black uppercase text-white tracking-widest">Live Feed // Athlete Corps</p>
                    </div>
                </div>
              </MagneticButton>
            </div>
        </div>
      </section>

      {/* --- FOOTER COMPONENT --- */}
      <Footer />
      
    </div>
  );
}

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <>
      <AccessGate onUnlock={() => setIsAuthenticated(true)} />
      {isAuthenticated && <MainSiteContent />}
    </>
  );
}