'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, X, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      removeToast(id);
    }, 3000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              layout
              className="pointer-events-auto min-w-[300px] glass-panel bg-[#0a0a0a]/90 border-l-4 p-4 rounded-r-md shadow-2xl backdrop-blur-xl flex items-center justify-between gap-4"
              style={{
                borderColor: toast.type === 'success' ? '#10b981' : toast.type === 'error' ? '#dc2626' : '#3b82f6'
              }}
            >
              <div className="flex items-center gap-3">
                {toast.type === 'success' && <CheckCircle size={18} className="text-emerald-500" />}
                {toast.type === 'error' && <AlertCircle size={18} className="text-red-500" />}
                {toast.type === 'info' && <Info size={18} className="text-blue-500" />}
                
                <div>
                  <p className="text-[10px] text-gray-400 font-mono uppercase tracking-widest leading-none mb-1">
                    System Notification
                  </p>
                  <p className="text-sm font-bold text-white tracking-wide">{toast.message}</p>
                </div>
              </div>
              <button onClick={() => removeToast(toast.id)} className="text-gray-500 hover:text-white transition-colors">
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}