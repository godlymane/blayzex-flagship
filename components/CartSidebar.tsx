'use client';

import { useCart } from '../context/CartContext';
import { X, Lock, Trash2, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartSidebar() {
  const { cart, cartOpen, toggleCart, removeItemFromCart, checkout } = useCart();

  const subtotal = cart.reduce((total, item) => {
    const cleanPrice = item.price.replace(/[^0-9.]/g, '');
    const price = parseFloat(cleanPrice);
    return total + (isNaN(price) ? 0 : price) * item.quantity;
  }, 0);

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          {/* BACKDROP */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-[990]"
          />

          {/* GLASS PANEL SIDEBAR */}
          <motion.div 
            initial={{ x: '100%' }} 
            animate={{ x: 0 }} 
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full md:w-[450px] z-[1000] flex flex-col border-l border-white/10 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] bg-[#0a0a0a]/90 backdrop-blur-2xl supports-[backdrop-filter]:bg-[#0a0a0a]/80"
          >
            {/* HEADER */}
            <div className="flex justify-between items-center p-6 border-b border-white/5 bg-white/[0.02]">
              <div className="flex items-center gap-3">
                 <div className="w-1.5 h-6 bg-red-600 shadow-[0_0_10px_red]"></div>
                 <h2 className="text-xl font-black uppercase italic tracking-tighter text-white">
                    Loadout <span className="text-zinc-500 text-sm not-italic ml-2 font-mono">({cart.length})</span>
                 </h2>
              </div>
              <button 
                onClick={toggleCart} 
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-zinc-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* ITEMS */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {cart.length > 0 ? (
                cart.map((item, idx) => (
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        key={`${item.id}-${item.size}-${idx}`} 
                        className="flex gap-4 p-3 bg-white/5 border border-white/5 rounded-lg group hover:border-white/10 transition-all"
                    >
                      <div className="relative w-20 h-24 bg-zinc-900 rounded-sm overflow-hidden shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      
                      <div className="flex flex-col justify-between flex-1 py-1">
                        <div>
                           <div className="flex justify-between items-start">
                              <h3 className="text-sm font-bold uppercase text-white leading-tight tracking-wide pr-4">{item.name}</h3>
                              <span className="font-bold text-white font-mono text-sm">{item.price}</span>
                           </div>
                           <p className="text-[10px] text-zinc-500 mt-1 font-mono uppercase tracking-widest">
                              SIZE: <span className="text-zinc-300">{item.size}</span>
                           </p>
                           <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">
                              QTY: <span className="text-zinc-300">{item.quantity}</span>
                           </p>
                        </div>
                        
                        <div className="flex justify-end">
                            <button 
                                onClick={() => removeItemFromCart(item.id, item.size)} 
                                className="text-[10px] text-red-500/80 hover:text-red-500 uppercase tracking-widest flex items-center gap-1 transition-colors px-2 py-1 hover:bg-red-500/10 rounded-sm"
                            >
                               <Trash2 size={12} /> Remove
                            </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-40 space-y-6">
                   <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
                       <ShoppingBag size={32} />
                   </div>
                   <p className="text-xs uppercase tracking-[0.3em] font-mono">No Assets Secured</p>
                </div>
              )}
            </div>

            {/* FOOTER */}
            {cart.length > 0 && (
              <div className="p-6 bg-black/40 border-t border-white/10 backdrop-blur-md pb-safe">
                <div className="flex justify-between items-end mb-6 text-sm">
                    <span className="text-zinc-500 uppercase tracking-widest font-mono text-xs">Total Estimated Value</span>
                    <span className="text-2xl font-bold text-white tracking-tight">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                
                <button 
                  onClick={checkout}
                  className="w-full bg-white text-black h-12 font-black uppercase tracking-[0.2em] text-xs hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-3 rounded-sm group"
                >
                  Proceed to Checkout <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform"/>
                </button>
                
                <div className="mt-4 flex justify-center gap-4 text-[9px] text-zinc-600 uppercase tracking-widest font-mono">
                    <span className="flex items-center gap-1"><ShieldCheck size={10} /> Secure Encryption</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Zap size={10} /> Instant Process</span>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}