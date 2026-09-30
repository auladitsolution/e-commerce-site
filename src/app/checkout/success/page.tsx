"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Package, PhoneCall, Copy } from "lucide-react";
import { AnnouncementBar } from "@/components/storefront/AnnouncementBar";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { toast } from "sonner";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber") || "ORD-2026-XXXXXX";
  const token = searchParams.get("token") || "";

  const handleCopy = () => {
    navigator.clipboard.writeText(orderNumber);
    toast.success("অর্ডার নম্বর কপি করা হয়েছে!");
  };

  return (
    <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
        <CheckCircle2 className="w-12 h-12" />
      </div>

      <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
        অর্ডার সফল হয়েছে!
      </span>

      <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-4 mb-2">
        ধন্যবাদ! আপনার অর্ডারটি নিশ্চিত হয়েছে
      </h1>

      <p className="text-slate-500 text-sm max-w-md mx-auto mb-8">
        আমাদের কাস্টমার কেয়ার টিম শীঘ্রই ফোন করে আপনার অর্ডারটি কনফার্ম করবে।
      </p>

      {/* Order Number Box */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs max-w-md mx-auto space-y-4 mb-8">
        <div>
          <span className="text-xs text-slate-400 font-bold block mb-1">
            আপনার অর্ডার নম্বর:
          </span>
          <div className="flex items-center justify-center gap-2">
            <span className="text-xl sm:text-2xl font-black font-mono text-sky-700">
              {orderNumber}
            </span>
            <button
              onClick={handleCopy}
              className="p-1.5 text-slate-400 hover:text-sky-600 rounded-lg hover:bg-slate-50 transition-colors"
              title="কপি করুন"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>

        {token && (
          <p className="text-[11px] text-slate-400 font-mono">
            ট্র্যাকিং টোকেন: <span className="font-bold text-slate-700">{token}</span>
          </p>
        )}

        <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-500">
          <PhoneCall className="w-4 h-4 text-sky-600" />
          <span>প্রয়োজনে কল করুন: ০১৭১১-০০০০০০</span>
        </div>
      </div>

      {/* Action Links */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href={`/track?orderNumber=${orderNumber}`}
          className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 text-sm"
        >
          <Package className="w-4 h-4" />
          <span>অর্ডার ট্র্যাক করুন</span>
        </Link>

        <Link
          href="/products"
          className="w-full sm:w-auto px-6 py-3.5 bg-sky-50 text-sky-700 hover:bg-sky-100 font-bold rounded-2xl border border-sky-200 transition-all flex items-center justify-center gap-2 text-sm"
        >
          <span>আরও কেনাকাটা করুন</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </main>
  );
}

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <AnnouncementBar />
      <Header />
      <Suspense fallback={<div className="p-12 text-center text-sm">লোড হচ্ছে...</div>}>
        <SuccessContent />
      </Suspense>
      <Footer />
    </div>
  );
}
