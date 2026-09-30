"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck, Zap, Truck } from "lucide-react";

export function HeroSlider() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-sky-950 via-slate-900 to-indigo-950 text-white py-12 lg:py-20">
      {/* Decorative background glows */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-amber-300 text-xs sm:text-sm font-medium">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>ধামাকা সিজনাল অফার — সর্বোচ্চ ৫০% পর্যন্ত ছাড়!</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight sm:leading-tight">
              স্মার্ট কেনাকাটায়{" "}
              <span className="bg-gradient-to-r from-sky-400 to-amber-300 bg-clip-text text-transparent">
                স্মার্ট শপ
              </span>{" "}
              আপনার পাশে
            </h1>

            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0">
              সেরা মানের ফ্যাশন, ইলেকট্রনিক্স, বাচ্চাদের পোশাক ও ঘরোয়া প্রয়োজনীয় পণ্য এখন এক ঠিকানায়। দ্রুততম ক্যাশ অন ডেলিভারি এবং নিশ্চিত নির্ভরযোগ্যতা।
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/products"
                className="w-full sm:w-auto px-8 py-4 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-2xl shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 hover:gap-3 transition-all text-base"
              >
                <span>কেনাকাটা শুরু করুন</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/products?featured=true"
                className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-2xl border border-white/20 transition-all flex items-center justify-center gap-2 text-base backdrop-blur-md"
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span>হট ডিলস দেখুন</span>
              </Link>
            </div>

            {/* Quick mini-trust features */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 pt-6 border-t border-slate-800 text-slate-300 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-sky-400 shrink-0" />
                <span>সারা দেশে হোম ডেলিভারি</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>১০০% আসল প্রোডাক্ট</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>সহজ রিটার্ন পলিসি</span>
              </div>
            </div>
          </div>

          {/* Banner Graphic / Visual Cards */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Product Showcase Card */}
              <div className="relative rounded-3xl overflow-hidden border border-white/15 bg-white/5 backdrop-blur-xl p-3 shadow-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop&q=80"
                  alt="Special Eid & Summer Collection"
                  className="rounded-2xl w-full h-[320px] sm:h-[380px] object-cover"
                />
                <div className="absolute bottom-6 left-6 right-6 bg-slate-950/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-amber-400 text-xs font-bold uppercase tracking-wider block">
                      নতুন ট্রেন্ড কালেকশন
                    </span>
                    <span className="text-white text-base font-bold">
                      ঈদ ও সামার এক্সক্লুসিভ
                    </span>
                  </div>
                  <span className="text-xs bg-amber-400 text-slate-950 font-extrabold px-3 py-1.5 rounded-xl shadow-xs">
                    শুরু ৳৪৯৯ থেকে
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
