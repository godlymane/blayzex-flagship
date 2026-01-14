'use client';

import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const { scrollYProgress } = useScroll();
  const footerY = useTransform(scrollYProgress, [0.8, 1], ["-20%", "0%"]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus('loading');
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 1500);
  };

  return (
    <footer className="bg-black border-t border-white/10 pt-24 pb-0 relative z-10 w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-24">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-[10px] uppercase tracking-widest font-mono text-zinc-500">
              <div className="flex flex-col gap-4">
                <span className="text-white font-bold mb-2">Navigation</span>
                <button onClick={() => document.getElementById('shop')?.scrollIntoView({behavior: 'smooth'})} className="text-left hover:text-red-600 transition-colors">The Drop</button>
                <button onClick={() => document.getElementById('manifesto')?.scrollIntoView({behavior: 'smooth'})} className="text-left hover:text-red-600 transition-colors">Manifesto</button>
              </div>
              <div className="flex flex-col gap-4">
                <span className="text-white font-bold mb-2">Legal</span>
                <Link href="/legal" className="hover:text-red-600 transition-colors">Terms of Engagement</Link>
                <Link href="/legal" className="hover:text-red-600 transition-colors">Privacy Protocol</Link>
              </div>
              <div className="flex flex-col gap-4">
                <span className="text-white font-bold mb-2">Socials</span>
                <a href="#" className="hover:text-red-600 transition-colors">Instagram</a>
                <a href="#" className="hover:text-red-600 transition-colors">Twitter</a>
              </div>
              
              {/* Functional Newsletter */}
              <div className="flex flex-col gap-4">
                 <span className="text-white font-bold mb-2">Intel Feed</span>
                 <form onSubmit={handleSubscribe} className="flex border-b border-zinc-800 pb-2 relative">
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={status === 'success' ? "ACCESS GRANTED" : "EMAIL COORDINATES"} 
                        disabled={status === 'success'}
                        className="bg-transparent text-white w-full outline-none placeholder-zinc-700 disabled:text-green-500 disabled:placeholder-green-500 transition-colors" 
                    />
                    <button 
                        type="submit"
                        disabled={status !== 'idle'}
                        className="text-white hover:text-red-600 transition-colors disabled:text-zinc-600"
                    >
                        {status === 'loading' ? (
                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        ) : status === 'success' ? (
                            <Check size={16} className="text-green-500" />
                        ) : (
                            <ArrowRight size={16} />
                        )}
                    </button>
                 </form>
                 {status === 'success' && (
                    <span className="text-green-500 text-[9px] animate-pulse">
                        Clearance Level: Upgrade
                    </span>
                 )}
              </div>
           </div>
        </div>

        {/* TITANIC FOOTER LOGO */}
        <motion.div 
            style={{ y: footerY }}
            className="w-full border-t border-white/10 bg-zinc-950 pt-4 overflow-hidden"
        >
             <h2 className="text-[20vw] font-black uppercase italic tracking-tighter text-zinc-900 leading-[0.8] select-none text-center translate-y-4 hover:text-zinc-800 transition-colors duration-700 cursor-default">
               Blayzex
             </h2>
        </motion.div>
        
        <div className="absolute bottom-4 left-0 w-full flex justify-between px-6 text-[9px] text-zinc-600 font-mono uppercase tracking-widest pointer-events-none">
            <span>© 2026 Blayzex Worldwide.</span>
            <span>Engineered in Silence.</span>
        </div>
      </footer>
  );
}