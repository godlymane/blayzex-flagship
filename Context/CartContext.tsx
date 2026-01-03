'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// IMPORT THE NEW MODAL WITH RELATIVE PATH
import CheckoutModal from '../components/CheckoutModal'; 

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
  toggleCart: () => void;
  addItemToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeItemFromCart: (id: string, size: string) => void;
  clearCart: () => void;
  checkout: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  
  // NEW STATE FOR CHECKOUT MODAL
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('blayzex_cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem('blayzex_cart', JSON.stringify(cart));
  }, [cart]);

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
  };

  const removeItemFromCart = (id: string, size: string) => {
    setCart((prev) => prev.filter((item) => !(item.id === id && item.size === size)));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('blayzex_cart');
  };

  // --- THE CRITICAL UPDATE ---
  // Old Version: Redirected to Shopify
  // New Version: Opens the Custom Checkout Modal
  const checkout = () => {
    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }
    setCartOpen(false); // Close the side drawer
    setIsCheckoutOpen(true); // Open the Razorpay/Address form
  };

  return (
    <CartContext.Provider value={{ cart, cartOpen, toggleCart, addItemToCart, removeItemFromCart, clearCart, checkout }}>
      {children}
      
      {/* RENDER THE MODAL HERE SO IT IS AVAILABLE GLOBALLY */}
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
      
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) throw new Error('useCart must be used within a CartProvider');
  return context;
}