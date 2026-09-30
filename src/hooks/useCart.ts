"use client";

import { useState, useEffect } from "react";
import { CartItem } from "@/types/ecommerce";
import { toast } from "sonner";

const CART_STORAGE_KEY = "smart_shop_cart_v1";

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to parse cart storage", e);
    }
    setMounted(true);
  }, []);

  const saveItems = (newItems: CartItem[]) => {
    setItems(newItems);
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems));
      window.dispatchEvent(new Event("cart_updated"));
    } catch (e) {
      console.error("Failed to save cart", e);
    }
  };

  useEffect(() => {
    const handleStorage = () => {
      try {
        const stored = localStorage.getItem(CART_STORAGE_KEY);
        if (stored) {
          setItems(JSON.parse(stored));
        } else {
          setItems([]);
        }
      } catch (e) {
        console.error(e);
      }
    };

    window.addEventListener("cart_updated", handleStorage);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("cart_updated", handleStorage);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const addToCart = (item: CartItem) => {
    const existingIndex = items.findIndex(
      (i) => i.productId === item.productId && i.variantId === item.variantId
    );

    let updated: CartItem[];
    if (existingIndex > -1) {
      const currentQty = items[existingIndex].quantity;
      const targetQty = currentQty + item.quantity;
      if (targetQty > item.maxStock) {
        toast.warning(`সর্বোচ্চ স্টক সীমা (${item.maxStock} টি) অতিক্রম করা সম্ভব নয়`);
        return;
      }
      updated = [...items];
      updated[existingIndex].quantity = targetQty;
      updated[existingIndex].finalPrice = updated[existingIndex].unitPrice * targetQty;
    } else {
      if (item.quantity > item.maxStock) {
        toast.warning(`স্টক পর্যাপ্ত নেই (সর্বোচ্চ ${item.maxStock} টি)`);
        return;
      }
      updated = [...items, { ...item, finalPrice: item.unitPrice * item.quantity }];
    }

    saveItems(updated);
    toast.success("পণ্যটি সফলভাবে কার্টে যোগ হয়েছে!");
  };

  const updateQuantity = (productId: string, variantId: string | undefined, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId, variantId);
      return;
    }

    const updated = items.map((i) => {
      if (i.productId === productId && i.variantId === variantId) {
        if (qty > i.maxStock) {
          toast.warning(`সর্বোচ্চ স্টক সীমা (${i.maxStock} টি)`);
          return i;
        }
        return {
          ...i,
          quantity: qty,
          finalPrice: i.unitPrice * qty,
        };
      }
      return i;
    });

    saveItems(updated);
  };

  const removeFromCart = (productId: string, variantId?: string) => {
    const updated = items.filter(
      (i) => !(i.productId === productId && i.variantId === variantId)
    );
    saveItems(updated);
    toast.info("পণ্যটি কার্ট থেকে সরানো হয়েছে");
  };

  const clearCart = () => {
    saveItems([]);
  };

  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.finalPrice, 0);

  return {
    items: mounted ? items : [],
    totalItemsCount: mounted ? totalItemsCount : 0,
    subtotal: mounted ? subtotal : 0,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    isLoaded: mounted,
  };
}
