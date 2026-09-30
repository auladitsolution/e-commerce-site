"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Boxes,
  ShoppingBag,
  Layers,
  Tag,
  RotateCcw,
  BarChart3,
  Settings,
  ShieldAlert,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

const NAV_ITEMS = [
  { name: "ড্যাশবোর্ড", href: "/admin", icon: LayoutDashboard },
  { name: "পণ্য তালিকা", href: "/admin/products", icon: Package },
  { name: "অর্ডার ম্যানেজমেন্ট", href: "/admin/orders", icon: ShoppingBag },
  { name: "ইনভেন্টরি ও স্টক", href: "/admin/inventory", icon: Boxes },
  { name: "ক্যাটাগরি", href: "/admin/categories", icon: Layers },
  { name: "কুপন ও প্রমোশন", href: "/admin/coupons", icon: Tag },
  { name: "রিটার্ন অনুরোধ", href: "/admin/returns", icon: RotateCcw },
  { name: "রিপোর্ট ও লাভক্ষতি", href: "/admin/reports", icon: BarChart3 },
  { name: "স্টোর সেটিংস", href: "/admin/settings", icon: Settings },
  { name: "অডিট লগ", href: "/admin/audit-logs", icon: ShieldAlert },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-screen border-r border-slate-800">
      {/* Brand logo */}
      <div className="p-6 border-b border-slate-800 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
            <Sparkles className="w-4 h-4 text-amber-300" />
          </div>
          <div>
            <span className="font-extrabold text-white text-base">স্মার্ট শপ</span>
            <span className="block text-[9px] tracking-widest text-sky-400 uppercase font-mono">
              Management Portal
            </span>
          </div>
        </Link>
      </div>

      {/* Nav list */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname?.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                isActive
                  ? "bg-sky-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom link to Storefront */}
      <div className="p-4 border-t border-slate-800">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-center gap-2 px-3 py-2.5 bg-slate-800/80 hover:bg-slate-800 text-sky-300 rounded-xl text-xs font-bold transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>স্টোরফ্রন্ট ভিজিট করুন</span>
        </Link>
      </div>
    </aside>
  );
}
