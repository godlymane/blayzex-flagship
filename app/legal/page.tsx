'use client';

import Link from 'next/link';
import { X, ArrowLeft } from 'lucide-react';

export default function Legal() {
  return (
    <div className="min-h-screen bg-black text-white relative">
       
       {/* --- FLOATING CLOSE BUTTON --- */}
       <Link href="/">
         <button className="fixed top-6 right-6 z-50 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white hover:bg-red-600 hover:border-red-600 transition-all group">
            <X size={24} className="group-hover:rotate-90 transition-transform"/>
         </button>
       </Link>

       <div className="max-w-4xl mx-auto px-6 py-24 md:py-32">
          
          <div className="mb-20 border-b border-white/10 pb-8">
             <span className="text-red-600 font-mono text-xs uppercase tracking-[0.3em] mb-4 block flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></span>
                Classified Document
             </span>
             <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-6">
                Legal <span className="text-transparent stroke-text">Protocol</span>
             </h1>
             <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">
                Last Updated: 2026.01.15 // V2.4
             </p>
          </div>

          <div className="grid md:grid-cols-[200px_1fr] gap-12">
             
             {/* Sidebar Navigation (Sticky on Desktop) */}
             <div className="hidden md:block">
                <div className="sticky top-32 flex flex-col gap-4 text-xs font-mono uppercase tracking-widest text-zinc-500">
                   <a href="#terms" className="hover:text-white transition-colors">Terms of Engagement</a>
                   <a href="#privacy" className="hover:text-white transition-colors">Privacy Protocol</a>
                   <Link href="/" className="mt-8 flex items-center gap-2 text-red-600 hover:text-white transition-colors">
                      <ArrowLeft size={12} /> Return to Base
                   </Link>
                </div>
             </div>

             {/* Content Area */}
             <div className="space-y-24 text-zinc-300 font-mono text-xs md:text-sm leading-relaxed">
                
                {/* TERMS SECTION */}
                <section id="terms" className="scroll-mt-32">
                   <h2 className="text-2xl font-bold text-white uppercase tracking-widest mb-8 border-l-4 border-red-600 pl-4">
                      Terms of Engagement
                   </h2>
                   
                   <div className="space-y-8">
                       <div>
                           <h3 className="text-white font-bold mb-2">01 // Acquisition Policy</h3>
                           <p>All sales are final. Blayzex produces limited-run tactical assets. Once a unit is acquired, it is removed from the global inventory permanently. Returns are only processed for critical structural failures or manufacturing anomalies verified by our quality control division.</p>
                       </div>
                       <div>
                           <h3 className="text-white font-bold mb-2">02 // Logistics & Dispatch</h3>
                           <p>Global dispatch occurs within 24 hours of clearance. While we control the dispatch, we do not control the timeline of local couriers. Tracking coordinates will be transmitted to your comms device immediately upon release. Lost packages are subject to investigation protocols.</p>
                       </div>
                       <div>
                           <h3 className="text-white font-bold mb-2">03 // Intellectual Property</h3>
                           <p>The Blayzex identity, logo, and designs are protected assets. Unauthorized reproduction or counterfeiting will be met with immediate legal action.</p>
                       </div>
                   </div>
                </section>

                {/* PRIVACY SECTION */}
                <section id="privacy" className="scroll-mt-32">
                   <h2 className="text-2xl font-bold text-white uppercase tracking-widest mb-8 border-l-4 border-zinc-700 pl-4">
                      Privacy Protocol
                   </h2>
                   
                   <div className="space-y-8">
                       <div>
                           <h3 className="text-white font-bold mb-2">01 // Data Encryption</h3>
                           <p>Your data (Identity, Logistics Coordinates, Payment Tokens) is encrypted using industry-standard protocols. We store only what is necessary to execute the transaction and dispatch your assets.</p>
                       </div>
                       <div>
                           <h3 className="text-white font-bold mb-2">02 // Third-Party Silos</h3>
                           <p>We do not sell, trade, or leak operational details to third parties. Your identity is classified. Only essential logistics partners receive your shipping coordinates.</p>
                       </div>
                       <div>
                           <h3 className="text-white font-bold mb-2">03 // Comms</h3>
                           <p>By initiating a transaction, you consent to receive order updates via email/SMS. Marketing comms are opt-in and can be terminated at any time via the unsubscribe link.</p>
                       </div>
                   </div>
                </section>

             </div>
          </div>

          <div className="mt-32 pt-8 border-t border-white/10 text-center">
             <Link href="/">
                <button className="px-8 py-4 bg-zinc-900 border border-zinc-800 text-white font-black uppercase tracking-[0.2em] text-xs hover:bg-white hover:text-black transition-all">
                    Acknowledge & Return
                </button>
             </Link>
          </div>

       </div>
    </div>
  );
}