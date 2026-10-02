"use client";

import { useState } from "react";
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
  Menu,
  X,
  ShieldCheck,
  User,
  LogOut,
  Lock,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  isOwnerEmail,
  INITIAL_OWNER_EMAIL,
  INITIAL_OWNER_NAME,
} from "@/lib/permissions/rbac";

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

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading, loginWithGoogle, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);

  // 1. Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-4">
        <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center mb-4">
          <Sparkles className="w-7 h-7 text-sky-400 animate-spin" />
        </div>
        <h2 className="text-base font-bold text-slate-100">ম্যানেজমেন্ট সিকিউরিটি যাচাই করা হচ্ছে...</h2>
        <p className="text-xs text-slate-400 mt-1 font-mono">Verifying owner credentials...</p>
      </div>
    );
  }

  // 2. Unauthenticated State (Prompt Admin to Log In)
  if (!user) {
    const handleLogin = async () => {
      setLoggingIn(true);
      try {
        await loginWithGoogle();
      } catch {
        // toast error already triggered in useAuth
      } finally {
        setLoggingIn(false);
      }
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 p-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center mx-auto shadow-lg shadow-sky-500/20 text-white">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <span className="inline-block px-3 py-1 bg-sky-950 text-sky-400 text-[11px] font-mono font-bold rounded-full border border-sky-800/60 mb-2">
              Management Portal Guard
            </span>
            <h1 className="text-2xl font-black text-white">
              অ্যাডমিন প্যানেলে সাইন ইন করুন
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
              এই ড্যাশবোর্ড ও কাস্টমাইজেশন ব্যবস্থাপনা শুধুমাত্র স্টোর ওনার (
              <span className="text-sky-300 font-mono font-medium">{INITIAL_OWNER_EMAIL}</span>
              )-এর জন্য সংরক্ষিত।
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={handleLogin}
              disabled={loggingIn}
              className="w-full py-3.5 px-4 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-2xl shadow-md flex items-center justify-center gap-3 transition-colors text-sm disabled:opacity-50 cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>{loggingIn ? "যাচাই করা হচ্ছে..." : "Google দিয়ে ওনার প্রবেশ"}</span>
            </button>

            <Link
              href="/"
              className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-2xl flex items-center justify-center gap-2 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>স্টোরফ্রন্ট হোমপেজে ফিরে যান</span>
            </Link>
          </div>

          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-center gap-1.5 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Single-Tenant Dedicated Admin Authority</span>
          </div>
        </div>
      </div>
    );
  }

  // 3. Authenticated but Unauthorized User (Non-Owner Attempt)
  const isOwner = isOwnerEmail(user.email);
  if (!isOwner) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 p-4">
        <div className="w-full max-w-lg bg-slate-900 border border-rose-900/60 rounded-3xl p-8 sm:p-10 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-500">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div>
            <span className="inline-block px-3 py-1 bg-rose-950/80 text-rose-400 text-[11px] font-mono font-bold rounded-full border border-rose-800/60 mb-2">
              403 Forbidden - Access Restricted
            </span>
            <h1 className="text-2xl font-black text-white">
              অননুমোদিত প্রবেশাধিকার
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
              আপনি বর্তমানে <span className="text-rose-300 font-mono font-bold">{user.email}</span> অ্যাকাউন্ট দিয়ে সাইন ইন আছেন।
              এই ড্যাশবোর্ড ও সাইটের সকল কাস্টমাইজেশন ব্যবস্থাপনা শুধুমাত্র নির্ধারিত স্টোর ওনার (
              <span className="text-emerald-400 font-mono font-bold">{INITIAL_OWNER_EMAIL}</span>
              )-এর জন্য সীমাবদ্ধ।
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-left text-xs text-slate-300 space-y-1.5 font-sans">
            <p className="font-bold text-slate-200">নিরাপত্তা নির্দেশনা:</p>
            <ul className="list-disc list-inside text-slate-400 space-y-1">
              <li>যদি আপনি স্টোর ওনার হন, অনুগ্রহ করে ওনার জিমেইল (<code className="text-sky-300">{INITIAL_OWNER_EMAIL}</code>) দিয়ে পুনরায় লগইন করুন।</li>
              <li>সাধারণ কেনাকাটা বা অর্ডার ট্র্যাক করতে স্টোরফ্রন্টে ফিরে যান।</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={logout}
              className="flex-1 py-3 px-4 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>লগআউট করে অ্যাকাউন্ট পরিবর্তন</span>
            </button>
            <Link
              href="/"
              className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-2xl text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>গ্রাহক হোমে ফিরে যান</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 4. Authorized Owner - Render Full Admin Portal
  return (
    <div className="min-h-screen flex bg-slate-100/80 text-slate-900 font-sans">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Desktop Fixed & Mobile Slide-over */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <Link
            href="/admin"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-2"
          >
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

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
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
                onClick={() => setSidebarOpen(false)}
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

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Responsive Header */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between shadow-xs sticky top-0 z-30">
          <div className="flex items-center gap-3">
            {/* Hamburger button for mobile */}
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <span className="text-[11px] font-bold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="hidden sm:inline">Owner Verified:</span>
              <span className="font-mono text-emerald-800">{user.email}</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5">
              {user.photoURL ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.photoURL}
                  alt={user.displayName || "Admin"}
                  className="w-8 h-8 rounded-full border border-sky-500 object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs">
                  <User className="w-4 h-4" />
                </div>
              )}
              <div className="text-left hidden sm:block">
                <span className="text-xs font-bold text-slate-800 block leading-tight">
                  {user.displayName || INITIAL_OWNER_NAME}
                </span>
                <span className="text-[10px] text-amber-600 font-bold tracking-wide">
                  👑 SUPER ADMIN (OWNER)
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={logout}
              title="অ্যাডমিন প্যানেল থেকে লগআউট"
              className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors flex items-center gap-1 text-xs font-semibold"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">লগআউট</span>
            </button>
          </div>
        </header>

        {/* Child Pages Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
