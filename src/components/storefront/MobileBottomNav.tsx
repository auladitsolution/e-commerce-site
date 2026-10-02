"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid, Heart, ShoppingBag, User } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useAuth } from "@/hooks/useAuth";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { totalItemsCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { user } = useAuth();

  // Hide on admin routes and single product detail view (where sticky purchase bar takes priority)
  if (
    pathname?.startsWith("/admin") ||
    (pathname?.startsWith("/products/") && pathname !== "/products")
  ) {
    return null;
  }

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 mobile-action-bar py-1.5 px-3">
      <div className="flex items-center justify-around">
        <Link
          href="/"
          className={`flex flex-col items-center py-1 px-3 text-xs font-medium transition-colors ${
            pathname === "/" ? "text-sky-600" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span>হোম</span>
        </Link>

        <Link
          href="/products"
          className={`flex flex-col items-center py-1 px-3 text-xs font-medium transition-colors ${
            pathname?.startsWith("/products")
              ? "text-sky-600"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Grid className="w-5 h-5 mb-0.5" />
          <span>শপ</span>
        </Link>

        <Link
          href="/account/wishlist"
          className={`relative flex flex-col items-center py-1 px-3 text-xs font-medium transition-colors ${
            pathname?.includes("wishlist")
              ? "text-sky-600"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <div className="relative">
            <Heart className="w-5 h-5 mb-0.5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {wishlistCount}
              </span>
            )}
          </div>
          <span>পছন্দ</span>
        </Link>

        <Link
          href="/cart"
          className={`relative flex flex-col items-center py-1 px-3 text-xs font-medium transition-colors ${
            pathname === "/cart" ? "text-sky-600" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 mb-0.5" />
            {totalItemsCount > 0 && (
              <span className="absolute -top-1 -right-2.5 bg-amber-500 text-slate-950 text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-extrabold">
                {totalItemsCount}
              </span>
            )}
          </div>
          <span>কার্ট</span>
        </Link>

        <Link
          href={user || pathname?.startsWith("/account") ? "/account" : `/account?returnUrl=${encodeURIComponent(pathname || "/")}`}
          className={`flex flex-col items-center py-1 px-3 text-xs font-medium transition-colors ${
            pathname?.startsWith("/account") && !pathname.includes("wishlist")
              ? "text-sky-600"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <User className="w-5 h-5 mb-0.5" />
          <span>অ্যাকাউন্ট</span>
        </Link>
      </div>
    </nav>
  );
}
