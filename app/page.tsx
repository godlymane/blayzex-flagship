'use client';

import React, { useState, useEffect } from 'react';
import { ArrowRight, Lock, Crown, Crosshair, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import ProductModal from '@/components/ProductModal';

// --- LAUNCH INVENTORY CONFIGURATION ---
const PRODUCTS = [
  // --- TEES & TANKS ---
  {
    id: "pump-cover-phantom",
    name: "Phantom Pump Cover",
    price: "₹2,899",
    category: "Tees",
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1200&auto=format&fit=crop", 
    tag: "240GSM French Terry",
    description: "The ultimate pump cover. Constructed from 240GSM French Terry for a heavy drape that hides the frame until the pump is ready.",
    variants: [
      { size: "S", id: "4001" }, { size: "M", id: "4002" }, { size: "L", id: "4003" }, { size: "XL", id: "4004" }
    ]
  },
  {
    id: "oversized-tank-core",
    name: "Core Heavy Tank",
    price: "₹2,499",
    category: "Tanks",
    image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?q=80&w=1200&auto=format&fit=crop",
    tag: "Raw Cut",
    description: "Oversized silhouette with raw-cut armholes. 240GSM French Terry fabric that breathes while maintaining structure.",
    variants: [
      { size: "S", id: "4005" }, { size: "M", id: "4006" }, { size: "L", id: "4007" }, { size: "XL", id: "4008" }
    ]
  },

  // --- HOODIES & SWEATS ---
  {
    id: "hoodie-350-obsidian",
    name: "Obsidian 350 Hoodie",
    price: "₹6,999",
    category: "Hoodies",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1200&auto=format&fit=crop",
    tag: "350GSM Heavyweight",
    description: "The armor you wear daily. 350GSM premium fleece with a double-lined hood for absolute isolation.",
    variants: [
      { size: "S", id: "4009" }, { size: "M", id: "4010" }, { size: "L", id: "4011" }, { size: "XL", id: "4012" }
    ]
  },
  {
    id: "zipper-hoodie-fortress",
    name: "Fortress Zip-Up",
    price: "₹7,499",
    category: "Hoodies",
    image: "https://images.unsplash.com/photo-1647772647479-72f627727a6d?q=80&w=1200&auto=format&fit=crop",
    tag: "Tactical Spec",
    description: "Full metal hardware. 350GSM density. Designed for rapid temperature regulation during warm-ups.",
    variants: [
      { size: "S", id: "4013" }, { size: "M", id: "4014" }, { size: "L", id: "4015" }, { size: "XL", id: "4016" }
    ]
  },
  {
    id: "sweatshirt-kinetic",
    name: "Kinetic Crewneck",
    price: "₹5,999",
    category: "Sweatshirts",
    image: "https://images.unsplash.com/photo-1614975059251-992f11792b9f?q=80&w=1200&auto=format&fit=crop",
    tag: "Clean Structure",
    description: "350GSM loopback cotton. Boxy fit with dropped shoulders. Minimalist aesthetic for the boardroom or the bar.",
    variants: [
      { size: "S", id: "4017" }, { size: "M", id: "4018" }, { size: "L", id: "4019" }, { size: "XL", id: "4020" }
    ]
  },

  // --- BOTTOMS ---
  {
    id: "pants-premium-gauge",
    name: "Gauge Operator Pant",
    price: "₹4,999",
    category: "Pants",
    image: "https://images.unsplash.com/photo-1552160753-117159d453fc?q=80&w=1200&auto=format&fit=crop",
    tag: "Technical Knit",
    description: "Premium gauge fabric that mimics tailored trousers but stretches like performance gear.",
    variants: [
      { size: "S", id: "4021" }, { size: "M", id: "4022" }, { size: "L", id: "4023" }, { size: "XL", id: "4024" }
    ]
  },
  {
    id: "pants-baggy-street",
    name: "Street Heavy Cargo",
    price: "₹5,499",
    category: "Pants",
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1200&auto=format&fit=crop",
    tag: "Oversized Fit",
    description: "Baggy silhouette with structured stacking at the ankle. Heavyweight durability for the streets.",
    variants: [
      { size: "S", id: "4025" }, { size: "M", id: "4026" }, { size: "L", id: "4027" }, { size: "XL", id: "4028" }
    ]
  },
  {
    id: "shorts-terry-drift",
    name: "Drift Terry Short",
    price: "₹2,299",
    category: "Shorts",
    image: "https://images.unsplash.com/photo-1565526316270-349f7e52292f?q=80&w=1200&auto=format&fit=crop",
    tag: "Leg Day Essential",
    description: "240GSM French Terry. Raw hem finish. Deep pockets. The only shorts you need.",
    variants: [
      { size: "S", id: "4029" }, { size: "M", id: "4030" }, { size: "L", id: "4031" }, { size: "XL", id: "4032" }
    ]
  }
];

const CATEGORIES = ["All", "Tees", "Hoodies", "Sweatshirts", "Pants", "Shorts", "Tanks"];

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [manifestoOpen, setManifestoOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  // PRELOADER SEQUENCE
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000); 
    return () => clearTimeout(timer);
  }, []);

  const filteredProducts = activeCategory === "All" 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === activeCategory);

  const enterVault = () => {
    const section = document.getElementById('the-drop');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubscribe = () => {
    if(email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <main className={`min-h-screen bg-black text-white selection:bg-red-600 selection:text-white relative ${loading ? 'overflow-hidden h-screen' : ''}`}>
      
      {/* --- CINEMATIC PRELOADER --- */}
      <AnimatePresence>
        {loading && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
            className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center"
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
              className="relative w-32 h-32 mb-8"
            >
               {/* Ensure logo.png is in public folder */}
               <Image src="/logo.png" alt="Loading" fill className="object-contain" priority />
            </motion.div>
            <div className="w-64 h-[2px] bg-zinc-900 rounded-full overflow-hidden relative">
              <motion.div 
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.8, ease: "easeInOut" }}
                className="absolute top-0 left-0 h-full bg-red-600"
              />
            </div>
            <div className="mt-4 font-mono text-[10px] text-red-600 tracking-[0.3em] uppercase animate-pulse">
              System_Initializing...
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- MANIFESTO MODAL --- */}
      <AnimatePresence>
        {manifestoOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setManifestoOpen(false)}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6 cursor-pointer"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="max-w-2xl w-full border border-white/10 bg-zinc-900/50 p-8 md:p-16 relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent"></div>
              <div className="absolute top-4 right-4 text-[10px] text-zinc-500 font-mono">DOC_REF: 001-ALPHA</div>
              
              <div className="text-center">
                <Crown className="w-12 h-12 text-red-600 mx-auto mb-8" />
                <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter mb-8 leading-none">
                  The <span className="text-red-600">1%</span> Doctrine
                </h2>
                <div className="text-gray-300 font-mono text-xs md:text-sm leading-relaxed space-y-6 text-justify">
                  <p><span className="text-red-600 font-bold">Mediocrity is a disease.</span> Blayzex is the cure. We do not design for the masses; we design for the obsessed.</p>
                  <p>Every garment is a piece of engineering, stress-tested to endure the darkest places you go to find your light. We use materials usually reserved for tactical warfare, repurposed for your personal war against average.</p>
                  <p>If you are looking for comfort, go elsewhere. If you are looking for equipment that respects your ambition, welcome home.</p>
                </div>
                <button 
                  onClick={() => setManifestoOpen(false)}
                  className="mt-12 text-red-600 text-[10px] font-bold uppercase tracking-[0.3em] hover:text-white transition-colors border-b border-transparent hover:border-white pb-1"
                >
                  [ ACKNOWLEDGE & CLOSE ]
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed inset-0 pointer-events-none z-30 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>

      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />

      {/* HERO SECTION */}
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-60">
            {/* MAKE SURE TO UPLOAD hero.mp4 */}
            <source src="/hero.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/30 z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
        </div>

        <div className="relative z-20 text-center px-4 max-w-7xl mx-auto flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 30 }} 
            animate={!loading ? { opacity: 1, scale: 1, y: 0 } : {}}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
            className="relative w-[180px] h-[180px] md:w-[280px] md:h-[280px] mb-8 md:mb-12"
          >
            <div className="absolute inset-0 bg-red-600/20 blur-[80px] rounded-full animate-pulse"></div>
            <Image src="/logo.png" alt="BLAYZEX" fill className="object-contain drop-shadow-[0_0_35px_rgba(255,255,255,0.2)] relative z-10" priority />
          </motion.div>
          
          <motion.button 
            onClick={enterVault}
            initial={{ opacity: 0, y: 20 }} 
            animate={!loading ? { opacity: 1, y: 0 } : {}}
            whileHover={{ scale: 1.05 }} 
            transition={{ duration: 0.5, delay: 1.2 }} 
            className="group relative bg-white text-black px-12 py-4 md:px-16 md:py-5 uppercase font-bold tracking-widest text-xs md:text-sm hover:bg-red-600 hover:text-white transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-3">
              Enter The Vault <Crosshair size={16} className="group-hover:rotate-90 transition-transform" />
            </span>
          </motion.button>
        </div>
      </section>

      {/* TICKER */}
      <div className="bg-red-600 overflow-hidden py-3 whitespace-nowrap border-y border-red-800">
        <div className="inline-block animate-marquee">
           <span className="text-black font-black italic uppercase tracking-widest text-xs md:text-sm mx-4 md:mx-8 font-mono">
              /// ENGINEERING DOMINANCE /// BLAYZEX WORLDWIDE /// THE 1% CLUB /// 240GSM FRENCH TERRY /// 350GSM HEAVYWEIGHT
           </span>
        </div>
      </div>

      {/* COLLECTION SECTION */}
      <section id="the-drop" className="py-20 md:py-32 bg-zinc-950 px-6 min-h-[80vh] relative border-t border-white/10">
        <div className="absolute inset-0 flex justify-between pointer-events-none opacity-10">
           <div className="w-px h-full bg-white/20"></div>
           <div className="w-px h-full bg-white/20"></div>
           <div className="w-px h-full bg-white/20"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-white/10 pb-6 gap-8">
            <div>
              <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter mb-4">The <span className="text-red-600">Drop</span></h2>
              <div className="w-24 h-1 bg-red-600"></div>
            </div>

            {/* CATEGORY SELECTOR */}
            <div className="flex flex-wrap gap-4 md:gap-8">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-sm md:text-base uppercase tracking-widest font-bold transition-all duration-300 relative ${
                    activeCategory === cat ? "text-white" : "text-gray-600 hover:text-gray-400"
                  }`}
                >
                  {cat}
                  {activeCategory === cat && (
                    <motion.div layoutId="underline" className="absolute -bottom-2 left-0 w-full h-[2px] bg-red-600" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <motion.div layout className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-12">
            <AnimatePresence mode='popLayout'>
              {filteredProducts.map((product) => (
                <motion.div 
                  layout
                  key={product.id} 
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="group relative cursor-pointer"
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-zinc-900 mb-6 transition-all duration-700 border border-white/5 group-hover:border-white/20">
                    <Image src={product.image} alt={product.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute top-4 left-4">
                      <span className="bg-black/80 backdrop-blur-md text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest border border-white/10 font-mono">{product.tag}</span>
                    </div>
                    {/* Corner accents */}
                    <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-red-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-red-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="bg-red-600 text-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors">INITIATE</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-start border-t border-white/10 pt-4">
                    <div className="flex flex-col">
                      <span className="text-lg font-bold uppercase tracking-tight italic">{product.name}</span>
                      <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-1 font-mono">ID: {product.id.slice(0, 8)}...</span>
                    </div>
                    <span className="text-lg font-light text-red-500 font-mono">{product.price}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredProducts.length === 0 && (
             <div className="py-20 text-center text-gray-500 uppercase tracking-widest font-mono border border-dashed border-white/10">
               // NO_DATA_FOUND_IN_SECTOR
             </div>
          )}
        </div>
      </section>

      {/* MANIFESTO / ATHLETE SECTION */}
      <section className="relative py-20 md:py-32 bg-black overflow-hidden border-t border-white/10">
         <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-900/40 via-black to-black"></div>
         </div>
         
         <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center relative z-10">
            <div>
              <Crown className="w-10 h-10 md:w-12 md:h-12 text-red-600 mb-6 md:mb-8" />
              <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tight mb-6 md:mb-8 leading-tight">
                We Don't Make Clothes. <br/> We Build <span className="text-red-600 italic">Armor</span>.
              </h2>
              <p className="text-gray-400 leading-relaxed mb-8 font-light text-sm md:text-base">
                The world is noisy. Blayzex is the signal. Every stitch is calculated. Every fabric is stress-tested. Designed for those who operate in the shadows and shine under the lights.
              </p>
              <button 
                onClick={() => setManifestoOpen(true)}
                className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-white hover:text-red-600 transition-colors"
              >
                Read The Manifesto <ArrowRight className="ml-2 w-4 h-4" />
              </button>
            </div>
            
            <div className="relative h-[300px] md:h-[400px] w-full border border-white/10 bg-zinc-900 mb-8 md:mb-0 group overflow-hidden">
               <video 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
               >
                  {/* MAKE SURE TO UPLOAD athletes.mp4 */}
                  <source src="/athletes.mp4" type="video/mp4" />
               </video>
               <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 pointer-events-none"></div>
               <div className="absolute bottom-6 left-6 text-white pointer-events-none">
                  <p className="text-xs font-bold uppercase tracking-widest text-red-600 mb-2">Blayzex Athletes</p>
                  <p className="text-sm font-light text-gray-300">Forged in iron.</p>
               </div>
            </div>
         </div>
      </section>

      {/* --- MEGA FOOTER UPGRADE --- */}
      <footer className="bg-black pt-20 pb-10 border-t border-white/10 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10 mb-20">
          
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-6">Blayzex HQ</h4>
            <div className="flex flex-col gap-2 text-sm text-gray-500 font-mono">
               <p>New Delhi, India</p>
               <p>EST. 2026</p>
               <p className="text-red-600">/// DOMINATE_AMBITION</p>
            </div>
          </div>

          <div>
             <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-6">Sector</h4>
             <ul className="space-y-3 text-sm text-gray-400">
                <li onClick={enterVault} className="hover:text-white cursor-pointer transition-colors">Shop All</li>
                <li onClick={enterVault} className="hover:text-white cursor-pointer transition-colors">New Arrivals</li>
                <li className="hover:text-white cursor-pointer transition-colors">Size Guide</li>
                <li className="hover:text-white cursor-pointer transition-colors">FAQ</li>
             </ul>
          </div>

          <div>
             <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-6">Join The 1%</h4>
             {!subscribed ? (
               <div className="flex border-b border-white/20 pb-2">
                  <input 
                    type="email" 
                    placeholder="EMAIL_ADDRESS" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-transparent text-white w-full focus:outline-none placeholder-zinc-700 text-sm font-mono uppercase" 
                  />
                  <button onClick={handleSubscribe}>
                    <ArrowRight className="text-red-600 cursor-pointer hover:translate-x-1 transition-transform" size={18} />
                  </button>
               </div>
             ) : (
               <div className="text-red-500 font-mono text-xs tracking-widest flex items-center gap-2">
                 <Check size={14} /> WELCOME TO THE INNER CIRCLE
               </div>
             )}
          </div>
        </div>

        <div className="w-full flex justify-center opacity-10 select-none">
           <h1 className="text-[12vw] md:text-[15vw] font-black uppercase italic tracking-tighter leading-none text-white whitespace-nowrap">
              Blayzex<span className="text-transparent stroke-text">.</span>
           </h1>
        </div>
      </footer>
    </main>
  );
}