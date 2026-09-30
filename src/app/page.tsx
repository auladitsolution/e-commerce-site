import { connectDB } from "@/lib/db/mongoose";
import { Product } from "@/models/Product";
import { getStoreSettings } from "@/models/StoreSettings";
import { AnnouncementBar } from "@/components/storefront/AnnouncementBar";
import { Header } from "@/components/storefront/Header";
import { HeroSlider } from "@/components/storefront/HeroSlider";
import { CategoryGrid } from "@/components/storefront/CategoryGrid";
import { FlashSaleSection } from "@/components/storefront/FlashSaleSection";
import { ProductCard } from "@/components/storefront/ProductCard";
import { TrustBadges } from "@/components/storefront/TrustBadges";
import { Newsletter } from "@/components/storefront/Newsletter";
import { Footer } from "@/components/storefront/Footer";
import { MobileBottomNav } from "@/components/storefront/MobileBottomNav";
import { seedInitialData } from "@/lib/db/seed";
import Link from "next/link";
import { ArrowRight, Sparkles, Flame } from "lucide-react";
import { ProductItem, StoreSettingsConfig } from "@/types/ecommerce";
import { StoreSettingsProvider } from "@/context/StoreSettingsContext";

export const dynamic = "force-dynamic";

async function getHomepageData() {
  try {
    await connectDB();
    const count = await Product.countDocuments();
    if (count === 0) {
      await seedInitialData();
    }

    const [featured, newArrivals, flashSales, settings] = await Promise.all([
      Product.find({ active: true, featured: true }).limit(8).lean(),
      Product.find({ active: true, newArrival: true }).sort({ createdAt: -1 }).limit(8).lean(),
      Product.find({ active: true, salePrice: { $exists: true, $gt: 0 } }).limit(4).lean(),
      getStoreSettings(),
    ]);

    return {
      featured: JSON.parse(JSON.stringify(featured)) as ProductItem[],
      newArrivals: JSON.parse(JSON.stringify(newArrivals)) as ProductItem[],
      flashSales: JSON.parse(JSON.stringify(flashSales)) as ProductItem[],
      settings: JSON.parse(JSON.stringify(settings)) as StoreSettingsConfig,
    };
  } catch (e) {
    console.error("Database connection fallback for homepage:", e);
    const fallbackSettings = await getStoreSettings().catch(() => null);
    return { featured: [], newArrivals: [], flashSales: [], settings: fallbackSettings };
  }
}

export default async function HomePage() {
  const { featured, newArrivals, flashSales, settings } = await getHomepageData();

  const promo = settings?.promotionalBanner;

  return (
    <StoreSettingsProvider initialSettings={settings}>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <AnnouncementBar />
        <Header />

        <main className="flex-1 pb-16 lg:pb-0">
          <HeroSlider />
          <CategoryGrid />

          {flashSales.length > 0 && <FlashSaleSection products={flashSales} />}

          {/* Featured Products Section */}
          <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
              <div>
                <div className="flex items-center gap-1.5 text-sky-600 font-bold text-xs sm:text-sm tracking-wider uppercase mb-1">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>জনপ্রিয় ও বাছাইকৃত</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  ফিচার্ড কালেকশন (Featured Products)
                </h2>
              </div>
              <Link
                href="/products?featured=true"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-sky-600 hover:text-sky-700 group"
              >
                <span>সকল ফিচার্ড পণ্য দেখুন</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {featured.map((p) => (
                <ProductCard key={p.id || p._id} product={p} />
              ))}
            </div>
          </section>

          {/* Promotional Mid Banner */}
          {promo?.enabled !== false && (
            <section className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-sky-900 via-indigo-950 to-slate-950 text-white p-8 sm:p-12 shadow-xl border border-sky-800/40">
                <div className="relative z-10 max-w-xl space-y-4">
                  {promo?.badge && (
                    <span className="px-3 py-1 bg-amber-400 text-slate-950 rounded-full text-xs font-black uppercase tracking-wider inline-block">
                      {promo.badge}
                    </span>
                  )}
                  <h3 className="text-2xl sm:text-4xl font-extrabold leading-tight">
                    {promo?.title || "বিকাশ অথবা নগদে প্রি-পেমেন্টে বিশেষ ক্যাশব্যাক অফার!"}
                  </h3>
                  <p className="text-slate-300 text-sm sm:text-base">
                    {promo?.description || "যেকোনো অর্ডারে ফ্রি ডেলিভারি পেতে কুপন কোড ব্যবহার করুন: "}{" "}
                    {promo?.couponCode && (
                      <span className="font-mono font-bold text-amber-300 bg-white/10 px-2 py-0.5 rounded">
                        {promo.couponCode}
                      </span>
                    )}
                  </p>
                  <div className="pt-2">
                    <Link
                      href={promo?.buttonLink || "/products"}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-950 hover:bg-slate-100 font-bold rounded-xl text-sm transition-all shadow-md"
                    >
                      <span>{promo?.buttonText || "অফার পণ্য দেখুন"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* New Arrivals Section */}
          <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
              <div>
                <div className="flex items-center gap-1.5 text-rose-600 font-bold text-xs sm:text-sm tracking-wider uppercase mb-1">
                  <Flame className="w-4 h-4 text-rose-500 fill-current" />
                  <span>সদ্য আগমনী</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  নতুন পণ্য সম্ভার (New Arrivals)
                </h2>
              </div>
              <Link
                href="/products?newArrival=true"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-sky-600 hover:text-sky-700 group"
              >
                <span>সকল নতুন পণ্য</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {newArrivals.map((p) => (
                <ProductCard key={p.id || p._id} product={p} />
              ))}
            </div>
          </section>

          <TrustBadges />
          <Newsletter />
        </main>

        <Footer />
        <MobileBottomNav />
      </div>
    </StoreSettingsProvider>
  );
}
