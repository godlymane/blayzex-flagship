'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Lock scroll
    document.body.style.overflow = 'hidden';

    // Animation loop
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
             setLoading(false);
             document.body.style.overflow = '';
          }, 800); 
          return 100;
        }
        // Smooth random increment
        const jump = Math.floor(Math.random() * 10) + 1; 
        return Math.min(prev + jump, 100);
      });
    }, 40);

    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
            className="fixed inset-0 z-[99999] bg-black flex flex-col items-center justify-center cursor-wait"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
        >
            <div className="flex flex-col items-center gap-8 w-full max-w-xs px-4 relative z-10">
                
                {/* Logo - Centered above the bar */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="w-40 md:w-48 relative flex justify-center"
                >
                    <img src="/logo.png" alt="BLAYZEX" className="w-full object-contain invert-0" />
                </motion.div>

                {/* Loading Bar Container */}
                <div className="w-full flex flex-col gap-3">
                    <div className="w-full h-[2px] bg-zinc-900 relative overflow-hidden">
                        <motion.div 
                            className="absolute top-0 left-0 h-full bg-red-600 shadow-[0_0_15px_#dc2626]"
                            initial={{ width: "0%" }}
                            animate={{ width: `${progress}%` }}
                            transition={{ ease: "linear", duration: 0.1 }}
                        />
                    </div>
                    
                    {/* Status Text */}
                    <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                        <motion.span
                            key={progress === 100 ? "loaded" : "loading"}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-2"
                        >
                           {progress === 100 ? (
                               <>
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                System Ready
                               </>
                           ) : (
                               "Initializing Protocol..."
                           )}
                        </motion.span>
                        <span>{progress}%</span>
                    </div>
                </div>

            </div>
            
            {/* Background Noise Texture */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}