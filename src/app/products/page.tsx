import { connectDB } from "@/lib/db/mongoose";
import { ProductService, ProductFilterQuery } from "@/services/productService";
import { AnnouncementBar } from "@/components/storefront/AnnouncementBar";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { MobileBottomNav } from "@/components/storefront/MobileBottomNav";
import { ProductCard } from "@/components/storefront/ProductCard";
import { MobileFilterDrawer } from "@/components/products/MobileFilterDrawer";
import { ProductItem } from "@/types/ecommerce";
import Link from "next/link";
import { Filter, SlidersHorizontal, ArrowUpDown } from "lucide-react";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
    inStockOnly?: string;
    featured?: string;
    newArrival?: string;
    sort?: "newest" | "price_asc" | "price_desc" | "best_seller" | "rating";
    page?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const filters: ProductFilterQuery = {
    search: params.search,
    category: params.category,
    brand: params.brand,
    minPrice: params.minPrice ? Number(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    inStockOnly: params.inStockOnly === "true",
    featured: params.featured === "true" ? true : undefined,
    newArrival: params.newArrival === "true" ? true : undefined,
    sort: params.sort || "newest",
    page: params.page ? parseInt(params.page, 10) : 1,
    limit: 12,
  };

  let productsData: { products: ProductItem[]; total: number; totalPages: number; page: number } = {
    products: [],
    total: 0,
    totalPages: 1,
    page: 1,
  };

  try {
    await connectDB();
    const res = await ProductService.getProducts(filters);
    productsData = {
      products: JSON.parse(JSON.stringify(res.products)),
      total: res.total,
      totalPages: res.totalPages,
      page: res.page,
    };
  } catch (err) {
    console.error("Products query error:", err);
  }

  const { products, total, totalPages, page } = productsData;

  const categories = [
    { name: "সকল ক্যাটাগরি", slug: "" },
    { name: "ফ্যাশন ও পোশাক", slug: "fashion" },
    { name: "ইলেকট্রনিক্স ও গ্যাজেট", slug: "electronics" },
    { name: "কিডস ও বেবি", slug: "kids" },
    { name: "কসমেটিক্স ও স্কিনকেয়ার", slug: "cosmetics" },
    { name: "হোম ও লিভিং", slug: "home-living" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Breadcrumb & Header */}
        <div className="mb-6">
          <nav className="text-xs text-slate-500 mb-2 flex items-center gap-1.5">
            <Link href="/" className="hover:text-sky-600">হোম</Link>
            <span>/</span>
            <span className="text-slate-800 font-medium">পণ্য তালিকা</span>
            {filters.category && (
              <>
                <span>/</span>
                <span className="text-sky-700 font-bold capitalize">{filters.category}</span>
              </>
            )}
            {filters.search && (
              <>
                <span>/</span>
                <span className="text-sky-700 font-bold">অনুসন্ধান: &quot;{filters.search}&quot;</span>
              </>
            )}
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {filters.search
                  ? `"${filters.search}" এর অনুসন্ধান ফলাফল`
                  : filters.category
                  ? categories.find((c) => c.slug === filters.category)?.name || "ক্যাটাগরি পণ্য"
                  : "সকল পণ্য সম্ভার"}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                মোট {total} টি পণ্য পাওয়া গেছে
              </p>
            </div>

            {/* Mobile Filter & Sort Controls */}
            <div className="flex flex-wrap items-center gap-2">
              <MobileFilterDrawer
                categories={categories}
                currentCategory={filters.category}
                currentSort={filters.sort}
                inStockOnly={filters.inStockOnly}
                search={filters.search}
                totalProducts={total}
              />

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 max-w-full">
                <span className="text-xs text-slate-500 font-medium hidden sm:flex items-center gap-1">
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  সর্ট:
                </span>
                <div className="flex items-center gap-1">
                  {[
                    { label: "নতুন", val: "newest" },
                    { label: "জনপ্রিয়", val: "best_seller" },
                    { label: "মূল্য: কম", val: "price_asc" },
                    { label: "মূল্য: বেশি", val: "price_desc" },
                  ].map((s) => (
                    <Link
                      key={s.val}
                      href={`/products?${new URLSearchParams({
                        ...(filters.search ? { search: filters.search } : {}),
                        ...(filters.category ? { category: filters.category } : {}),
                        sort: s.val,
                      }).toString()}`}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                        filters.sort === s.val
                          ? "bg-sky-600 text-white shadow-xs"
                          : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {s.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Layout: Filters + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block lg:col-span-1 space-y-6 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs h-fit sticky top-24">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-100 font-bold text-slate-900">
              <SlidersHorizontal className="w-4 h-4 text-sky-600" />
              <span>ফিল্টার ও বাছবিচার</span>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                ক্যাটাগরি
              </h3>
              <div className="space-y-1.5">
                {categories.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/products?${new URLSearchParams({
                      ...(c.slug ? { category: c.slug } : {}),
                      ...(filters.sort ? { sort: filters.sort } : {}),
                    }).toString()}`}
                    className={`block px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                      (filters.category || "") === c.slug
                        ? "bg-sky-50 text-sky-700 font-bold"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Stock Filter */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                স্টক উপস্থিতি
              </h3>
              <Link
                href={`/products?${new URLSearchParams({
                  ...(filters.category ? { category: filters.category } : {}),
                  ...(filters.search ? { search: filters.search } : {}),
                  inStockOnly: filters.inStockOnly ? "false" : "true",
                }).toString()}`}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border ${
                  filters.inStockOnly
                    ? "bg-emerald-50 text-emerald-700 border-emerald-300 font-bold"
                    : "bg-white text-slate-600 border-slate-200"
                }`}
              >
                <span>{filters.inStockOnly ? "✓ স্টকে থাকা পণ্যসমূহ" : "সব পণ্য (স্টক আউটসহ)"}</span>
              </Link>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="lg:col-span-3">
            {products.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs max-w-xl mx-auto my-8">
                <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-4">
                  <Filter className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  কোনো পণ্য পাওয়া যায়নি
                </h3>
                <p className="text-sm text-slate-500 mb-6">
                  আপনার অনুসন্ধানকৃত মানদণ্ডের সাথে মিলে এমন কোনো পণ্য পাওয়া যায়নি। দয়া করে অন্য কোনো শব্দ দিয়ে খুঁজুন অথবা ফিল্টার রিসেট করুন।
                </p>
                <Link
                  href="/products"
                  className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors inline-block"
                >
                  সকল পণ্য দেখুন
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                  {products.map((p) => (
                    <ProductCard key={p.id || p._id} product={p} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12">
                    {Array.from({ length: totalPages }).map((_, i) => {
                      const pageNum = i + 1;
                      return (
                        <Link
                          key={pageNum}
                          href={`/products?${new URLSearchParams({
                            ...(filters.category ? { category: filters.category } : {}),
                            ...(filters.search ? { search: filters.search } : {}),
                            ...(filters.sort ? { sort: filters.sort } : {}),
                            page: String(pageNum),
                          }).toString()}`}
                          className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                            page === pageNum
                              ? "bg-sky-600 text-white shadow-md scale-105"
                              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          {pageNum}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
