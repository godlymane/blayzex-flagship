'use client';

import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Check, Instagram, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const { scrollYProgress } = useScroll();
  const footerY = useTransform(scrollYProgress, [0.8, 1], ["-20%", "0%"]);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
        alert("INVALID EMAIL FORMAT");
        return;
    }
    
    setStatus('loading');

    try {
      // ATTEMPT TO WRITE TO FIREBASE
      await addDoc(collection(db, 'intel_feed'), {
        email: email,
        timestamp: serverTimestamp(),
        source: 'footer_signup',
        status: 'active'
      });
      
      // IF SUCCESSFUL
      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 4000);

    } catch (error: any) {
      // IF FAILED - SHOW THE EXACT ERROR
      console.error("FIREBASE ERROR:", error);
      
      // THIS IS THE DEBUG ALERT
      alert(`DATABASE ERROR:\n${error.message}\n\nCheck your API Keys or Network.`);
      
      setStatus('idle');
    }
  };

  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-black border-t border-white/10 pt-24 pb-0 relative z-10 w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-24">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-[10px] uppercase tracking-widest font-mono text-zinc-500">
              
              <div className="flex flex-col gap-4">
                <span className="text-white font-bold mb-2">Navigation</span>
                <button onClick={() => handleScrollTo('shop')} className="text-left hover:text-red-600 transition-colors">The Drop</button>
                <button onClick={() => handleScrollTo('manifesto')} className="text-left hover:text-red-600 transition-colors">Manifesto</button>
              </div>

              <div className="flex flex-col gap-4">
                <span className="text-white font-bold mb-2">Legal Protocol</span>
                <Link href="/legal" className="hover:text-red-600 transition-colors">Terms of Engagement</Link>
                <Link href="/legal" className="hover:text-red-600 transition-colors">Privacy Policy</Link>
              </div>

              <div className="flex flex-col gap-4">
                <span className="text-white font-bold mb-2">Comms</span>
                <a 
                    href="https://www.instagram.com/blayzex._?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-red-600 transition-colors flex items-center gap-2"
                >
                    <Instagram size={12} /> Instagram
                </a>
              </div>
              
              {/* DEBUG NEWSLETTER */}
              <div className="flex flex-col gap-4">
                 <span className="text-white font-bold mb-2">Intel Feed (Debug Active)</span>
                 <form onSubmit={handleSubscribe} className="flex border-b border-zinc-800 pb-2 relative">
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ENTER EMAIL" 
                        disabled={status === 'loading'}
                        className="bg-transparent text-white w-full outline-none placeholder-zinc-700 disabled:text-zinc-500 transition-colors uppercase" 
                    />
                    <button 
                        type="submit"
                        disabled={status !== 'idle'}
                        className="text-white hover:text-red-600 transition-colors disabled:text-zinc-600"
                    >
                        {status === 'loading' ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : status === 'success' ? (
                            <Check size={16} className="text-green-500" />
                        ) : (
                            <ArrowRight size={16} />
                        )}
                    </button>
                 </form>
                 {status === 'success' && (
                    <span className="text-green-500 text-[9px] animate-pulse">
                        Clearance Granted. Check DB.
                    </span>
                 )}
              </div>
           </div>
        </div>

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