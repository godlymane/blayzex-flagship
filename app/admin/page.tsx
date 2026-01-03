'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { Lock, Package, CheckCircle, Clock, Truck, Shield, AlertTriangle } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

// --- SECURITY NOTICE ---
// Ideally, move this auth logic to Middleware or a Server Action.
// Hardcoding passwords in client-side code is risky for production.
// For V2, we are using a slightly safer hash-check simulation or environment variable.
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASS || "ADMIN_SECRET_123"; 

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      showToast("Access Granted. Welcome, Admin.", "success");
    } else {
      showToast("Access Denied. Invalid Credentials.", "error");
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(ordersData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isAuthenticated]);

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: newStatus });
      showToast(`Order Status Updated: ${newStatus}`, "success");
    } catch (error) {
      console.error("Error updating status:", error);
      showToast("Failed to update status", "error");
    }
  };

  // Safe Date Formatting Helper
  const formatDate = (timestamp: any) => {
      if(!timestamp) return "Processing...";
      if(timestamp.seconds) return new Date(timestamp.seconds * 1000).toLocaleDateString();
      return "N/A";
  };

  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-black to-black"></div>
        
        <form onSubmit={handleLogin} className="glass-panel w-full max-w-sm p-10 rounded-2xl text-center relative z-10 border-t border-red-900/50">
          <Shield className="w-16 h-16 text-red-600 mx-auto mb-6 opacity-80" />
          <h1 className="text-2xl font-black text-white mb-2 uppercase tracking-[0.2em]">Command <span className="text-red-600">Ops</span></h1>
          <p className="text-xs text-gray-500 font-mono mb-8">SECURE ENCRYPTED CONNECTION</p>
          
          <input 
            type="password" 
            placeholder="ACCESS CODE" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-black/50 border border-white/10 p-4 text-white text-center focus:border-red-600 outline-none mb-6 rounded-lg font-mono tracking-widest transition-colors placeholder-gray-700"
          />
          <button type="submit" className="w-full bg-white text-black py-4 font-bold uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all rounded-lg text-xs">
            Authenticate
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 font-mono relative">
      <div className="fixed top-0 left-0 w-full h-96 bg-red-900/10 blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="glass-panel rounded-2xl p-8 mb-12 flex flex-col md:flex-row justify-between items-start md:items-end backdrop-blur-3xl border border-white/5">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter text-white leading-none">
              Blayzex <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">Ops</span>
            </h1>
            <p className="text-[10px] text-gray-400 mt-3 tracking-[0.3em] uppercase flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></span>
              System Active // Monitoring
            </p>
          </div>
          <div className="text-right mt-6 md:mt-0">
            <p className="text-[10px] text-gray-500 mb-1 tracking-widest uppercase">Total Revenue</p>
            <p className="text-3xl font-bold text-white tabular-nums tracking-tight">₹{totalRevenue.toLocaleString('en-IN')}</p>
          </div>
        </header>

        {loading ? (
          <div className="text-center py-20 text-gray-600 animate-pulse flex flex-col items-center">
             <AlertTriangle className="mb-4 text-red-600" />
             INITIALIZING DATA STREAM...
          </div>
        ) : (
          <div className="grid gap-6">
            {orders.map((order) => (
              <div key={order.id} className="glass-panel p-8 rounded-xl group hover:border-red-600/30 transition-all duration-500">
                <div className="flex flex-col md:flex-row justify-between mb-8 pb-6 border-b border-white/5 gap-4">
                  <div>
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-xl font-bold text-white tracking-wide">{order.customer?.name || "Unknown"}</span>
                      <span className={`px-3 py-1 text-[9px] font-bold uppercase tracking-widest rounded-full border ${
                        order.status === 'PAID' ? 'border-yellow-500/30 text-yellow-500 bg-yellow-500/5' : 
                        order.status === 'SHIPPED' ? 'border-blue-500/30 text-blue-500 bg-blue-500/5' : 
                        'border-green-500/30 text-green-500 bg-green-500/5'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex gap-4 text-[10px] text-gray-500 font-sans tracking-wide">
                      <span>{order.customer?.email}</span>
                      <span>//</span>
                      <span>{order.customer?.phone}</span>
                    </div>
                    <p className="text-[9px] text-gray-600 mt-2 font-mono">{order.id}</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white tabular-nums">₹{order.total?.toLocaleString('en-IN')}</p>
                    <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {/* Items */}
                  <div>
                    <h4 className="text-[9px] uppercase tracking-[0.2em] text-gray-500 mb-4 flex items-center gap-2">
                      <Package size={10} /> Manifest
                    </h4>
                    <div className="space-y-4">
                      {order.items?.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between text-sm items-center bg-white/5 p-3 rounded-lg border border-white/5">
                          <span className="text-gray-200 font-medium">{item.name}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-gray-500">Qty {item.quantity}</span>
                            <span className="bg-white text-black text-[10px] font-bold px-2 py-1 rounded-sm uppercase">{item.size}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping */}
                  <div>
                    <h4 className="text-[9px] uppercase tracking-[0.2em] text-gray-500 mb-4 flex items-center gap-2">
                      <Truck size={10} /> Destination
                    </h4>
                    <div className="bg-white/5 p-4 rounded-lg border border-white/5 text-sm text-gray-300 leading-relaxed font-sans">
                      <p>{order.customer?.address}</p>
                      <p className="mt-1">{order.customer?.city}, {order.customer?.state}</p>
                      <p className="text-white font-bold mt-2 font-mono">{order.customer?.pincode}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-8 pt-6 border-t border-white/5 flex gap-4 opacity-50 group-hover:opacity-100 transition-opacity">
                  {order.status !== 'SHIPPED' && (
                    <button 
                      onClick={() => updateStatus(order.id, 'SHIPPED')}
                      className="flex items-center gap-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 px-6 py-3 text-[10px] font-bold uppercase hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all rounded-lg tracking-widest"
                    >
                      <Truck size={12} /> Dispatch
                    </button>
                  )}
                  {order.status !== 'DELIVERED' && (
                    <button 
                      onClick={() => updateStatus(order.id, 'DELIVERED')}
                      className="flex items-center gap-2 bg-green-500/10 text-green-400 border border-green-500/20 px-6 py-3 text-[10px] font-bold uppercase hover:bg-green-500 hover:text-white hover:border-green-500 transition-all rounded-lg tracking-widest"
                    >
                      <CheckCircle size={12} /> Complete
                    </button>
                  )}
                </div>
              </div>
            ))}

            {orders.length === 0 && (
              <div className="text-center py-32 text-gray-600 glass-panel rounded-xl border-dashed">
                <p className="tracking-widest uppercase text-xs">Awaiting Initial Drop Data...</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}