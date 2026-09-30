"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Zap, Clock, ArrowRight } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { ProductItem } from "@/types/ecommerce";
import { toBengaliNumber } from "@/lib/utils/formatters";

export function FlashSaleSection({ products }: { products: ProductItem[] }) {
  // Visual countdown timer
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 32,
    seconds: 45,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!products || products.length === 0) return null;

  return (
    <section className="py-12 bg-gradient-to-b from-amber-500/10 via-orange-500/5 to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Countdown */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 rounded-3xl p-6 text-white shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
              <Zap className="w-6 h-6 text-yellow-300 fill-current" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest text-yellow-200 font-bold block">
                সীমিত সময়ের সুযোগ
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold">
                ফ্ল্যাশ সেল (Flash Sale)
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Clock className="w-5 h-5 text-yellow-200 animate-pulse" />
              <span>সময় বাকি:</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-slate-950/70 backdrop-blur-md px-3 py-1.5 rounded-xl text-center min-w-[44px]">
                <span className="text-lg font-bold block leading-none">
                  {toBengaliNumber(String(timeLeft.hours).padStart(2, "0"))}
                </span>
                <span className="text-[9px] text-slate-300 block uppercase">ঘণ্টা</span>
              </div>
              <span className="text-xl font-bold">:</span>
              <div className="bg-slate-950/70 backdrop-blur-md px-3 py-1.5 rounded-xl text-center min-w-[44px]">
                <span className="text-lg font-bold block leading-none">
                  {toBengaliNumber(String(timeLeft.minutes).padStart(2, "0"))}
                </span>
                <span className="text-[9px] text-slate-300 block uppercase">মিনিট</span>
              </div>
              <span className="text-xl font-bold">:</span>
              <div className="bg-slate-950/70 backdrop-blur-md px-3 py-1.5 rounded-xl text-center min-w-[44px]">
                <span className="text-lg font-bold block leading-none">
                  {toBengaliNumber(String(timeLeft.seconds).padStart(2, "0"))}
                </span>
                <span className="text-[9px] text-slate-300 block uppercase">সেকেন্ড</span>
              </div>
            </div>

            <Link
              href="/products?featured=true"
              className="hidden lg:flex items-center gap-1.5 px-4 py-2 bg-white text-orange-600 font-bold rounded-xl text-xs hover:bg-yellow-50 transition-colors shrink-0"
            >
              <span>সকল ডিল</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Product Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.slice(0, 4).map((p) => (
            <ProductCard key={p.id || p._id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
