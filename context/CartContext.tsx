'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// =====================================================================
// ✅ UPDATED DOMAIN BASED ON YOUR LINKS
// =====================================================================
const SHOPIFY_DOMAIN = 'blayzexv2-0.myshopify.com'; 


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
  checkout: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  // Load from storage
  useEffect(() => {
    const savedCart = localStorage.getItem('blayzex_cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  // Save to storage
  useEffect(() => {
    localStorage.setItem('blayzex_cart', JSON.stringify(cart));
  }, [cart]);

  const toggleCart = () => setCartOpen(!cartOpen);

  const addItemToCart = (product: Omit<CartItem, 'quantity'>) => {
    setCart((prev) => {
      // Find item with same ID AND same Size
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

  const checkout = () => {
    // Generate the Shopify Cart Permalink
    const variantString = cart
      .map((item) => `${item.id}:${item.quantity}`)
      .join(',');

    if (!variantString) {
      alert("Cart is empty");
      return;
    }

    const url = `https://${SHOPIFY_DOMAIN}/cart/${variantString}`;
    window.location.href = url;
  };

  return (
    <CartContext.Provider value={{ cart, cartOpen, toggleCart, addItemToCart, removeItemFromCart, checkout }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) throw new Error('useCart must be used within a CartProvider');
  return context;
}