'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="h-[80vh] w-full flex flex-col items-center justify-center bg-black text-white relative overflow-hidden px-6">
       
       {/* Background Noise */}
       <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>

       <motion.div 
         initial={{ opacity: 0, scale: 0.9 }}
         animate={{ opacity: 1, scale: 1 }}
         className="relative z-10 flex flex-col items-center text-center gap-6"
       >
          <AlertTriangle size={48} className="text-red-600 animate-pulse" />
          
          <h1 className="text-[12vw] md:text-[8vw] font-black leading-none tracking-tighter text-zinc-800 select-none">
            404
          </h1>
          
          <div className="space-y-2">
             <h2 className="text-xl md:text-2xl font-bold uppercase tracking-widest text-white">Signal Lost</h2>
             <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
                The coordinates you requested are invalid or restricted.
             </p>
          </div>

          <Link href="/">
             <button className="mt-8 px-8 py-4 bg-white text-black font-black uppercase tracking-[0.2em] text-xs hover:bg-red-600 hover:text-white transition-all">
                Return to Base
             </button>
          </Link>
       </motion.div>
    </div>
  );
}