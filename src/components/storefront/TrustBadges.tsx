"use client";

import { Truck, RotateCcw, ShieldCheck, Headphones, LucideIcon } from "lucide-react";
import { useStoreSettings } from "@/hooks/useStoreSettings";

const ICON_MAP: Record<string, { icon: LucideIcon; color: string }> = {
  Truck: { icon: Truck, color: "text-sky-600 bg-sky-50" },
  truck: { icon: Truck, color: "text-sky-600 bg-sky-50" },
  ShieldCheck: { icon: ShieldCheck, color: "text-emerald-600 bg-emerald-50" },
  shield: { icon: ShieldCheck, color: "text-emerald-600 bg-emerald-50" },
  RotateCcw: { icon: RotateCcw, color: "text-amber-600 bg-amber-50" },
  rotate: { icon: RotateCcw, color: "text-amber-600 bg-amber-50" },
  Headphones: { icon: Headphones, color: "text-indigo-600 bg-indigo-50" },
  headphones: { icon: Headphones, color: "text-indigo-600 bg-indigo-50" },
};

const DEFAULT_BADGES = [
  {
    icon: "Truck",
    title: "দ্রুততম ডেলিভারি",
    subtitle: "ঢাকার ভেতর ২৪-৪৮ ঘণ্টা, সারা দেশে ৩-৪ দিন",
  },
  {
    icon: "ShieldCheck",
    title: "নিরাপদ পেমেন্ট ও ক্যাশ অন ডেলিভারি",
    subtitle: "পণ্য হাতে পেয়ে মূল্য পরিশোধের নিশ্চিত সুবিধা",
  },
  {
    icon: "RotateCcw",
    title: "৭ দিনের সহজ রিটার্ন",
    subtitle: "ত্রুটিপূর্ণ পণ্যের ঝামেলাহীন পরিবর্তন ও রিফান্ড",
  },
  {
    icon: "Headphones",
    title: "২৪/৭ কাস্টমার সাপোর্ট",
    subtitle: "যেকোনো জিজ্ঞাসায় আমাদের টিম সর্বদা প্রস্তুত",
  },
];

export function TrustBadges() {
  const { settings } = useStoreSettings();

  if (settings?.trustBadges?.enabled === false) {
    return null;
  }

  const items =
    settings?.trustBadges?.items && settings.trustBadges.items.length > 0
      ? settings.trustBadges.items
      : DEFAULT_BADGES;

  return (
    <section className="py-12 bg-white border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((b, idx) => {
            const mapped = ICON_MAP[b.icon] || {
              icon: ShieldCheck,
              color: "text-sky-600 bg-sky-50",
            };
            const Icon = mapped.icon;
            return (
              <div
                key={idx}
                className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100/80 hover:border-slate-200 transition-colors"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${mapped.color}`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {b.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {b.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
