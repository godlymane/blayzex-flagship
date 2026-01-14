'use client';

import { useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { X, Trash2, ArrowRight, Package, AlertTriangle, Shield, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartSidebar() {
  const { cart, cartOpen, toggleCart, removeItemFromCart, checkout } = useCart();

  const FREE_SHIPPING_THRESHOLD = 5000;
  
  const subtotal = cart.reduce((total, item) => {
    const cleanPrice = item.price.replace(/[^0-9.]/g, '');
    const price = parseFloat(cleanPrice);
    return total + (isNaN(price) ? 0 : price) * item.quantity;
  }, 0);

  const progress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;

  // --- ROBUST SCROLL LOCK (Prevents background scrolling & jumping) ---
  useEffect(() => {
    if (cartOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
  }, [cartOpen]);

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9990]"
          />

          {/* Sidebar Container */}
          <motion.div 
            initial={{ x: '100%' }} 
            animate={{ x: 0 }} 
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 z-[9999] flex flex-col h-[100dvh] w-full md:w-[480px] bg-[#050505] border-l border-white/10 shadow-2xl"
          >
            {/* --- HEADER --- */}
            <div className="flex justify-between items-center p-6 border-b border-white/10 bg-[#050505] z-20 shrink-0 relative overflow-hidden">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse shadow-[0_0_10px_red]"></div>
                        <div className="absolute inset-0 bg-red-600 rounded-full animate-ping opacity-20"></div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white leading-none">
                            Loadout
                        </h2>
                        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                            Secure Inventory // {cart.length} Unit{cart.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                </div>
                <button 
                    onClick={toggleCart} 
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-900/50 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all border border-white/5 group"
                >
                    <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                </button>
            </div>

            {/* --- SHIPPING TRACKER --- */}
            <div className="px-6 py-5 bg-zinc-900/20 border-b border-white/5 relative">
                <div className="flex justify-between text-[9px] uppercase tracking-widest font-bold mb-3 text-zinc-400">
                    <span className="flex items-center gap-2">
                        {progress === 100 ? <Zap size={10} className="text-green-500" /> : <AlertTriangle size={10} />}
                        {progress === 100 ? "Priority Status: ACTIVE" : `Add ₹${remaining.toLocaleString('en-IN')} for Priority`}
                    </span>
                    <span className={progress === 100 ? "text-green-500" : "text-red-500 font-mono"}>{progress.toFixed(0)}%</span>
                </div>
                {/* Progress Bar */}
                <div className="h-[2px] w-full bg-zinc-800 rounded-full overflow-hidden relative">
                    <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: `${progress}%` }} 
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-full relative ${progress === 100 ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-red-600 shadow-[0_0_10px_#dc2626]'}`}
                    >
                    </motion.div>
                </div>
            </div>

            {/* --- ITEMS LIST --- */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-[#050505] relative" style={{ overscrollBehavior: 'contain' }}>
              <AnimatePresence mode='popLayout'>
              {cart.length > 0 ? (
                cart.map((item, idx) => (
                    <motion.div 
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                        transition={{ delay: idx * 0.05 }}
                        key={`${item.id}-${item.size}-${idx}`} 
                        className="group relative flex gap-4 p-4 bg-zinc-900/10 border border-white/5 hover:border-white/20 transition-all rounded-sm backdrop-blur-sm overflow-hidden"
                    >
                      {/* Thumbnail */}
                      <div className="relative w-24 h-28 bg-zinc-900 shrink-0 overflow-hidden border border-white/5">
                        <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                        />
                      </div>
                      
                      {/* Item Details */}
                      <div className="flex flex-col justify-between flex-1 py-1 z-10">
                        <div>
                           <div className="flex justify-between items-start gap-2">
                              <h3 className="text-xs font-bold uppercase text-white tracking-wider leading-tight">{item.name}</h3>
                              <span className="font-mono text-xs text-white font-bold whitespace-nowrap">{item.price}</span>
                           </div>
                           
                           {/* Tech Specs */}
                           <div className="mt-3 grid grid-cols-2 gap-2 max-w-[140px]">
                               <div className="flex flex-col">
                                   <span className="text-[8px] text-zinc-600 uppercase tracking-wider">Size</span>
                                   <span className="text-[10px] font-mono text-zinc-300 border-l border-red-600 pl-2">{item.size}</span>
                               </div>
                               <div className="flex flex-col">
                                   <span className="text-[8px] text-zinc-600 uppercase tracking-wider">Qty</span>
                                   <span className="text-[10px] font-mono text-zinc-300 border-l border-zinc-700 pl-2">{item.quantity}</span>
                               </div>
                           </div>
                        </div>
                        
                        <button 
                            onClick={() => removeItemFromCart(item.id, item.size)} 
                            className="text-[9px] text-zinc-500 hover:text-red-500 uppercase tracking-widest text-left flex items-center gap-2 transition-colors mt-3 w-fit"
                        >
                           <Trash2 size={10} /> Discard Asset
                        </button>
                      </div>
                    </motion.div>
                  ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-zinc-700 opacity-60">
                   <div className="w-20 h-20 border border-zinc-800 rounded-full flex items-center justify-center mb-6">
                        <Package size={32} strokeWidth={1} className="text-zinc-600" />
                   </div>
                   <p className="text-sm font-black uppercase tracking-[0.3em] mb-2 text-white">Sector Empty</p>
                   <p className="text-[9px] font-mono tracking-widest text-center max-w-[200px]">
                      Awaiting equipment selection.
                   </p>
                </div>
              )}
              </AnimatePresence>
            </div>

            {/* --- FOOTER ACTION --- */}
            <div className="p-6 bg-[#050505]/90 border-t border-white/10 pb-safe z-20 backdrop-blur-xl">
              {cart.length > 0 ? (
                  <div className="space-y-6">
                    <div className="flex justify-between items-end">
                        <span className="text-zinc-500 uppercase tracking-widest font-mono text-[10px] flex items-center gap-2">
                            <Shield size={10} /> Value
                        </span>
                        <div className="flex flex-col items-end">
                            <span className="text-3xl font-bold text-white tracking-tighter italic tabular-nums">₹{subtotal.toLocaleString('en-IN')}</span>
                            <span className="text-[9px] text-zinc-600 font-mono uppercase tracking-widest">Tax Included</span>
                        </div>
                    </div>
                    
                    <button 
                        onClick={checkout}
                        className="w-full h-16 bg-white text-black font-black uppercase tracking-[0.2em] text-xs hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-4 group relative overflow-hidden clip-path-slant"
                    >
                        <span className="relative z-10">Initiate Checkout</span>
                        <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform"/>
                        {/* Hover Fill Effect */}
                        <div className="absolute inset-0 bg-red-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></div>
                    </button>
                  </div>
              ) : (
                  <button 
                    onClick={toggleCart}
                    className="w-full h-14 bg-zinc-900 text-white font-black uppercase tracking-[0.2em] text-xs hover:bg-zinc-800 transition-all border border-zinc-800"
                  >
                    Return to Shop
                  </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}