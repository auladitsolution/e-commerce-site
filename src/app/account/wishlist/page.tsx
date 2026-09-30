"use client";

import Link from "next/link";
import { Heart, Trash2, ShoppingCart, ArrowRight } from "lucide-react";
import { AnnouncementBar } from "@/components/storefront/AnnouncementBar";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { MobileBottomNav } from "@/components/storefront/MobileBottomNav";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/hooks/useCart";
import { formatBDT } from "@/lib/utils/formatters";

export default function WishlistPage() {
  const { items, toggleWishlist, isLoaded } = useWishlist();
  const { addToCart } = useCart();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <AnnouncementBar />
        <Header />
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              পছন্দের তালিকা ({items.length})
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              আপনার সংরক্ষিত পছন্দের পণ্যসমূহ সহজে কার্টে যোগ করুন
            </p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs max-w-md mx-auto my-12">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              পছন্দের তালিকা খালি
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              পণ্য ব্রাউজ করার সময় হার্ট আইকনে ক্লিক করে পছন্দের তালিকায় যোগ করুন।
            </p>
            <Link
              href="/products"
              className="px-6 py-2.5 bg-sky-600 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-md"
            >
              <span>পণ্য ব্রাউজ করুন</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <div
                key={item.productId}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="aspect-square bg-slate-100 overflow-hidden relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.nameBn}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => toggleWishlist(item)}
                    className="absolute top-2.5 right-2.5 p-2 bg-white/80 backdrop-blur-md rounded-full text-rose-600 hover:bg-rose-50 shadow-xs transition-colors"
                    title="তালিকা থেকে সরান"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                  <div>
                    <Link
                      href={`/products/${item.slug}`}
                      className="font-bold text-slate-900 hover:text-sky-600 text-sm line-clamp-2"
                    >
                      {item.nameBn}
                    </Link>
                    <span className="text-base font-extrabold text-slate-900 mt-2 block">
                      {formatBDT(item.price)}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      addToCart({
                        productId: item.productId,
                        productName: item.nameBn,
                        slug: item.slug,
                        sku: "WISHLIST-ADD",
                        image: item.image,
                        quantity: 1,
                        unitPrice: item.price,
                        finalPrice: item.price,
                        maxStock: 99,
                      });
                    }}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>কার্টে যোগ করুন</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
