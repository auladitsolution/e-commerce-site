"use client";

import Link from "next/link";
import { Phone, Truck, ShieldCheck } from "lucide-react";

export function AnnouncementBar() {
  return (
    <div className="bg-sky-950 text-sky-100 text-xs py-2 px-4 border-b border-sky-900/50">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-medium text-amber-300">
            <Truck className="w-3.5 h-3.5" />
            ৳১,৫০০+ অর্ডারে সমগ্র বাংলাদেশে ফ্রি হোম ডেলিভারি!
          </span>
          <span className="hidden md:inline text-sky-400">|</span>
          <span className="hidden md:flex items-center gap-1 text-sky-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            ১০০% অথেনটিক ও ক্যাশ অন ডেলিভারি
          </span>
        </div>

        <div className="flex items-center gap-4 text-sky-200">
          <a
            href="tel:01700000000"
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <Phone className="w-3 h-3 text-sky-400" />
            <span>হেল্পলাইন: ০১৭১১-০০০০০০</span>
          </a>
          <Link
            href="/track"
            className="hover:text-amber-300 transition-colors font-medium"
          >
            অর্ডার ট্র্যাক করুন
          </Link>
        </div>
      </div>
    </div>
  );
}
