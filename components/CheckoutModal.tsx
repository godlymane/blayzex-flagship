'use client';

import React, { useState, useEffect } from 'react';
import { X, Lock, Terminal, ShieldCheck, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { CustomerDetails } from '@/types';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { cart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<CustomerDetails>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    state: ''
  });

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed'; // Hard lock for mobile
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const totalAmount = cart.reduce((total, item) => {
    const cleanPrice = item.price.replace(/[^0-9.]/g, '');
    const price = parseFloat(cleanPrice);
    return total + (isNaN(price) ? 0 : price) * item.quantity;
  }, 0);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/create-order', {
        method: 'POST',
        body: JSON.stringify({ amount: totalAmount }),
      });
      const data = await res.json();

      if (!data.orderId) throw new Error("Order creation failed");

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, 
        amount: totalAmount * 100,
        currency: "INR",
        name: "BLAYZEX OPS",
        description: "Payment for Order",
        order_id: data.orderId,
        handler: async function (response: any) {
          try {
             const verifyRes = await fetch('/api/verify-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_signature: response.razorpay_signature,
                    customer: formData,
                    items: cart,
                    total: totalAmount
                })
             });
             
             const verifyData = await verifyRes.json();
             
             if(verifyRes.ok && verifyData.success) {
                clearCart();
                onClose();
             } else {
                 alert("Verification Failed");
             }
          } catch (err) {
              console.error(err);
              alert("Error Processing");
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#000000", 
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error(error);
      alert("System Error");
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ name, placeholder, type = "text", half = false, label }: any) => (
    <div className={`relative ${half ? 'col-span-1' : 'col-span-2'}`}>
        <div className="relative group">
            <input 
                required 
                name={name} 
                type={type}
                onChange={handleChange} 
                className="peer w-full bg-zinc-900/50 border border-zinc-800 rounded-sm px-4 py-4 text-sm text-white focus:border-red-600 focus:outline-none uppercase font-mono tracking-wider placeholder-transparent transition-all"
                placeholder={placeholder}
            />
            <label className="absolute left-4 top-4 text-[10px] text-zinc-500 uppercase tracking-widest transition-all peer-placeholder-shown:text-xs peer-placeholder-shown:top-4 peer-focus:-top-2.5 peer-focus:left-2 peer-focus:bg-black peer-focus:px-2 peer-focus:text-[9px] peer-focus:text-red-600 peer-[&:not(:placeholder-shown)]:-top-2.5 peer-[&:not(:placeholder-shown)]:left-2 peer-[&:not(:placeholder-shown)]:bg-black peer-[&:not(:placeholder-shown)]:px-2 peer-[&:not(:placeholder-shown)]:text-[9px]">
                {label || placeholder}
            </label>
        </div>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[1001] flex items-end md:items-center justify-center md:p-4"
        >
          <motion.div 
            initial={{ y: "100%" }} 
            animate={{ y: 0 }} 
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full h-[100dvh] md:h-auto md:max-h-[90vh] md:max-w-xl bg-black md:border border-white/10 md:rounded-lg flex flex-col relative overflow-hidden"
          >
            
            {/* --- FIXED HEADER --- */}
            <div className="flex justify-between items-center p-5 border-b border-white/10 bg-black z-20 shrink-0">
                <div className="flex items-center gap-3">
                    <Terminal size={18} className="text-red-600" />
                    <div>
                        <h2 className="text-sm font-black uppercase italic tracking-wider text-white">Secure Link</h2>
                        <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">End-to-End Encrypted</p>
                    </div>
                </div>
                <button 
                    onClick={onClose} 
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-900 text-zinc-400 hover:text-white border border-white/5 active:scale-95 transition-all"
                >
                    <X size={20}/>
                </button>
            </div>
            
            {/* --- SCROLLABLE CONTENT --- */}
            <div className="flex-1 overflow-y-auto p-5 md:p-8 custom-scrollbar">
                <form id="checkout-form" onSubmit={handlePayment} className="grid grid-cols-2 gap-x-4 gap-y-6">
                    
                    {/* Identity Section */}
                    <div className="col-span-2 mb-2">
                         <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold flex items-center gap-2 mb-4">
                            <span className="w-1 h-1 bg-white rounded-full"></span> Identity Protocol
                         </span>
                         <div className="grid grid-cols-2 gap-4">
                            <InputField name="name" placeholder="Full Identity" label="Full Name" />
                            <InputField name="email" type="email" placeholder="Contact Email" label="Email Address" />
                            <InputField name="phone" type="tel" placeholder="Mobile Link" label="Phone Number" />
                         </div>
                    </div>

                    {/* Logistics Section */}
                    <div className="col-span-2 mt-4 mb-2">
                         <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold flex items-center gap-2 mb-4">
                            <span className="w-1 h-1 bg-white rounded-full"></span> Logistics
                         </span>
                         <div className="grid grid-cols-2 gap-4">
                             <InputField name="address" placeholder="Shipping Coordinates" label="Address Line 1" />
                             <InputField name="city" placeholder="City" label="City" half />
                             <InputField name="state" placeholder="State" label="State" half />
                             <InputField name="pincode" type="number" placeholder="Postal Code" label="Pincode" />
                         </div>
                    </div>
                    
                    {/* Trust Indicators */}
                    <div className="col-span-2 py-6 flex items-center justify-center gap-6 opacity-60">
                        <div className="flex items-center gap-2 text-[9px] font-mono text-zinc-400 uppercase tracking-widest">
                            <ShieldCheck size={12} /> SSL Secured
                        </div>
                        <div className="flex items-center gap-2 text-[9px] font-mono text-zinc-400 uppercase tracking-widest">
                            <CreditCard size={12} /> Payment Gateway
                        </div>
                    </div>

                    {/* Spacer for bottom bar visibility on mobile */}
                    <div className="col-span-2 h-24 md:h-0"></div>
                </form>
            </div>

            {/* --- FIXED BOTTOM COMMAND BAR --- */}
            <div className="p-5 border-t border-white/10 bg-black z-20 shrink-0 pb-safe">
                <div className="flex justify-between items-center mb-4 px-1">
                    <span className="text-zinc-500 uppercase tracking-widest text-[10px] font-mono">Total Debit</span>
                    <span className="text-xl font-bold text-white tracking-tight font-mono">₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>

                <button 
                    onClick={handlePayment} // Trigger via button click to ensure form submission logic works if button outside form
                    type="button" // Keep as button, handled by onClick to call handlePayment
                    disabled={loading}
                    className="w-full bg-white text-black h-14 font-black uppercase tracking-[0.2em] text-xs hover:bg-red-600 hover:text-white transition-all flex justify-center items-center gap-3 group relative overflow-hidden"
                >
                    {loading ? (
                        <span className="animate-pulse">ESTABLISHING LINK...</span>
                    ) : (
                        <>
                            <Lock size={14} className="opacity-50" /> 
                            <span>EXECUTE PAYMENT</span>
                        </>
                    )}
                </button>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}