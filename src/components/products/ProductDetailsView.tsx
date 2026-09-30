"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShoppingCart,
  Zap,
  Heart,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  Share2,
  Home,
  ShoppingBag,
} from "lucide-react";
import { ProductItem, ProductVariant } from "@/types/ecommerce";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { formatBDT } from "@/lib/utils/formatters";
import { toast } from "sonner";

interface Props {
  product: ProductItem;
}

export function ProductDetailsView({ product }: Props) {
  const router = useRouter();
  const { addToCart, totalItemsCount } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [selectedImage, setSelectedImage] = useState(
    product.images?.[0]?.url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80"
  );
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.hasVariants && product.variants?.length > 0 ? product.variants[0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"desc" | "specs" | "delivery" | "reviews">("desc");

  // Review submission state
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // Authoritative dynamic pricing
  const currentPrice = selectedVariant
    ? selectedVariant.salePrice && selectedVariant.salePrice < selectedVariant.regularPrice
      ? selectedVariant.salePrice
      : selectedVariant.regularPrice
    : product.salePrice && product.salePrice < product.regularPrice
    ? product.salePrice
    : product.regularPrice;

  const originalPrice = selectedVariant
    ? selectedVariant.regularPrice
    : product.regularPrice;

  const isSale = currentPrice < originalPrice;
  const discountPercent = isSale
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  const currentStock = selectedVariant ? selectedVariant.stock : product.stock;
  const isOutOfStock = currentStock <= 0;

  const inWishlist = isInWishlist((product.id || product._id)!);

  const handleAddToCart = () => {
    if (isOutOfStock) {
      toast.error("পণ্যটি বর্তমানে স্টকে নেই");
      return;
    }

    addToCart({
      productId: (product.id || product._id)!,
      productName: product.nameBn,
      slug: product.slug,
      sku: selectedVariant ? selectedVariant.sku : product.sku,
      variantId: selectedVariant?.id,
      variantTitle: selectedVariant?.title,
      image: selectedImage,
      quantity,
      unitPrice: currentPrice,
      finalPrice: currentPrice * quantity,
      maxStock: currentStock,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/checkout");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.nameBn,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("লিংক কপি করা হয়েছে!");
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewTitle || !reviewComment) {
      toast.error("শিরোনাম ও বিস্তারিত মতামত দিন");
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id || product._id,
          customerName: reviewName || "সন্তুষ্ট ক্রেতা",
          rating: reviewRating,
          title: reviewTitle,
          comment: reviewComment,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "রিভিউ জমা হয়েছে!");
        setReviewTitle("");
        setReviewComment("");
        setReviewName("");
      } else {
        toast.error(data.error || "ত্রুটি হয়েছে");
      }
    } catch {
      toast.error("সার্ভারে সমস্যা হয়েছে");
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="space-y-12">
      {/* Product Main Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left: Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-white border border-slate-200/80 shadow-xs">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedImage}
              alt={product.nameBn}
              className="w-full h-full object-cover object-center"
            />
            {isSale && discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-rose-600 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-md">
                -{discountPercent}% ছাড়
              </span>
            )}
            <button
              onClick={handleShare}
              className="absolute top-4 right-4 p-2.5 bg-white/80 backdrop-blur-md rounded-full text-slate-700 hover:text-sky-600 shadow-xs transition-colors"
              title="শেয়ার করুন"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img.url)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 shrink-0 transition-all ${
                    selectedImage === img.url
                      ? "border-sky-600 shadow-md scale-105"
                      : "border-slate-200 opacity-70 hover:opacity-100"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info & Purchase Actions */}
        <div className="lg:col-span-6 space-y-6">
          {/* Category & Ratings */}
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-extrabold tracking-wider text-sky-700 bg-sky-50 px-3 py-1 rounded-full">
              {product.category}
            </span>
            <div className="flex items-center gap-1.5 text-amber-500 text-sm font-bold">
              <Star className="w-4 h-4 fill-current" />
              <span>{product.rating || 5}</span>
              <span className="text-slate-400 font-normal">
                ({product.reviewCount || 0} টি রিভিউ)
              </span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
            {product.nameBn}
          </h1>

          <p className="text-xs text-slate-500 font-mono">
            SKU: {selectedVariant ? selectedVariant.sku : product.sku}
          </p>

          {/* Pricing */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-sky-700">
              {formatBDT(currentPrice)}
            </span>
            {isSale && (
              <>
                <span className="text-base text-slate-400 line-through">
                  {formatBDT(originalPrice)}
                </span>
                <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                  আপনি সাশ্রয় করছেন {formatBDT(originalPrice - currentPrice)}!
                </span>
              </>
            )}
          </div>

          {/* Short Description */}
          {product.shortDescription && (
            <p className="text-sm text-slate-600 leading-relaxed">
              {product.shortDescription}
            </p>
          )}

          {/* Variants Selector */}
          {product.hasVariants && product.variants?.length > 0 && (
            <div className="space-y-3 pt-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                ভ্যারিয়েন্ট নির্বাচন করুন:
              </label>
              <div className="flex flex-wrap gap-2.5">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => {
                      setSelectedVariant(v);
                      if (v.image) setSelectedImage(v.image);
                    }}
                    className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                      selectedVariant?.id === v.id
                        ? "bg-sky-600 text-white border-sky-600 shadow-md scale-105"
                        : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {v.title} — {formatBDT(v.salePrice || v.regularPrice)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock Display */}
          <div className="flex items-center gap-2 text-xs font-semibold">
            {isOutOfStock ? (
              <span className="text-rose-600 bg-rose-50 px-3 py-1 rounded-full">
                ✕ স্টক শেষ
              </span>
            ) : (
              <span className="text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                স্টকে আছে ({currentStock} টি অবশিষ্ট)
              </span>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4 pt-2">
            <span className="text-xs font-bold text-slate-700">পরিমাণ:</span>
            <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 font-bold"
              >
                -
              </button>
              <span className="px-4 py-1.5 text-xs font-bold text-slate-900 min-w-[36px] text-center">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(currentStock, q + 1))}
                disabled={quantity >= currentStock}
                className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 font-bold disabled:opacity-50"
              >
                +
              </button>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              disabled={isOutOfStock}
              onClick={handleAddToCart}
              className="flex-1 py-4 px-6 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>কার্টে যোগ করুন</span>
            </button>

            <button
              type="button"
              disabled={isOutOfStock}
              onClick={handleBuyNow}
              className="flex-1 py-4 px-6 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-200 disabled:text-slate-400 text-slate-950 font-extrabold rounded-2xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              <Zap className="w-5 h-5 fill-current" />
              <span>এখনই কিনুন</span>
            </button>

            <button
              type="button"
              onClick={() =>
                toggleWishlist({
                  productId: (product.id || product._id)!,
                  nameBn: product.nameBn,
                  slug: product.slug,
                  price: currentPrice,
                  image: selectedImage,
                  inStock: !isOutOfStock,
                })
              }
              className={`p-4 rounded-2xl border transition-colors flex items-center justify-center ${
                inWishlist
                  ? "bg-rose-50 border-rose-200 text-rose-600"
                  : "bg-white border-slate-200 text-slate-600 hover:text-rose-600"
              }`}
              title="পছন্দের তালিকা"
            >
              <Heart className={`w-5 h-5 ${inWishlist ? "fill-current" : ""}`} />
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-slate-600 text-xs text-center">
            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <Truck className="w-4 h-4 mx-auto text-sky-600" />
              <span className="font-semibold block">দ্রুত ডেলিভারি</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <ShieldCheck className="w-4 h-4 mx-auto text-emerald-600" />
              <span className="font-semibold block">ক্যাশ অন ডেলিভারি</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <RotateCcw className="w-4 h-4 mx-auto text-amber-600" />
              <span className="font-semibold block">সহজ রিটার্ন</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Description, Specs, Delivery, Reviews */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="flex border-b border-slate-200 overflow-x-auto text-sm font-bold">
          <button
            onClick={() => setActiveTab("desc")}
            className={`py-4 px-6 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "desc"
                ? "border-sky-600 text-sky-700 bg-sky-50/50"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            পণ্যের বিবরণ
          </button>
          <button
            onClick={() => setActiveTab("specs")}
            className={`py-4 px-6 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "specs"
                ? "border-sky-600 text-sky-700 bg-sky-50/50"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            স্পেসিফিকেশন ও তথ্য
          </button>
          <button
            onClick={() => setActiveTab("delivery")}
            className={`py-4 px-6 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "delivery"
                ? "border-sky-600 text-sky-700 bg-sky-50/50"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            ডেলিভারি ও রিটার্ন নীতিমালা
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`py-4 px-6 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "reviews"
                ? "border-sky-600 text-sky-700 bg-sky-50/50"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            গ্রাহক মতামত ও রিভিউ ({product.reviewCount || 0})
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {activeTab === "desc" && (
            <div className="prose max-w-none text-slate-700 leading-relaxed space-y-4">
              <p>{product.description}</p>
            </div>
          )}

          {activeTab === "specs" && (
            <div className="max-w-xl">
              <table className="w-full text-xs sm:text-sm">
                <tbody className="divide-y divide-slate-100">
                  <tr className="py-2.5">
                    <td className="py-2.5 font-bold text-slate-500">প্রোডাক্ট কোড</td>
                    <td className="py-2.5 text-slate-800">{product.productCode}</td>
                  </tr>
                  <tr className="py-2.5">
                    <td className="py-2.5 font-bold text-slate-500">ব্র্যান্ড</td>
                    <td className="py-2.5 text-slate-800">{product.brand || "স্মার্ট শপ"}</td>
                  </tr>
                  <tr className="py-2.5">
                    <td className="py-2.5 font-bold text-slate-500">ক্যাটাগরি</td>
                    <td className="py-2.5 text-slate-800 capitalize">{product.category}</td>
                  </tr>
                  {product.attributes?.map((attr, idx) => (
                    <tr key={idx} className="py-2.5">
                      <td className="py-2.5 font-bold text-slate-500">{attr.name}</td>
                      <td className="py-2.5 text-slate-800">{attr.values.join(", ")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "delivery" && (
            <div className="space-y-4 text-sm text-slate-600">
              <h4 className="font-bold text-slate-900">ডেলিভারি চার্জ ও সময়:</h4>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>ঢাকার ভেতরে: ৬০ টাকা (১-২ কার্যদিবস)</li>
                <li>ঢাকার বাইরে: ১২০ টাকা (২-৪ কার্যদিবস)</li>
                <li>৳১,৫০০ টাকার অধিক অর্ডারে সমগ্র বাংলাদেশে সম্পূর্ণ ফ্রি ডেলিভারি!</li>
              </ul>
              <h4 className="font-bold text-slate-900 pt-3">রিটার্ন পলিসি:</h4>
              <p>
                পণ্য হাতে পাওয়ার পর কোনো ত্রুটি দেখা দিলে বা অসঙ্গতি থাকলে ৭ দিনের মধ্যে আমাদের হেল্পলাইনে যোগাযোগ করে রিটার্ন বা পরিবর্তন করতে পারবেন।
              </p>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-8">
              {/* Write Review Form */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 max-w-xl">
                <h4 className="font-bold text-slate-900 text-base mb-4">
                  আপনার মূল্যবান মতামত দিন
                </h4>
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      রেটিং দিন:
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          type="button"
                          key={num}
                          onClick={() => setReviewRating(num)}
                          className="p-1 text-amber-500"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              num <= reviewRating ? "fill-current" : "text-slate-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      আপনার নাম:
                    </label>
                    <input
                      type="text"
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      placeholder="যেমন: সাকিব হাসান"
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      শিরোনাম:
                    </label>
                    <input
                      type="text"
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      placeholder="যেমন: অসাধারণ মান ও দ্রুত ডেলিভারি!"
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      বিস্তারিত মন্তব্য:
                    </label>
                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      rows={3}
                      placeholder="পণ্যটির গুণগত মান সম্পর্কে আপনার অভিজ্ঞতা লিখুন..."
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs disabled:opacity-50"
                  >
                    {submittingReview ? "জমা হচ্ছে..." : "মতামত সাবমিট করুন"}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Mobile Add To Cart Action Bar (Docked at bottom-0 with iOS safe area) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-3 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-2xl flex items-center gap-2">
        {/* Quick Nav Icons */}
        <Link
          href="/"
          className="p-2 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors shrink-0 flex flex-col items-center"
          title="হোম"
        >
          <Home className="w-4 h-4" />
          <span className="text-[9px] font-medium text-slate-500 mt-0.5">হোম</span>
        </Link>

        <Link
          href="/cart"
          className="relative p-2 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors shrink-0 flex flex-col items-center"
          title="কার্ট"
        >
          <div className="relative">
            <ShoppingBag className="w-4 h-4" />
            {totalItemsCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-amber-500 text-slate-950 text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                {totalItemsCount}
              </span>
            )}
          </div>
          <span className="text-[9px] font-medium text-slate-500 mt-0.5">কার্ট</span>
        </Link>

        {/* Action Buttons */}
        <div className="flex-1 flex items-center gap-1.5 min-w-0">
          <button
            type="button"
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            className="flex-1 py-2.5 px-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold rounded-xl text-xs shadow-xs flex items-center justify-center gap-1 transition-all active:scale-95"
            title="কার্টে যোগ করুন"
          >
            <ShoppingCart className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">কার্ট</span>
          </button>

          <button
            type="button"
            disabled={isOutOfStock}
            onClick={handleBuyNow}
            className="flex-[1.4] py-2.5 px-3 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-200 disabled:text-slate-400 text-slate-950 font-extrabold rounded-xl text-xs shadow-md shadow-amber-500/20 flex items-center justify-center gap-1 transition-all active:scale-95"
          >
            <Zap className="w-3.5 h-3.5 fill-current shrink-0" />
            <span className="truncate">এখনই কিনুন</span>
          </button>
        </div>
      </div>
    </div>
  );
}
