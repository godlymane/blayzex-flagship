'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, AlertTriangle, ArrowRight } from 'lucide-react';

// --- CONFIGURATION ---
const PASSCODE = "DOMINATE"; // Updated access code

export default function AccessGate({ onUnlock }: { onUnlock: () => void }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isLocked, setIsLocked] = useState(true);

  // Check session on mount to prevent re-locking on refresh
  useEffect(() => {
    const hasAccess = sessionStorage.getItem('blayzex_access');
    if (hasAccess) {
      setIsLocked(false);
      onUnlock();
    }
  }, [onUnlock]);

  const handleUnlock = (e?: React.FormEvent) => {
    e?.preventDefault();
    
    // Case-insensitive check
    if (input.toUpperCase() === PASSCODE) {
      setSuccess(true);
      setError(false);
      sessionStorage.setItem('blayzex_access', 'true');
      
      // Dramatic pause for effect before unlocking
      setTimeout(() => {
        setIsLocked(false);
        onUnlock();
      }, 1500);
    } else {
      setError(true);
      setInput("");
      setTimeout(() => setError(false), 500); // Reset shake animation
    }
  };

  if (!isLocked) return null;

  return (
    <AnimatePresence>
      {isLocked && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="fixed inset-0 z-[999999] bg-black flex flex-col items-center justify-center px-6"
        >
            {/* Background Noise Texture */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>

            <div className="relative z-10 w-full max-w-md flex flex-col items-center gap-12">
                
                {/* Lock Status Icon */}
                <div className="relative">
                    <AnimatePresence mode="wait">
                        {success ? (
                            <motion.div 
                                key="unlocked"
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="w-16 h-16 rounded-full border border-green-500/50 flex items-center justify-center bg-green-500/10 text-green-500 shadow-[0_0_30px_rgba(34,197,94,0.3)]"
                            >
                                <Unlock size={24} />
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="locked"
                                initial={{ scale: 1 }}
                                animate={{ 
                                    scale: error ? [1, 1.2, 1] : 1,
                                    x: error ? [0, -10, 10, -10, 10, 0] : 0
                                }}
                                transition={{ duration: 0.4 }}
                                className={`w-16 h-16 rounded-full border flex items-center justify-center backdrop-blur-md transition-colors duration-300
                                    ${error 
                                        ? 'border-red-500/50 bg-red-500/10 text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.3)]' 
                                        : 'border-white/10 bg-white/5 text-white/50'
                                    }
                                `}
                            >
                                {error ? <AlertTriangle size={24} /> : <Lock size={24} />}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Input Area */}
                <div className="w-full text-center space-y-8">
                    <div className="space-y-2">
                        <h1 className="text-xs font-mono uppercase tracking-[0.4em] text-zinc-500">
                            Restricted Access
                        </h1>
                        <p className="text-[10px] font-mono text-zinc-700 uppercase tracking-widest">
                            Enter Security Clearance Code
                        </p>
                    </div>

                    <form onSubmit={handleUnlock} className="relative group">
                        <input 
                            type="text" 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={success}
                            className={`
                                w-full bg-transparent border-b-2 py-4 text-center text-xl md:text-3xl font-black uppercase tracking-[0.5em] md:tracking-[0.8em] outline-none transition-all duration-300 placeholder-transparent
                                ${success 
                                    ? 'border-green-500 text-green-500' 
                                    : error 
                                        ? 'border-red-500 text-red-500' 
                                        : 'border-zinc-800 text-white focus:border-white'
                                }
                            `}
                            placeholder="PASSWORD"
                            autoFocus
                        />
                        {/* Blinking Placeholder Overlay */}
                        {!input && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <span className="text-zinc-800 text-xl md:text-3xl font-black uppercase tracking-[0.5em] opacity-30 animate-pulse">
                                    _ _ _ _ _ _ _
                                </span>
                            </div>
                        )}
                    </form>

                    {/* Feedback Messages */}
                    <div className="h-6 flex justify-center items-center">
                        <AnimatePresence mode="wait">
                            {success && (
                                <motion.span 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-green-500 text-xs font-mono uppercase tracking-[0.3em] font-bold flex items-center gap-2"
                                >
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                    Access Granted
                                </motion.span>
                            )}
                            {error && (
                                <motion.span 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="text-red-600 text-xs font-mono uppercase tracking-[0.3em] font-bold"
                                >
                                    Invalid Credentials
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Authenticate Button */}
                <button 
                    onClick={() => handleUnlock()}
                    disabled={success}
                    className={`
                        group flex items-center gap-4 text-[10px] font-mono uppercase tracking-[0.3em] transition-all duration-300
                        ${input.length > 0 && !success ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
                        hover:text-red-600
                    `}
                >
                    <span>Authenticate</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>

            </div>
            
            <div className="absolute bottom-8 text-[9px] font-mono text-zinc-800 uppercase tracking-widest">
                Protected by Blayzex Security
            </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}