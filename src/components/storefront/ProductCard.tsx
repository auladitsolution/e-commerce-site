"use client";

import Link from "next/link";
import { ShoppingCart, Heart, Star, Check } from "lucide-react";
import { ProductItem } from "@/types/ecommerce";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { formatBDT } from "@/lib/utils/formatters";

export function ProductCard({ product }: { product: ProductItem }) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isSale = product.salePrice && product.salePrice < product.regularPrice;
  const currentPrice = isSale ? product.salePrice! : product.regularPrice;
  const discountPercent = isSale
    ? Math.round(((product.regularPrice - product.salePrice!) / product.regularPrice) * 100)
    : 0;

  const inWishlist = isInWishlist(product.id || product._id || "");

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.hasVariants && product.variants?.length > 0) {
      // If product has variants, navigate to detail page for selection
      window.location.href = `/products/${product.slug}`;
      return;
    }

    addToCart({
      productId: (product.id || product._id)!,
      productName: product.nameBn,
      slug: product.slug,
      sku: product.sku,
      image: product.images?.[0]?.url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
      quantity: 1,
      unitPrice: currentPrice,
      finalPrice: currentPrice,
      maxStock: product.stock,
    });
  };

  const imageUrl = product.images?.[0]?.url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80";

  return (
    <div className="group relative bg-white rounded-xl sm:rounded-2xl border border-slate-200/80 hover:border-sky-300 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
      {/* Badges & Wishlist */}
      <div className="relative aspect-square w-full bg-slate-50 overflow-hidden">
        <Link href={`/products/${product.slug}`} className="block w-full h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={product.nameBn}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </Link>

        {/* Discount Badge */}
        {isSale && discountPercent > 0 && (
          <span className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 bg-rose-600 text-white text-[10px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full shadow-xs">
            -{discountPercent}%
          </span>
        )}

        {/* Out of Stock Badge */}
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 text-center">
            <span className="bg-red-500 text-white font-bold text-[10px] sm:text-xs px-2 sm:px-3 py-1 rounded-full shadow-md">
              স্টক শেষ
            </span>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={() =>
            toggleWishlist({
              productId: (product.id || product._id)!,
              nameBn: product.nameBn,
              slug: product.slug,
              price: currentPrice,
              image: imageUrl,
              inStock: product.stock > 0,
            })
          }
          className={`absolute top-2 right-2 sm:top-2.5 sm:right-2.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all ${
            inWishlist
              ? "bg-rose-50 text-rose-600 shadow-sm"
              : "bg-white/90 hover:bg-white text-slate-500 hover:text-rose-600 shadow-xs backdrop-blur-xs"
          }`}
          aria-label="Wishlist"
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${inWishlist ? "fill-current" : ""}`} />
        </button>
      </div>

      {/* Info Content */}
      <div className="p-2.5 sm:p-4 flex flex-col flex-1 justify-between gap-2 sm:gap-3">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-[10px] sm:text-xs text-slate-500 mb-1">
            <span className="uppercase tracking-wider font-semibold text-[9px] sm:text-[10px] text-sky-700 bg-sky-50 px-1.5 sm:px-2 py-0.5 rounded">
              {product.category}
            </span>
            <div className="flex items-center gap-0.5 sm:gap-1 text-amber-500">
              <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
              <span className="font-bold text-slate-700 text-[10px] sm:text-xs">{product.rating || 5}</span>
              {product.reviewCount > 0 && (
                <span className="text-slate-400 text-[9px] sm:text-[10px]">({product.reviewCount})</span>
              )}
            </div>
          </div>

          {/* Title */}
          <Link
            href={`/products/${product.slug}`}
            className="block font-semibold text-slate-800 hover:text-sky-600 text-xs sm:text-sm line-clamp-2 leading-tight sm:leading-snug transition-colors min-h-[2rem] sm:min-h-[2.5rem]"
          >
            {product.nameBn}
          </Link>
        </div>

        {/* Pricing & Cart Action */}
        <div className="pt-1.5 sm:pt-2 border-t border-slate-100 flex items-center justify-between gap-1 sm:gap-2">
          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline gap-1 sm:gap-1.5">
              <span className="text-xs sm:text-base font-bold text-slate-900 whitespace-nowrap">
                {formatBDT(currentPrice)}
              </span>
              {isSale && (
                <span className="text-[10px] sm:text-xs text-slate-400 line-through whitespace-nowrap">
                  {formatBDT(product.regularPrice)}
                </span>
              )}
            </div>
            <p className="text-[10px] sm:text-[11px] text-emerald-600 font-medium truncate">
              {product.stock > 0 ? "✓ স্টকে আছে" : "স্টক আউট"}
            </p>
          </div>

          <button
            type="button"
            disabled={product.stock <= 0}
            onClick={handleQuickAdd}
            className={`p-2 sm:p-2.5 rounded-lg sm:rounded-xl font-medium shrink-0 transition-all flex items-center justify-center ${
              product.stock <= 0
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-sky-600 hover:bg-sky-700 text-white shadow-xs hover:shadow-md active:scale-95"
            }`}
            title="কার্টে যোগ করুন"
            aria-label="Add to cart"
          >
            <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
