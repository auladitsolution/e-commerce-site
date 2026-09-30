import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db/mongoose";
import { ProductService } from "@/services/productService";
import { AnnouncementBar } from "@/components/storefront/AnnouncementBar";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { MobileBottomNav } from "@/components/storefront/MobileBottomNav";
import { ProductDetailsView } from "@/components/products/ProductDetailsView";
import { ProductCard } from "@/components/storefront/ProductCard";
import { ProductItem } from "@/types/ecommerce";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    await connectDB();
    const product = await ProductService.getProductBySlug(slug);
    if (!product) {
      return { title: "পণ্য পাওয়া যায়নি" };
    }
    return {
      title: product.nameBn,
      description: product.shortDescription || product.description.slice(0, 160),
      openGraph: {
        title: `${product.nameBn} | স্মার্ট শপ বাংলাদেশ`,
        description: product.shortDescription,
        images: product.images?.[0]?.url ? [product.images[0].url] : [],
      },
    };
  } catch {
    return { title: "পণ্য বিবরণ" };
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;

  await connectDB();
  const productDoc = await ProductService.getProductBySlug(slug);

  if (!productDoc) {
    notFound();
  }

  const product = JSON.parse(JSON.stringify(productDoc)) as ProductItem;
  const relatedDocs = await ProductService.getRelatedProducts(
    product.category,
    product.id || product._id,
    4
  );
  const relatedProducts = JSON.parse(JSON.stringify(relatedDocs)) as ProductItem[];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <ProductDetailsView product={product} />

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 pt-12 border-t border-slate-200/80">
            <div className="mb-6">
              <span className="text-xs font-bold text-sky-600 uppercase tracking-wider block">
                সম্পর্কিত পণ্য
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900">
                আপনার এটিও পছন্দ হতে পারে
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id || p._id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
