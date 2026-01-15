'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, getDocs, doc, updateDoc } from 'firebase/firestore';
import { Lock, Package, Check, Clock, Phone, MapPin } from 'lucide-react';

const ADMIN_PASS = "BLAYZEXOWNER"; // CHANGE THIS PASSWORD

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passInput, setPassInput] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Auth Handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passInput === ADMIN_PASS) {
      setIsAuthenticated(true);
      fetchOrders();
    } else {
      alert("ACCESS DENIED");
    }
  };

  // Fetch Orders from Firebase
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "orders"), orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(q);
      const ordersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(ordersData);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update Status (Pending -> Shipped)
  const markAsShipped = async (orderId: string) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { fulfillmentStatus: "shipped" });
      fetchOrders(); // Refresh UI
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <form onSubmit={handleLogin} className="flex flex-col gap-4 text-center">
          <Lock className="mx-auto text-red-600 mb-2" size={32} />
          <h1 className="text-white font-mono uppercase tracking-widest">Admin Clearance</h1>
          <input 
            type="password" 
            value={passInput}
            onChange={(e) => setPassInput(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 text-white p-3 text-center uppercase tracking-widest outline-none focus:border-red-600"
            placeholder="PASSWORD"
          />
          <button className="bg-white text-black font-bold p-3 hover:bg-red-600 hover:text-white transition-colors">
            ENTER
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 font-mono">
      <div className="flex justify-between items-center mb-12 border-b border-white/10 pb-6">
        <h1 className="text-2xl md:text-4xl font-bold uppercase tracking-tighter">
          Command Center <span className="text-red-600">.</span>
        </h1>
        <div className="text-xs text-zinc-500 text-right">
          <p>TOTAL ORDERS: {orders.length}</p>
          <p>REVENUE: ₹{orders.reduce((acc, order) => acc + (order.amount || 0), 0).toLocaleString()}</p>
        </div>
      </div>

      <div className="space-y-6">
        {loading ? (
          <p>Fetching satellite data...</p>
        ) : orders.map((order) => (
          <div key={order.id} className="bg-zinc-900/30 border border-white/5 p-6 rounded-sm relative group hover:border-white/20 transition-all">
            
            {/* Header: ID & Status */}
            <div className="flex justify-between items-start mb-6">
               <div>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Order ID: {order.orderId}</span>
                  <div className="text-xl font-bold mt-1 text-white">{order.customer.name}</div>
                  <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1">
                     <Phone size={12} /> {order.customer.phone}
                  </div>
               </div>
               <div className="text-right">
                  <div className={`text-xs font-bold uppercase tracking-widest px-3 py-1 border ${order.fulfillmentStatus === 'shipped' ? 'border-green-500 text-green-500' : 'border-yellow-500 text-yellow-500'}`}>
                      {order.fulfillmentStatus || 'PENDING'}
                  </div>
                  <div className="text-sm font-bold text-white mt-2">₹{order.amount}</div>
               </div>
            </div>

            {/* Grid: Logistics & Items */}
            <div className="grid md:grid-cols-2 gap-8">
               
               {/* Logistics Info */}
               <div className="text-xs text-zinc-400 space-y-2">
                  <div className="flex items-start gap-2">
                     <MapPin size={14} className="mt-0.5 text-red-600" />
                     <div>
                        <p>{order.customer.address}</p>
                        <p>{order.customer.city}, {order.customer.state}</p>
                        <p className="font-bold text-white">{order.customer.pincode}</p>
                     </div>
                  </div>
               </div>

               {/* Items List */}
               <div className="space-y-2">
                  {order.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center text-xs border-b border-white/5 pb-2">
                          <span className="text-white font-bold">{item.name}</span>
                          <span className="text-zinc-500">{item.size} x {item.quantity}</span>
                      </div>
                  ))}
               </div>
            </div>

            {/* Actions */}
            {order.fulfillmentStatus !== 'shipped' && (
                <div className="mt-6 pt-6 border-t border-white/5 flex justify-end">
                    <button 
                        onClick={() => markAsShipped(order.id)}
                        className="flex items-center gap-2 bg-white text-black px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-green-500 transition-colors"
                    >
                        <Package size={14} /> Mark Shipped
                    </button>
                </div>
            )}

          </div>
        ))}
      </div>
    </div>
  );
}