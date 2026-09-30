"use client";

import Link from "next/link";
import { Phone, Truck, ShieldCheck } from "lucide-react";
import { useStoreSettings } from "@/hooks/useStoreSettings";

export function AnnouncementBar() {
  const { settings } = useStoreSettings();

  // If disabled by admin, hide completely
  if (settings?.announcement?.enabled === false) {
    return null;
  }

  const text =
    settings?.announcement?.text ||
    settings?.theme?.announcementText ||
    "৳১,৫০০+ অর্ডারে সমগ্র বাংলাদেশে ফ্রি হোম ডেলিভারি!";
  const highlightText =
    settings?.announcement?.highlightText || "১০০% অথেনটিক ও ক্যাশ অন ডেলিভারি";
  const phone = settings?.storeProfile?.phone || "০১৭১১-০০০০০০";
  const phoneText =
    settings?.announcement?.phoneText || `হেল্পলাইন: ${phone}`;
  const trackText = settings?.announcement?.trackText || "অর্ডার ট্র্যাক করুন";

  return (
    <div className="bg-sky-950 text-sky-100 text-xs py-2 px-4 border-b border-sky-900/50">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-medium text-amber-300">
            <Truck className="w-3.5 h-3.5 shrink-0" />
            <span>{text}</span>
          </span>
          {highlightText && (
            <>
              <span className="hidden md:inline text-sky-400">|</span>
              <span className="hidden md:flex items-center gap-1 text-sky-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{highlightText}</span>
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-4 text-sky-200">
          <a
            href={`tel:${phone.replace(/[^0-9+]/g, "")}`}
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <Phone className="w-3 h-3 text-sky-400 shrink-0" />
            <span>{phoneText}</span>
          </a>
          <Link
            href="/track"
            className="hover:text-amber-300 transition-colors font-medium"
          >
            {trackText}
          </Link>
        </div>
      </div>
    </div>
  );
}
