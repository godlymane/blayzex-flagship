'use client';

import React, { useState } from 'react';
import { X, Lock, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
// Relative imports to match your project structure
import { useCart } from '../context/CartContext';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { cart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Shipping Details State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    state: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Calculate Total Price (parsing "₹2,499" string to number)
  const totalAmount = cart.reduce((total, item) => {
    const cleanPrice = item.price.replace(/[^0-9.]/g, '');
    const price = parseFloat(cleanPrice);
    return total + (isNaN(price) ? 0 : price) * item.quantity;
  }, 0);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Create Order on Server
      // Ensure you have created app/api/create-order/route.ts
      const res = await fetch('/api/create-order', {
        method: 'POST',
        body: JSON.stringify({ amount: totalAmount }),
      });
      const data = await res.json();

      if (!data.orderId) throw new Error("Order creation failed");

      // 2. Open Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, 
        amount: totalAmount * 100,
        currency: "INR",
        name: "BLAYZEX",
        description: "V2 Drop Payment",
        order_id: data.orderId,
        handler: async function (response: any) {
          // 3. PAYMENT SUCCESS -> SAVE TO FIREBASE
          await addDoc(collection(db, "orders"), {
            customer: formData,
            items: cart,
            total: totalAmount,
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            createdAt: serverTimestamp(),
            status: "PAID"
          });

          setSuccess(true);
          clearCart();
          setTimeout(() => {
            onClose();
            setSuccess(false);
          }, 5000);
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#dc2626", // Blayzex Red
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error(error);
      alert("Payment Failed. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4"
        >
          <motion.div 
            initial={{ scale: 0.95, y: 20 }} 
            animate={{ scale: 1, y: 0 }} 
            exit={{ scale: 0.95, y: 20 }}
            className="bg-zinc-950 border border-white/10 w-full max-w-lg p-8 relative overflow-hidden"
          >
            {success ? (
              <div className="text-center py-10">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-black uppercase text-white mb-2">Order Confirmed</h2>
                <p className="text-gray-400 text-sm">Welcome to the 1% Club.<br/>We will contact you shortly.</p>
              </div>
            ) : (
              <>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X /></button>
                
                <h2 className="text-xl font-black uppercase text-white mb-6 border-b border-white/10 pb-4">Secure Checkout</h2>
                
                <form onSubmit={handlePayment} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input required name="name" placeholder="FULL NAME" onChange={handleChange} className="bg-zinc-900 border border-zinc-800 p-3 text-sm text-white focus:border-red-600 focus:outline-none uppercase" />
                    <input required name="phone" placeholder="PHONE" onChange={handleChange} className="bg-zinc-900 border border-zinc-800 p-3 text-sm text-white focus:border-red-600 focus:outline-none uppercase" />
                  </div>
                  <input required name="email" type="email" placeholder="EMAIL" onChange={handleChange} className="bg-zinc-900 border border-zinc-800 w-full p-3 text-sm text-white focus:border-red-600 focus:outline-none uppercase" />
                  <input required name="address" placeholder="STREET ADDRESS" onChange={handleChange} className="bg-zinc-900 border border-zinc-800 w-full p-3 text-sm text-white focus:border-red-600 focus:outline-none uppercase" />
                  <div className="grid grid-cols-3 gap-4">
                    <input required name="city" placeholder="CITY" onChange={handleChange} className="bg-zinc-900 border border-zinc-800 p-3 text-sm text-white focus:border-red-600 focus:outline-none uppercase" />
                    <input required name="state" placeholder="STATE" onChange={handleChange} className="bg-zinc-900 border border-zinc-800 p-3 text-sm text-white focus:border-red-600 focus:outline-none uppercase" />
                    <input required name="pincode" placeholder="PIN" onChange={handleChange} className="bg-zinc-900 border border-zinc-800 p-3 text-sm text-white focus:border-red-600 focus:outline-none uppercase" />
                  </div>

                  <div className="pt-4 border-t border-white/10 flex justify-between items-center text-sm font-bold text-white">
                    <span>TOTAL PAYABLE</span>
                    <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-white text-black py-4 font-bold uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all flex justify-center items-center gap-2"
                  >
                    {loading ? "PROCESSING..." : <><Lock size={16} /> PAY NOW</>}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}