import Link from "next/link";
import { ArrowRight } from "lucide-react";

const CATEGORIES = [
  {
    titleBn: "ফ্যাশন ও পোশাক",
    titleEn: "Fashion & Clothing",
    slug: "fashion",
    itemsCount: "১২০+ পণ্য",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&auto=format&fit=crop&q=80",
    color: "from-blue-600 to-indigo-700",
  },
  {
    titleBn: "ইলেকট্রনিক্স ও গ্যাজেট",
    titleEn: "Electronics & Gadgets",
    slug: "electronics",
    itemsCount: "৮৫+ পণ্য",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80",
    color: "from-cyan-600 to-blue-700",
  },
  {
    titleBn: "কিডস ও বেবি আইটেম",
    titleEn: "Kids & Baby",
    slug: "kids",
    itemsCount: "৬০+ পণ্য",
    image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=500&auto=format&fit=crop&q=80",
    color: "from-amber-500 to-orange-600",
  },
  {
    titleBn: "কসমেটিক্স ও স্কিনকেয়ার",
    titleEn: "Cosmetics & Skincare",
    slug: "cosmetics",
    itemsCount: "৯৫+ পণ্য",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&auto=format&fit=crop&q=80",
    color: "from-rose-500 to-pink-600",
  },
  {
    titleBn: "হোম ও লিভিং",
    titleEn: "Home & Living",
    slug: "home-living",
    itemsCount: "৫০+ পণ্য",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500&auto=format&fit=crop&q=80",
    color: "from-emerald-600 to-teal-700",
  },
  {
    titleBn: "জুতো ও এক্সেসরিজ",
    titleEn: "Shoes & Accessories",
    slug: "accessories",
    itemsCount: "৭০+ পণ্য",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&auto=format&fit=crop&q=80",
    color: "from-violet-600 to-purple-700",
  },
];

export function CategoryGrid() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-sky-600 font-bold text-xs sm:text-sm tracking-wider uppercase block mb-1">
              জনপ্রিয় ক্যাটাগরি
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              পছন্দের বিভাগ থেকে বেছে নিন
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-sky-600 hover:text-sky-700 group"
          >
            <span>সকল ক্যাটাগরি দেখুন</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col text-center"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-slate-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cat.image}
                  alt={cat.titleBn}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-3 left-2 right-2 text-white">
                  <h3 className="font-bold text-sm sm:text-base leading-tight drop-shadow-xs">
                    {cat.titleBn}
                  </h3>
                  <span className="text-[11px] text-slate-200 opacity-90 block mt-0.5">
                    {cat.itemsCount}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
