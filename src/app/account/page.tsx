"use client";

import { useState } from "react";
import Link from "next/link";
import { User, LogIn, ShoppingBag, Heart, MapPin, Phone, ShieldCheck } from "lucide-react";
import { AnnouncementBar } from "@/components/storefront/AnnouncementBar";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { MobileBottomNav } from "@/components/storefront/MobileBottomNav";
import { useAuth } from "@/hooks/useAuth";

export default function AccountPage() {
  const { user, loginWithGoogle, logout, loading } = useAuth();
  const [loggingIn, setLoggingIn] = useState(false);

  const handleGoogleLogin = async () => {
    setLoggingIn(true);
    try {
      await loginWithGoogle();
    } catch {
      // toast shown in hook
    } finally {
      setLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
          </div>
        ) : !user ? (
          /* Login Card */
          <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/80 shadow-xs max-w-md mx-auto text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto">
              <User className="w-8 h-8" />
            </div>

            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">
                গ্রাহক অ্যাকাউন্টে লগইন করুন
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                আপনার পূর্ববর্তী অর্ডারসমূহ ও প্রোফাইল পরিচালনা করতে সাইন ইন করুন
              </p>
            </div>

            <button
              onClick={handleGoogleLogin}
              disabled={loggingIn}
              className="w-full py-3.5 px-4 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold rounded-2xl shadow-xs flex items-center justify-center gap-3 transition-colors text-sm disabled:opacity-50"
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
              <span>{loggingIn ? "লগইন হচ্ছে..." : "Google দিয়ে প্রবেশ করুন"}</span>
            </button>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>নিরাপদ ফায়ারবেস অথেন্টিকেশন</span>
            </div>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="space-y-8">
            {/* Profile Header */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4 text-center sm:text-left">
                {user.photoURL ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.photoURL}
                    alt=""
                    className="w-16 h-16 rounded-full border-2 border-sky-600 object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xl">
                    {user.displayName?.[0] || "U"}
                  </div>
                )}
                <div>
                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    {user.displayName || "সম্মানিত গ্রাহক"}
                  </h1>
                  <p className="text-xs text-slate-500 font-medium">{user.email}</p>
                  <span className="inline-block px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded-full mt-1">
                    ✓ অ্যাক্টিভ গ্রাহক
                  </span>
                </div>
              </div>

              <button
                onClick={logout}
                className="px-5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-xl transition-colors"
              >
                লগআউট করুন
              </button>
            </div>

            {/* Quick Navigation Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link
                href="/account/orders"
                className="p-6 bg-white rounded-3xl border border-slate-200/80 hover:border-sky-300 shadow-xs hover:shadow-md transition-all flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">আমার অর্ডারসমূহ</h3>
                  <span className="text-xs text-slate-500">ইতিহাস ও ডেলিভারি ট্র্যাক</span>
                </div>
              </Link>

              <Link
                href="/account/wishlist"
                className="p-6 bg-white rounded-3xl border border-slate-200/80 hover:border-rose-300 shadow-xs hover:shadow-md transition-all flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Heart className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">পছন্দের তালিকা</h3>
                  <span className="text-xs text-slate-500">সংরক্ষিত পছন্দের পণ্য</span>
                </div>
              </Link>

              <Link
                href="/track"
                className="p-6 bg-white rounded-3xl border border-slate-200/80 hover:border-amber-300 shadow-xs hover:shadow-md transition-all flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">অর্ডার ট্র্যাকিং</h3>
                  <span className="text-xs text-slate-500">লাইভ ডেলিভারি স্ট্যাটাস</span>
                </div>
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
