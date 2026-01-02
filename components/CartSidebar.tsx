'use client';

// Changed to relative path
import { useCart } from '../context/CartContext';
import { X, Lock, ArrowRight, Trash2, RefreshCw } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartSidebar() {
  const { cart, cartOpen, toggleCart, removeItemFromCart, clearCart, checkout } = useCart();

  const subtotal = cart.reduce((total, item) => {
    // Remove currency symbol and commas before parsing
    const cleanPrice = item.price.replace(/[^0-9.]/g, '');
    const price = parseFloat(cleanPrice);
    return total + (isNaN(price) ? 0 : price) * item.quantity;
  }, 0);

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
          />

          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-zinc-950 border-l border-white/10 z-[70] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-white/5">
              <h2 className="text-xl font-black italic uppercase tracking-tighter text-white">
                Your <span className="text-red-600">Arsenal</span>
              </h2>
              <div className="flex items-center gap-4">
                <button onClick={clearCart} className="text-xs text-gray-500 hover:text-red-500 uppercase tracking-widest flex items-center gap-1">
                  <RefreshCw size={12} /> Clear
                </button>
                <button onClick={toggleCart} className="text-gray-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length > 0 ? (
                cart.map((item, idx) => (
                  <div key={`${item.id}-${item.size}-${idx}`} className="flex gap-4">
                    <div className="relative w-20 h-24 bg-zinc-900 border border-white/10 shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex flex-col justify-between flex-1">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="text-sm font-bold uppercase tracking-wide text-white">
                            {item.name}
                          </h3>
                          <button onClick={() => removeItemFromCart(item.id, item.size)} className="text-gray-600 hover:text-red-600">
                             <Trash2 size={14} />
                          </button>
                        </div>
                        <div className="flex gap-3 mt-1 text-[10px] uppercase tracking-widest text-gray-500">
                          <span>Size: <b className="text-white">{item.size}</b></span>
                          <span>Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <p className="text-red-500 font-mono text-sm">{item.price}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
                  <span className="text-xs uppercase tracking-widest">Vault Empty</span>
                </div>
              )}
            </div>

            {/* Checkout */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-black">
                <div className="flex justify-between text-white text-sm uppercase tracking-widest mb-4">
                  <span>Subtotal</span>
                  {/* Display Subtotal formatted */}
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <button 
                  onClick={checkout}
                  className="group w-full bg-white text-black py-4 flex items-center justify-center gap-3 uppercase font-bold tracking-widest text-xs hover:bg-red-600 hover:text-white transition-all duration-300"
                >
                  <Lock size={14} /> Secure Checkout
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}