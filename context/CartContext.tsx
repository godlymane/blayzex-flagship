'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from './ToastContext'; 

type CartItem = {
  id: string;       
  name: string;
  price: string;
  image: string;
  quantity: number;
  size: string;     
};

type CartContextType = {
  cart: CartItem[];
  cartOpen: boolean;
  isCheckoutOpen: boolean; 
  toggleCart: () => void;
  addItemToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeItemFromCart: (id: string, size: string) => void;
  clearCart: () => void;
  checkout: () => void;
  closeCheckout: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  const { showToast } = useToast(); 

  useEffect(() => {
    setIsMounted(true);
    const savedCart = localStorage.getItem('blayzex_cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('blayzex_cart', JSON.stringify(cart));
    }
  }, [cart, isMounted]);

  const toggleCart = () => setCartOpen(!cartOpen);

  const addItemToCart = (product: Omit<CartItem, 'quantity'>) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id && item.size === product.size);
      if (existing) {
        return prev.map((item) =>
          (item.id === product.id && item.size === product.size) 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setCartOpen(true);
    showToast(`${product.name} Added to Loadout`, 'success');
  };

  const removeItemFromCart = (id: string, size: string) => {
    setCart((prev) => prev.filter((item) => !(item.id === id && item.size === size)));
    showToast('Item Ejected', 'info');
  };

  const clearCart = () => {
    setCart([]);
    if (isMounted) localStorage.removeItem('blayzex_cart');
  };

  const checkout = () => {
    if (cart.length === 0) {
      showToast("Cart is Empty", "error");
      return;
    }
    setCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const closeCheckout = () => {
      setIsCheckoutOpen(false);
  };

  // FIX: Always render the Provider. 
  // Rely on useEffect for data hydration instead of conditional rendering.
  return (
    <CartContext.Provider value={{ cart, cartOpen, isCheckoutOpen, toggleCart, addItemToCart, removeItemFromCart, clearCart, checkout, closeCheckout }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) throw new Error('useCart must be used within a CartProvider');
  return context;
}