import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { IProduct } from "@/types/product";

export interface CartItem {
  variantSizeId: string;
  quantity: number;
  product: IProduct;
  variantId: string;
  sizeLabel: string;
  colorLabel: string;
  colorCode?: string | null;
  imageUrl?: string;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (variantSizeId: string) => void;
  updateQuantity: (variantSizeId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
}

const CartContext = createContext<CartContextValue | null>(null);

const CART_KEY = "shades_cart";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (newItem: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.variantSizeId === newItem.variantSizeId);
      if (existing) {
        return prev.map((i) =>
          i.variantSizeId === newItem.variantSizeId
            ? { ...i, quantity: i.quantity + newItem.quantity }
            : i
        );
      }
      return [...prev, newItem];
    });
  };

  const removeItem = (variantSizeId: string) => {
    setItems((prev) => prev.filter((i) => i.variantSizeId !== variantSizeId));
  };

  const updateQuantity = (variantSizeId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(variantSizeId);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.variantSizeId === variantSizeId ? { ...i, quantity } : i
      )
    );
  };

  const clearCart = () => setItems([]);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, itemCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
