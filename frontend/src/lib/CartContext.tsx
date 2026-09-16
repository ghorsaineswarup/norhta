"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { apiFetch } from "./api";
import { getToken } from "./auth";

type CartItem = {
  product: { _id: string; name: string; slug: string; price: number; images: string[] };
  variantSku?: string;
  quantity: number;
  price: number;
};

type CartContextType = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  loading: boolean;
  refreshCart: () => Promise<void>;
  addToCart: (productId: string, quantity: number, variantSku?: string) => Promise<string | null>;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  async function refreshCart() {
    if (!getToken()) {
      setItems([]);
      return;
    }
    setLoading(true);
    try {
      const res = await apiFetch("/cart");
      if (!res.ok) {
        setItems([]);
        return;
      }
      const data = await res.json();
      setItems(data.items || []);
    } finally {
      setLoading(false);
    }
  }

  async function addToCart(productId: string, quantity: number, variantSku?: string) {
    if (!getToken()) return "Please log in first";

    const res = await apiFetch("/cart/add", {
      method: "POST",
      body: JSON.stringify({ productId, quantity, variantSku }),
    });
    const data = await res.json();

    if (!res.ok) return data.message || "Could not add to cart";

    setItems(data.items || []);
    return null;
  }

  useEffect(() => {
    refreshCart();
  }, []);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, itemCount, subtotal, loading, refreshCart, addToCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}