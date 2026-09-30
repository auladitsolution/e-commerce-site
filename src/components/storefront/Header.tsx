"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ShoppingCart,
  Heart,
  User as UserIcon,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Grid,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useAuth } from "@/hooks/useAuth";
import { useStoreSettings } from "@/hooks/useStoreSettings";

const CATEGORY_ITEMS = [
  { name: "ফ্যাশন ও পোশাক", slug: "fashion" },
  { name: "ইলেকট্রনিক্স ও গ্যাজেট", slug: "electronics" },
  { name: "কিডস ও বেবি", slug: "kids" },
  { name: "কসমেটিক্স ও স্কিনকেয়ার", slug: "cosmetics" },
  { name: "হোম ও লিভিং", slug: "home-living" },
];

export function Header() {
  const router = useRouter();
  const { totalItemsCount, subtotal } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { user, logout } = useAuth();
  const { settings } = useStoreSettings();

  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden p-2 -ml-1 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 sm:gap-2 group shrink-0">
            {settings?.storeProfile?.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={settings.storeProfile.logo}
                alt={settings.storeProfile.nameBn || "Logo"}
                className="h-9 sm:h-11 w-auto object-contain rounded-lg"
              />
            ) : (
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
              </div>
            )}
            <div>
              <span className="text-lg sm:text-2xl font-black bg-gradient-to-r from-sky-700 to-indigo-800 bg-clip-text text-transparent">
                {settings?.storeProfile?.nameBn || "স্মার্ট শপ"}
              </span>
              <span className="hidden sm:block text-[9px] sm:text-[10px] tracking-widest text-slate-500 uppercase font-medium">
                {settings?.storeProfile?.tagline || settings?.storeProfile?.nameEn || "Bangladesh"}
              </span>
            </div>
          </Link>

          {/* Search bar (Desktop & Tablet) */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-xl mx-4 relative"
          >
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="পণ্য, ব্র্যান্ড বা ক্যাটাগরি খুঁজুন... (যেমন: শার্ট, স্মার্টওয়াচ)"
                className="w-full pl-11 pr-24 py-2.5 bg-slate-100/80 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all shadow-inner"
              />
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-2.5" />
              <button
                type="submit"
                className="absolute right-1.5 top-1 px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-full text-xs font-medium transition-colors shadow-xs"
              >
                খুঁজুন
              </button>
            </div>
          </form>

          {/* Actions: Wishlist, Cart, Account */}
          <div className="flex items-center gap-1 sm:gap-3">
            {/* Wishlist */}
            <Link
              href="/account/wishlist"
              className="relative p-2 sm:p-2.5 text-slate-700 hover:text-rose-600 hover:bg-slate-100 rounded-full transition-colors hidden sm:flex"
              title="পছন্দের তালিকা"
            >
              <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 sm:w-5 sm:h-5 bg-rose-500 text-white text-[10px] sm:text-[11px] font-bold rounded-full flex items-center justify-center shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="flex items-center gap-1.5 sm:gap-2.5 p-1.5 sm:px-4 sm:py-2 bg-sky-50 hover:bg-sky-100 text-sky-800 rounded-full border border-sky-200/80 transition-colors shadow-xs group"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-sky-700 group-hover:scale-110 transition-transform" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 sm:w-5 sm:h-5 bg-amber-500 text-slate-950 text-[10px] sm:text-[11px] font-extrabold rounded-full flex items-center justify-center shadow-xs">
                    {totalItemsCount}
                  </span>
                )}
              </div>
              <div className="hidden lg:block text-left">
                <span className="block text-[10px] text-sky-600 font-semibold leading-none">কার্ট</span>
                <span className="text-xs font-bold text-sky-900 leading-none">
                  ৳{subtotal.toLocaleString()}
                </span>
              </div>
            </Link>

            {/* Account Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                className="flex items-center gap-1 p-1.5 sm:p-2 rounded-full text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Account Menu"
              >
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600">
                  <UserIcon className="w-4 h-4" />
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {accountMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                  onMouseLeave={() => setAccountMenuOpen(false)}
                >
                  {user ? (
                    <>
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs text-slate-400 font-medium">লগইন করা হয়েছে</p>
                        <p className="text-sm font-bold text-slate-800 truncate">
                          {user.displayName || user.email}
                        </p>
                      </div>
                      <Link
                        href="/account"
                        onClick={() => setAccountMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        প্রোফাইল ও ঠিকানা
                      </Link>
                      <Link
                        href="/account/orders"
                        onClick={() => setAccountMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        আমার অর্ডারসমূহ
                      </Link>
                      <Link
                        href="/account/wishlist"
                        onClick={() => setAccountMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        পছন্দের তালিকা
                      </Link>
                      <hr className="my-1 border-slate-100" />
                      <button
                        onClick={() => {
                          logout();
                          setAccountMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        লগআউট করুন
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs text-slate-500 font-medium">অ্যাকাউন্টে প্রবেশ করুন</p>
                      </div>
                      <Link
                        href="/account"
                        onClick={() => setAccountMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-sky-700 font-semibold hover:bg-sky-50 transition-colors"
                      >
                        লগইন / রেজিস্টার
                      </Link>
                      <Link
                        href="/track"
                        onClick={() => setAccountMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        অর্ডার ট্র্যাক করুন
                      </Link>
                    </>
                  )}
                  <hr className="my-1 border-slate-100" />
                  <Link
                    href="/admin"
                    onClick={() => setAccountMenuOpen(false)}
                    className="block px-4 py-2 text-xs font-semibold text-slate-500 hover:text-sky-700 hover:bg-slate-50 transition-colors"
                  >
                    ম্যানেজমেন্ট ড্যাশবোর্ড (Admin)
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar (Directly below header on small mobile screens) */}
        <form onSubmit={handleSearch} className="md:hidden pb-3">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="পণ্য বা ব্র্যান্ড খুঁজুন..."
              className="w-full pl-9 pr-20 py-2 bg-slate-100 border border-slate-200 rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <button
              type="submit"
              className="absolute right-1 top-1 px-3 py-1 bg-sky-600 text-white rounded-full text-xs font-bold"
            >
              খুঁজুন
            </button>
          </div>
        </form>

        {/* Category Navigation Bar (Desktop) */}
        <nav className="hidden lg:flex items-center gap-8 py-2.5 border-t border-slate-100 text-sm font-medium text-slate-700">
          <Link
            href="/products"
            className="flex items-center gap-1.5 text-sky-700 font-bold hover:text-sky-800 transition-colors"
          >
            সকল পণ্য (All Products)
          </Link>
          {CATEGORY_ITEMS.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className="hover:text-sky-600 transition-colors"
            >
              {cat.name}
            </Link>
          ))}
          <Link
            href="/products?featured=true"
            className="ml-auto text-amber-600 font-semibold hover:text-amber-700 flex items-center gap-1"
          >
            <Sparkles className="w-4 h-4" />
            হট ডিলস ও অফার
          </Link>
        </nav>
      </div>
    </header>

    {/* Mobile Drawer Menu - Rendered via Portal directly into document.body to prevent stacking context or backdrop-filter clipping */}
    {mobileMenuOpen && mounted && createPortal(
      <div className="lg:hidden fixed inset-0 z-[100] flex">
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
        <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col p-6 overflow-y-auto z-10 animate-in slide-in-from-left duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4 text-amber-300" />
              </div>
              <span className="text-base font-extrabold text-slate-900">মেনু</span>
            </div>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="p-1.5 rounded-xl text-slate-500 hover:bg-slate-100 cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="py-4 space-y-3">
            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 py-2.5 px-3 rounded-xl bg-sky-50 text-sky-700 font-bold text-sm"
            >
              <Grid className="w-4 h-4" />
              <span>সকল পণ্য তালিকা</span>
            </Link>

            <div className="pt-2 pb-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              ক্যাটাগরি
            </div>

            {CATEGORY_ITEMS.map((cat) => (
              <Link
                key={cat.slug}
                href={`/products?category=${cat.slug}`}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 px-3 text-xs font-semibold text-slate-700 hover:text-sky-600 hover:bg-slate-50 rounded-xl transition-colors"
              >
                {cat.name}
              </Link>
            ))}

            <hr className="my-2 border-slate-100" />

            <div className="pt-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              সহায়তা ও লিংক
            </div>

            <Link
              href="/track"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 py-2 px-3 text-xs font-medium text-slate-700 hover:text-sky-600 rounded-xl"
            >
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>অর্ডার ট্র্যাক করুন</span>
            </Link>
            <Link
              href="/account"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 py-2 px-3 text-xs font-medium text-slate-700 hover:text-sky-600 rounded-xl"
            >
              <UserIcon className="w-4 h-4 text-slate-400" />
              <span>আমার অ্যাকাউন্ট</span>
            </Link>
            <Link
              href="/account/wishlist"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 py-2 px-3 text-xs font-medium text-slate-700 hover:text-sky-600 rounded-xl"
            >
              <Heart className="w-4 h-4 text-slate-400" />
              <span>পছন্দের তালিকা</span>
            </Link>

            <hr className="my-2 border-slate-100" />

            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 py-2 px-3 text-xs font-bold text-slate-600 hover:text-sky-700 rounded-xl"
            >
              <ShieldCheck className="w-4 h-4 text-sky-600" />
              <span>এডমিন পোর্টাল</span>
            </Link>
          </div>
        </div>
      </div>,
      document.body
    )}
  </>
  );
}
