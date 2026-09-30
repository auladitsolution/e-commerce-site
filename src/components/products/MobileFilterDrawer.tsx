"use client";

import { useState } from "react";
import Link from "next/link";
import { SlidersHorizontal, X, Check } from "lucide-react";

interface CategoryOption {
  name: string;
  slug: string;
}

interface MobileFilterDrawerProps {
  categories: CategoryOption[];
  currentCategory?: string;
  currentSort?: string;
  inStockOnly?: boolean;
  search?: string;
  totalProducts: number;
}

export function MobileFilterDrawer({
  categories,
  currentCategory = "",
  currentSort = "newest",
  inStockOnly = false,
  search = "",
  totalProducts,
}: MobileFilterDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const buildQuery = (overrides: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    const merged = {
      ...(search ? { search } : {}),
      ...(currentCategory ? { category: currentCategory } : {}),
      ...(currentSort ? { sort: currentSort } : {}),
      ...(inStockOnly ? { inStockOnly: "true" } : {}),
      ...overrides,
    };

    Object.entries(merged).forEach(([k, v]) => {
      if (v !== undefined && v !== "") {
        params.set(k, v);
      }
    });

    return `/products?${params.toString()}`;
  };

  return (
    <>
      {/* Trigger Button on Mobile */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="lg:hidden flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 text-slate-800 text-xs font-bold rounded-xl shadow-xs active:bg-slate-50"
      >
        <SlidersHorizontal className="w-3.5 h-3.5 text-sky-600" />
        <span>ফিল্টার ও ক্যাটাগরি</span>
        {(currentCategory || inStockOnly) && (
          <span className="w-2 h-2 rounded-full bg-sky-600 ring-2 ring-white" />
        )}
      </button>

      {/* Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Bottom Sheet Modal */}
          <div className="fixed inset-x-0 bottom-0 max-h-[85vh] bg-white rounded-t-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-sky-600" />
                <h3 className="font-bold text-slate-900 text-base">ফিল্টার ও ক্যাটাগরি</h3>
                <span className="text-xs text-slate-500">({totalProducts} পণ্য)</span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto p-5 space-y-6 flex-1">
              {/* Category Selection */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                  ক্যাটাগরি নির্বাচন
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((c) => {
                    const active = (currentCategory || "") === c.slug;
                    return (
                      <Link
                        key={c.slug}
                        href={buildQuery({ category: c.slug || undefined })}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium border transition-colors ${
                          active
                            ? "bg-sky-50 text-sky-700 border-sky-300 font-bold"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <span className="truncate">{c.name}</span>
                        {active && <Check className="w-3.5 h-3.5 text-sky-600 shrink-0" />}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Stock Status Filter */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                  স্টক অবস্থা
                </h4>
                <div className="flex gap-2">
                  <Link
                    href={buildQuery({ inStockOnly: inStockOnly ? undefined : "true" })}
                    onClick={() => setIsOpen(false)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-medium border transition-all ${
                      inStockOnly
                        ? "bg-emerald-50 text-emerald-700 border-emerald-300 font-bold"
                        : "bg-white text-slate-600 border-slate-200"
                    }`}
                  >
                    <span>{inStockOnly ? "✓ শুধুমাত্র স্টকে আছে" : "সব পণ্য (স্টক আউটসহ)"}</span>
                  </Link>
                </div>
              </div>

              {/* Sort Options */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                  ক্রমানুসার (সর্ট)
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "নতুন আগমন", val: "newest" },
                    { label: "জনপ্রিয় পণ্য", val: "best_seller" },
                    { label: "মূল্য: কম থেকে বেশি", val: "price_asc" },
                    { label: "মূল্য: বেশি থেকে কম", val: "price_desc" },
                  ].map((s) => (
                    <Link
                      key={s.val}
                      href={buildQuery({ sort: s.val })}
                      onClick={() => setIsOpen(false)}
                      className={`px-3 py-2 rounded-xl text-xs text-center border font-medium transition-colors ${
                        currentSort === s.val
                          ? "bg-slate-900 text-white border-slate-900 font-bold"
                          : "bg-white text-slate-600 border-slate-200"
                      }`}
                    >
                      {s.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Clear / Apply */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center gap-3">
              <Link
                href="/products"
                onClick={() => setIsOpen(false)}
                className="flex-1 py-2.5 text-center text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl"
              >
                রিসেট করুন
              </Link>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex-1 py-2.5 bg-sky-600 text-white text-xs font-bold rounded-xl shadow-sm text-center"
              >
                পণ্য দেখুন ({totalProducts})
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
