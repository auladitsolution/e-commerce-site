"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ShieldCheck,
  ChevronRight,
  ArrowUp,
  CreditCard,
  Truck,
  RotateCcw,
  CheckCircle2,
  Headphones,
} from "lucide-react";
import { useStoreSettings } from "@/hooks/useStoreSettings";

export function Footer() {
  const { settings } = useStoreSettings();

  const storeProfile = settings?.storeProfile;
  const footer = settings?.footer;

  const nameBn = storeProfile?.nameBn || "স্মার্ট শপ";
  const nameEn = storeProfile?.nameEn || "Bangladesh";
  const tagline = storeProfile?.tagline || "বিশ্বস্ত অনলাইন শপিং প্ল্যাটফর্ম";
  const logo = storeProfile?.logo;

  const aboutText =
    footer?.aboutText ||
    "বাংলাদেশের অন্যতম নির্ভরযোগ্য অনলাইন শপিং প্ল্যাটফর্ম। ফ্যাশন, ইলেকট্রনিক্স, গ্যাজেট ও লাইফস্টাইল পণ্য ১০০% নিশ্চয়তা ও দ্রুততম হোম ডেলিভারিতে।";

  const phone = storeProfile?.phone || "০১৭১১-০০০০০০";
  const workingHours =
    footer?.workingHours || storeProfile?.workingHours || "সকাল ৯টা - রাত ১০টা";

  const copyrightText =
    footer?.copyrightText || `${nameBn} ${nameEn}। সর্বস্বত্ব সংরক্ষিত।`;

  const devCreditText =
    footer?.devCreditText || "কারিগরি সহায়তায়: Aulad IT Solution";

  // Parse accepted payment methods
  const paymentMethodsString =
    footer?.acceptedPaymentMethods ||
    "ক্যাশ অন ডেলিভারি (COD), bKash, Nagad, Rocket";
  const rawPaymentMethods = paymentMethodsString
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="relative bg-gradient-to-b from-slate-950 via-[#0a0f1d] to-[#040711] text-slate-300 pt-10 pb-20 lg:pb-8 border-t border-slate-800/80 overflow-hidden">
      {/* Ambient background glow */}
      <div
        className="pointer-events-none absolute -top-24 left-1/4 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl opacity-40"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Compact Guarantee & Trust Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3 sm:p-4 mb-8 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm shadow-md">
          <div className="flex items-center gap-2.5 p-1.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">দ্রুত ডেলিভারি</h4>
              <p className="text-[10px] text-slate-400 hidden sm:block">সারা দেশে ২৪-৭২ ঘণ্টায়</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-1.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">১০০% আসল পণ্য</h4>
              <p className="text-[10px] text-slate-400 hidden sm:block">নিশ্চিত কোয়ালিটি</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-1.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">সহজ রিটার্ন</h4>
              <p className="text-[10px] text-slate-400 hidden sm:block">৭ দিনের ফ্রি রিটার্ন</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-1.5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
              <Headphones className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">লাইভ সাপোর্ট</h4>
              <p className="text-[10px] text-slate-400 hidden sm:block">{workingHours}</p>
            </div>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8 pb-8 border-b border-slate-800/80">
          {/* Brand Info & Social Media (5 Columns) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Logo & Store Identity */}
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              {logo ? (
                <div className="relative p-1 rounded-xl bg-gradient-to-tr from-sky-500/30 to-indigo-500/30 border border-white/10 group-hover:border-sky-400/50 transition-all shadow-md shadow-sky-500/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logo}
                    alt={nameBn}
                    className="h-9 w-auto object-contain rounded-lg"
                  />
                </div>
              ) : (
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-amber-500 p-[1.5px] shadow-md shadow-sky-500/20 group-hover:scale-105 transition-all">
                  <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
                  </div>
                </div>
              )}
              <div>
                <span className="text-xl sm:text-2xl font-black bg-gradient-to-r from-white via-slate-100 to-sky-300 bg-clip-text text-transparent tracking-tight">
                  {nameBn}
                </span>
                <span className="block text-[10px] tracking-wider text-sky-400 font-semibold uppercase">
                  {tagline}
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              {aboutText}
            </p>

            {/* Social Media Channels */}
            <div className="pt-1">
              <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                আমাদের সাথে যুক্ত থাকুন
              </span>
              <div className="flex items-center gap-2">
                {/* Facebook */}
                <a
                  href={storeProfile?.facebook || "https://facebook.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-[#1877F2] border border-slate-800 hover:border-[#1877F2] text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-[#1877F2]/30 hover:-translate-y-0.5"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>

                {/* WhatsApp */}
                <a
                  href={
                    storeProfile?.whatsapp
                      ? `https://wa.me/${storeProfile.whatsapp.replace(/[^0-9]/g, "")}`
                      : `https://wa.me/${phone.replace(/[^0-9]/g, "")}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-[#25D366] border border-slate-800 hover:border-[#25D366] text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-[#25D366]/30 hover:-translate-y-0.5"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href={storeProfile?.instagram || "https://instagram.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] border border-slate-800 hover:border-transparent text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-pink-500/30 hover:-translate-y-0.5"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>

                {/* YouTube */}
                <a
                  href={storeProfile?.youtube || "https://youtube.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-[#FF0000] border border-slate-800 hover:border-[#FF0000] text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-red-500/30 hover:-translate-y-0.5"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links (2 Columns) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
              <h3 className="text-white font-bold text-xs tracking-wider uppercase">
                প্রয়োজনীয় লিংক
              </h3>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link
                  href="/products"
                  className="flex items-center gap-1.5 text-slate-400 hover:text-sky-400 hover:translate-x-1 transition-all py-0.5 group"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-sky-400 transition-colors shrink-0" />
                  <span>সকল পণ্য</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/products?featured=true"
                  className="flex items-center gap-1.5 text-slate-400 hover:text-sky-400 hover:translate-x-1 transition-all py-0.5 group"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-sky-400 transition-colors shrink-0" />
                  <span>হট ডিল ও অফার</span>
                  <span className="px-1.5 py-0.2 bg-rose-500/20 text-rose-400 text-[9px] font-bold rounded">
                    হট
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/track"
                  className="flex items-center gap-1.5 text-slate-400 hover:text-sky-400 hover:translate-x-1 transition-all py-0.5 group"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-sky-400 transition-colors shrink-0" />
                  <span>অর্ডার ট্র্যাক করুন</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/account"
                  className="flex items-center gap-1.5 text-slate-400 hover:text-sky-400 hover:translate-x-1 transition-all py-0.5 group"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-sky-400 transition-colors shrink-0" />
                  <span>আমার অ্যাকাউন্ট</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/account/wishlist"
                  className="flex items-center gap-1.5 text-slate-400 hover:text-sky-400 hover:translate-x-1 transition-all py-0.5 group"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-sky-400 transition-colors shrink-0" />
                  <span>পছন্দের তালিকা</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="flex items-center gap-1.5 text-slate-400 hover:text-sky-400 hover:translate-x-1 transition-all py-0.5 group"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-sky-400 transition-colors shrink-0" />
                  <span>যোগাযোগ ও সহায়তা</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies & Legal (2 Columns) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              <h3 className="text-white font-bold text-xs tracking-wider uppercase">
                নীতিমালা ও শর্তাবলী
              </h3>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link
                  href="/return-policy"
                  className="flex items-center gap-1.5 text-slate-400 hover:text-indigo-400 hover:translate-x-1 transition-all py-0.5 group"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-indigo-400 transition-colors shrink-0" />
                  <span>রিটার্ন ও রিফান্ড পলিসি</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping-policy"
                  className="flex items-center gap-1.5 text-slate-400 hover:text-indigo-400 hover:translate-x-1 transition-all py-0.5 group"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-indigo-400 transition-colors shrink-0" />
                  <span>শিপিং ও ডেলিভারি</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="flex items-center gap-1.5 text-slate-400 hover:text-indigo-400 hover:translate-x-1 transition-all py-0.5 group"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-indigo-400 transition-colors shrink-0" />
                  <span>গোপনীয়তা নীতিমালা</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="flex items-center gap-1.5 text-slate-400 hover:text-indigo-400 hover:translate-x-1 transition-all py-0.5 group"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-indigo-400 transition-colors shrink-0" />
                  <span>ব্যবহারের শর্তাবলী</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="flex items-center gap-1.5 text-slate-400 hover:text-indigo-400 hover:translate-x-1 transition-all py-0.5 group"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-indigo-400 transition-colors shrink-0" />
                  <span>সাধারণ জিজ্ঞাসা (FAQ)</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="flex items-center gap-1.5 text-slate-400 hover:text-indigo-400 hover:translate-x-1 transition-all py-0.5 group"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-indigo-400 transition-colors shrink-0" />
                  <span>আমাদের সম্পর্কে</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Secure Payment (3 Columns) */}
          <div className="lg:col-span-3 space-y-3.5">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <h3 className="text-white font-bold text-xs tracking-wider uppercase">
                নিরাপদ পেমেন্ট
              </h3>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              ক্যাশ অন ডেলিভারি এবং দেশের শীর্ষ ডিজিটাল পেমেন্ট সার্ভিসের মাধ্যমে নিরাপদে পণ্য বুঝে নিয়ে মূল্য পরিশোধ করুন:
            </p>

            {/* Branded Payment Badges */}
            <div className="grid grid-cols-2 gap-2">
              {/* Cash On Delivery */}
              <div className="col-span-2 flex items-center gap-2 p-2 rounded-xl bg-slate-900/90 border border-emerald-500/30 text-white shadow-sm">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 font-bold text-[10px]">
                  COD
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    ক্যাশ অন ডেলিভারি
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                  </div>
                  <span className="text-[9px] text-slate-400 block truncate">
                    পণ্য হাতে পেয়ে মূল্য পরিশোধ
                  </span>
                </div>
              </div>

              {/* bKash */}
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/90 border border-[#E2136E]/30 text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E2136E]" />
                <span className="text-xs font-bold text-slate-200">bKash</span>
              </div>

              {/* Nagad */}
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/90 border border-[#F7941D]/30 text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F7941D]" />
                <span className="text-xs font-bold text-slate-200">Nagad</span>
              </div>

              {/* Rocket */}
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/90 border border-[#8C3494]/30 text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8C3494]" />
                <span className="text-xs font-bold text-slate-200">Rocket</span>
              </div>

              {/* Upay / Cards */}
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700/60 text-white">
                <CreditCard className="w-3 h-3 text-sky-400" />
                <span className="text-xs font-bold text-slate-200">Cards</span>
              </div>
            </div>

            {/* Custom Payment Badges if extra added in settings */}
            {rawPaymentMethods.filter(
              (m) =>
                !["ক্যাশ অন ডেলিভারি (COD)", "bKash", "Nagad", "Rocket", "COD"].includes(
                  m
                )
            ).length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {rawPaymentMethods
                  .filter(
                    (m) =>
                      ![
                        "ক্যাশ অন ডেলিভারি (COD)",
                        "bKash",
                        "Nagad",
                        "Rocket",
                        "COD",
                      ].includes(m)
                  )
                  .map((m, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-slate-900/80 border border-slate-800 rounded text-[10px] font-medium text-slate-300"
                    >
                      {m}
                    </span>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          {/* Copyright text */}
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span>© {new Date().getFullYear()} {copyrightText}</span>
          </div>

          {/* Dev Credit & Back to Top */}
          <div className="flex items-center gap-3 flex-wrap justify-center">
            {devCreditText && (
              <span className="px-2.5 py-0.5 rounded-full bg-slate-900/90 border border-slate-800/80 text-slate-400 text-[10px]">
                {devCreditText}
              </span>
            )}

            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900 hover:bg-sky-600 border border-slate-800 hover:border-sky-500 text-slate-400 hover:text-white transition-all text-xs font-medium cursor-pointer shadow-sm group"
              title="পৃষ্ঠার শীর্ষে যান"
            >
              <span>উপরে যান</span>
              <ArrowUp className="w-3 h-3 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
