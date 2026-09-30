"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Trash2,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Tag,
  Check,
} from "lucide-react";
import { AnnouncementBar } from "@/components/storefront/AnnouncementBar";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { MobileBottomNav } from "@/components/storefront/MobileBottomNav";
import { useCart } from "@/hooks/useCart";
import { formatBDT } from "@/lib/utils/formatters";
import { toast } from "sonner";

export default function CartPage() {
  const router = useRouter();
  const { items, subtotal, updateQuantity, removeFromCart, clearCart, isLoaded } = useCart();

  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountAmount: number;
    freeShipping: boolean;
  } | null>(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [shippingZone, setShippingZone] = useState<"dhaka" | "outside">("dhaka");

  // Shipping calculation
  const baseShipping = shippingZone === "dhaka" ? 60 : 120;
  const isFreeShipping = subtotal >= 1500 || appliedCoupon?.freeShipping;
  const shippingCharge = isFreeShipping ? 0 : baseShipping;
  const couponDiscount = appliedCoupon?.discountAmount || 0;
  const grandTotal = Math.max(0, subtotal - couponDiscount + shippingCharge);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setValidatingCoupon(true);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponInput.trim(), subtotal }),
      });
      const data = await res.json();
      if (res.ok && data.valid) {
        setAppliedCoupon({
          code: data.code,
          discountAmount: data.discountAmount,
          freeShipping: data.freeShipping,
        });
        toast.success(data.message || "কুপন কোড প্রয়োগ করা হয়েছে!");
      } else {
        toast.error(data.message || "কুপন কোডটি সঠিক নয়");
      }
    } catch {
      toast.error("সার্ভার যাচাই করতে পারছে না");
    } finally {
      setValidatingCoupon(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <AnnouncementBar />
        <Header />
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <AnnouncementBar />
        <Header />
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-sky-50 text-sky-600 rounded-3xl flex items-center justify-center mb-6 shadow-xs">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
            আপনার শপিং কার্ট খালি
          </h1>
          <p className="text-slate-500 text-sm max-w-md mb-8">
            আপনার কার্টে কোনো পণ্য নেই। আমাদের ট্রেন্ডিং ও জনপ্রিয় কালেকশন থেকে এখনই আপনার পছন্দের পণ্য বেছে নিন।
          </p>
          <Link
            href="/products"
            className="px-8 py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-2xl shadow-lg transition-all flex items-center gap-2"
          >
            <span>কেনাকাটা শুরু করুন</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </main>
        <Footer />
        <MobileBottomNav />
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
              শপিং কার্ট ({items.length})
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              অর্ডার চূড়ান্ত করার পূর্বে আপনার পণ্যের তালিকা ও পরিমাণ যাচাই করে নিন
            </p>
          </div>
          <button
            onClick={clearCart}
            className="text-xs text-rose-600 hover:text-rose-700 font-bold hover:underline"
          >
            কার্ট খালি করুন
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Items List */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.variantId || "default"}`}
                  className="p-3.5 sm:p-6 flex items-start sm:items-center gap-3 sm:gap-4"
                >
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl bg-slate-100 overflow-hidden shrink-0 border border-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/products/${item.slug}`}
                        className="font-bold text-slate-900 hover:text-sky-600 text-xs sm:text-base transition-colors line-clamp-2"
                      >
                        {item.productName}
                      </Link>
                      <button
                        onClick={() => removeFromCart(item.productId, item.variantId)}
                        className="p-1 sm:p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                        title="মুছে ফেলুন"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {item.variantTitle && (
                      <span className="inline-block text-[10px] sm:text-xs font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded mt-1">
                        {item.variantTitle}
                      </span>
                    )}

                    <div className="flex items-center justify-between gap-2 mt-2.5">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-slate-200 rounded-lg sm:rounded-xl overflow-hidden bg-slate-50">
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.variantId, item.quantity - 1)
                          }
                          className="px-2.5 sm:px-3 py-1 text-slate-600 hover:bg-slate-200 font-bold text-xs sm:text-sm"
                        >
                          -
                        </button>
                        <span className="px-2.5 sm:px-3 py-1 text-xs font-bold text-slate-800 min-w-[28px] sm:min-w-[32px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.variantId, item.quantity + 1)
                          }
                          disabled={item.quantity >= item.maxStock}
                          className="px-2.5 sm:px-3 py-1 text-slate-600 hover:bg-slate-200 font-bold text-xs sm:text-sm disabled:opacity-40"
                        >
                          +
                        </button>
                      </div>

                      {/* Total & Unit Price */}
                      <div className="text-right">
                        <span className="text-xs sm:text-base font-extrabold text-slate-900 block">
                          {formatBDT(item.finalPrice)}
                        </span>
                        {item.quantity > 1 && (
                          <span className="text-[10px] text-slate-400 block">
                            @{formatBDT(item.unitPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Free shipping progress alert */}
            <div className="p-4 bg-sky-50 border border-sky-200/80 rounded-2xl flex items-center gap-3 text-sky-800 text-xs sm:text-sm">
              <ShieldCheck className="w-5 h-5 text-sky-600 shrink-0" />
              <span>
                {subtotal >= 1500
                  ? "🎉 অভিনন্দন! আপনি সারা দেশে সম্পূর্ণ ফ্রি ডেলিভারি পাচ্ছেন।"
                  : `আর মাত্র ${formatBDT(1500 - subtotal)} টাকার পণ্য কিনলে পাচ্ছেন ফ্রি ডেলিভারি!`}
              </span>
            </div>
          </div>

          {/* Cart Summary & Checkout */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-6">
              <h3 className="font-extrabold text-slate-900 text-lg pb-3 border-b border-slate-100">
                অর্ডার সারাংশ
              </h3>

              {/* Shipping Zone Selector */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">
                  ডেলিভারি এলাকা নির্বাচন করুন:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setShippingZone("dhaka")}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                      shippingZone === "dhaka"
                        ? "bg-sky-600 text-white border-sky-600 shadow-xs"
                        : "bg-slate-50 text-slate-700 border-slate-200"
                    }`}
                  >
                    ঢাকার ভিতরে (৳৬০)
                  </button>
                  <button
                    type="button"
                    onClick={() => setShippingZone("outside")}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                      shippingZone === "outside"
                        ? "bg-sky-600 text-white border-sky-600 shadow-xs"
                        : "bg-slate-50 text-slate-700 border-slate-200"
                    }`}
                  >
                    ঢাকার বাইরে (৳১২০)
                  </button>
                </div>
              </div>

              {/* Coupon Code Input */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  ডিসকাউন্ট কুপন কোড:
                </label>
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="যেমন: FREESHIP"
                      className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs uppercase font-mono font-bold focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                    <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>
                  <button
                    type="submit"
                    disabled={validatingCoupon}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
                  >
                    {validatingCoupon ? "..." : "প্রয়োগ"}
                  </button>
                </form>

                {appliedCoupon && (
                  <p className="text-xs text-emerald-600 font-bold mt-2 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    কুপন &apos;{appliedCoupon.code}&apos; সক্রিয় রয়েছে (-{formatBDT(couponDiscount)})
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2.5 pt-3 border-t border-slate-100 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>সাবটোটাল</span>
                  <span className="font-bold text-slate-900">{formatBDT(subtotal)}</span>
                </div>

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>কুপন ছাড়</span>
                    <span>-{formatBDT(couponDiscount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600">
                  <span>শিপিং চার্জ</span>
                  <span className="font-bold text-slate-900">
                    {shippingCharge === 0 ? (
                      <span className="text-emerald-600 font-bold">ফ্রি</span>
                    ) : (
                      formatBDT(shippingCharge)
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-base font-extrabold text-slate-900 pt-3 border-t border-slate-200">
                  <span>সর্বমোট প্রদেয়</span>
                  <span className="text-xl text-sky-700">{formatBDT(grandTotal)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => router.push(`/checkout?zone=${shippingZone}${appliedCoupon ? `&coupon=${appliedCoupon.code}` : ""}`)}
                className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-2xl shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all text-base active:scale-98"
              >
                <span>অর্ডার কনফার্ম করতে এগিয়ে যান</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
