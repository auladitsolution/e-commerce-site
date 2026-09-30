"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

const WISHLIST_STORAGE_KEY = "smart_shop_wishlist_v1";

export interface WishlistItem {
  productId: string;
  nameBn: string;
  slug: string;
  price: number;
  image: string;
  inStock: boolean;
}

export function useWishlist() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
    setMounted(true);
  }, []);

  const save = (newItems: WishlistItem[]) => {
    setItems(newItems);
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(newItems));
    } catch (e) {
      console.error(e);
    }
  };

  const toggleWishlist = (item: WishlistItem) => {
    const exists = items.some((i) => i.productId === item.productId);
    if (exists) {
      const filtered = items.filter((i) => i.productId !== item.productId);
      save(filtered);
      toast.info("পছন্দের তালিকা থেকে সরানো হয়েছে");
    } else {
      const updated = [...items, item];
      save(updated);
      toast.success("পছন্দের তালিকায় যোগ করা হয়েছে!");
    }
  };

  const isInWishlist = (productId: string) => {
    return items.some((i) => i.productId === productId);
  };

  return {
    items: mounted ? items : [],
    count: mounted ? items.length : 0,
    toggleWishlist,
    isInWishlist,
    isLoaded: mounted,
  };
}
