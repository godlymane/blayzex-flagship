'use client';

export default function Legal() {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-24 md:py-32">
       <div className="max-w-3xl mx-auto">
          
          <div className="mb-16 border-b border-white/10 pb-8">
             <span className="text-red-600 font-mono text-xs uppercase tracking-[0.3em] mb-4 block">Classified Document</span>
             <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-4">
                Terms of <span className="text-transparent stroke-text">Engagement</span>
             </h1>
             <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">
                Last Updated: 2026.01.14 // Protocol V2
             </p>
          </div>

          <div className="space-y-12 text-zinc-400 font-mono text-xs md:text-sm leading-relaxed">
             <section>
                <h2 className="text-white font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                   <span className="w-1 h-1 bg-red-600 rounded-full"></span> 01 // Acquisition
                </h2>
                <p>
                   All sales are final. Blayzex produces limited-run tactical assets. Once a unit is acquired, it is removed from the global inventory permanently. Returns are only processed for structural failures or manufacturing anomalies.
                </p>
             </section>

             <section>
                <h2 className="text-white font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                   <span className="w-1 h-1 bg-red-600 rounded-full"></span> 02 // Logistics
                </h2>
                <p>
                   Global dispatch occurs within 24 hours of clearance. While we control the dispatch, we do not control the timeline of local couriers. Tracking coordinates will be transmitted to your comms device immediately upon release.
                </p>
             </section>

             <section>
                <h2 className="text-white font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                   <span className="w-1 h-1 bg-red-600 rounded-full"></span> 03 // Data Privacy
                </h2>
                <p>
                   Your data is encrypted and stored in a secure silo. We do not sell, trade, or leak operational details to third parties. Your identity is classified.
                </p>
             </section>
          </div>

          <div className="mt-24 pt-8 border-t border-white/10 text-center">
             <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
                End of File // Blayzex Legal Division
             </p>
          </div>

       </div>
    </div>
  );
}