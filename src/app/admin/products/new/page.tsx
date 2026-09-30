"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Upload, Plus, Trash2, Save } from "lucide-react";
import { toast } from "sonner";

export default function NewProductPage() {
  const router = useRouter();

  // Basic Info
  const [nameBn, setNameBn] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [slug, setSlug] = useState("");
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState("fashion");
  const [brand, setBrand] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");

  // Pricing & Stock
  const [regularPrice, setRegularPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [stock, setStock] = useState("");
  const [minimumStock, setMinimumStock] = useState("5");

  // Images
  const [imageUrl, setImageUrl] = useState("");
  const [images, setImages] = useState<{ url: string; isPrimary: boolean }[]>([]);
  const [uploading, setUploading] = useState(false);

  // Flags
  const [featured, setFeatured] = useState(false);
  const [newArrival, setNewArrival] = useState(true);
  const [bestSeller, setBestSeller] = useState(false);

  // Variants
  const [hasVariants, setHasVariants] = useState(false);
  const [variants, setVariants] = useState<
    { id: string; title: string; sku: string; regularPrice: number; salePrice?: number; stock: number; active: boolean }[]
  >([]);
  const [variantTitle, setVariantTitle] = useState("");
  const [variantSku, setVariantSku] = useState("");
  const [variantPrice, setVariantPrice] = useState("");
  const [variantStock, setVariantStock] = useState("");

  const [saving, setSaving] = useState(false);

  const handleNameEnChange = (val: string) => {
    setNameEn(val);
    setSlug(
      val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
    );
  };

  const handleAddImage = () => {
    if (!imageUrl.trim()) return;
    setImages([...images, { url: imageUrl.trim(), isPrimary: images.length === 0 }]);
    setImageUrl("");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "ecommerce/products");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setImages([...images, { url: data.url, isPrimary: images.length === 0 }]);
        toast.success("ছবি আপলোড সম্পন্ন হয়েছে!");
      } else {
        toast.error(data.error || "আপলোড ব্যর্থ হয়েছে");
      }
    } catch {
      toast.error("সার্ভার ত্রুটি");
    } finally {
      setUploading(false);
    }
  };

  const handleAddVariant = () => {
    if (!variantTitle || !variantSku || !variantPrice || !variantStock) {
      toast.error("ভ্যারিয়েন্টের টাইটেল, SKU, মূল্য ও স্টক দিন");
      return;
    }

    setVariants([
      ...variants,
      {
        id: `v_${Date.now()}`,
        title: variantTitle.trim(),
        sku: variantSku.trim().toUpperCase(),
        regularPrice: Number(variantPrice),
        stock: Number(variantStock),
        active: true,
      },
    ]);

    setVariantTitle("");
    setVariantSku("");
    setVariantPrice("");
    setVariantStock("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nameBn.trim() || !nameEn.trim() || !sku.trim() || !regularPrice) {
      toast.error("প্রয়োজনীয় তথ্যসমূহ সঠিকভাবে পূরণ করুন");
      return;
    }

    if (images.length === 0) {
      toast.error("কমপক্ষে একটি ছবি যোগ করুন");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        productCode: `PROD-${Date.now().toString().slice(-4)}`,
        sku: sku.trim().toUpperCase(),
        nameBn: nameBn.trim(),
        nameEn: nameEn.trim(),
        slug: slug.trim() || `prod-${Date.now()}`,
        shortDescription: shortDescription.trim() || undefined,
        description: description.trim(),
        category,
        brand: brand.trim() || undefined,
        tags: [category, brand.trim()].filter(Boolean),
        images,
        regularPrice: Number(regularPrice),
        salePrice: salePrice ? Number(salePrice) : undefined,
        costPrice: costPrice ? Number(costPrice) : undefined,
        stock: hasVariants && variants.length > 0 ? variants.reduce((s, v) => s + v.stock, 0) : Number(stock || 0),
        minimumStock: Number(minimumStock || 5),
        trackInventory: true,
        hasVariants,
        variants: hasVariants ? variants : [],
        featured,
        newArrival,
        bestSeller,
        active: true,
      };

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("পণ্য সফলভাবে তৈরি করা হয়েছে!");
        router.push("/admin/products");
      } else {
        toast.error(data.error || "পণ্য সংরক্ষণ করা যায়নি");
      }
    } catch {
      toast.error("সার্ভার ত্রুটি");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/products"
          className="p-2 bg-white rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">নতুন পণ্য যোগ করুন</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            পণ্যের বিবরণ, ছবি, দাম, ভ্যারিয়েন্ট ও ইনভেন্টরি তথ্য পূরণ করুন
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            ১. প্রাথমিক তথ্য
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                পণ্যের নাম (বাংলায়) <span className="text-rose-500">*</span>:
              </label>
              <input
                type="text"
                value={nameBn}
                onChange={(e) => setNameBn(e.target.value)}
                placeholder="যেমন: প্রিমিয়াম সুতি ফর্মাল শার্ট"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                পণ্যের নাম (English) <span className="text-rose-500">*</span>:
              </label>
              <input
                type="text"
                value={nameEn}
                onChange={(e) => handleNameEnChange(e.target.value)}
                placeholder="e.g. Premium Cotton Formal Shirt"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                SKU কোড <span className="text-rose-500">*</span>:
              </label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value.toUpperCase())}
                placeholder="SHIRT-COTTON-01"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono uppercase focus:ring-2 focus:ring-sky-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                ক্যাটাগরি <span className="text-rose-500">*</span>:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
              >
                <option value="fashion">ফ্যাশন ও পোশাক</option>
                <option value="electronics">ইলেকট্রনিক্স ও গ্যাজেট</option>
                <option value="kids">কিডস ও বেবি</option>
                <option value="cosmetics">কসমেটিক্স ও স্কিনকেয়ার</option>
                <option value="home-living">হোম ও লিভিং</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                ব্র্যান্ড (যদি থাকে):
              </label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="যেমন: Aarong / Mi"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              সংক্ষিপ্ত বিবরণ (Short Description):
            </label>
            <input
              type="text"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="পণ্যের এক লাইনের আকর্ষণীয় বর্ণনা..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              বিস্তারিত বিবরণ <span className="text-rose-500">*</span>:
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="পণ্যের সুবিধা, উপাদান ও ব্যবহারের বিবরণ লিখুন..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
              required
            />
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            ২. মূল্য ও ইনভেন্টরি
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                নিয়মিত মূল্য (৳) <span className="text-rose-500">*</span>:
              </label>
              <input
                type="number"
                value={regularPrice}
                onChange={(e) => setRegularPrice(e.target.value)}
                placeholder="1500"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                বিক্রয় মূল্য / অফার মূল্য (৳):
              </label>
              <input
                type="number"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                placeholder="1200"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                ক্রয় মূল্য / খরচ (COGS Snapshot) (৳):
              </label>
              <input
                type="number"
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value)}
                placeholder="800"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                প্রারম্ভিক স্টক সংখ্যা:
              </label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="20"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                কম স্টক সতর্কতা সীমা (Minimum Stock):
              </label>
              <input
                type="number"
                value={minimumStock}
                onChange={(e) => setMinimumStock(e.target.value)}
                placeholder="5"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            ৩. পণ্যের ছবি (Cloudinary / URL)
          </h3>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="সরাসরি ছবির ওয়েব লিঙ্ক দিন (https://...)"
              className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddImage}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold"
            >
              লিংক যোগ করুন
            </button>

            <label className="px-4 py-2 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-xl text-xs font-bold border border-sky-200 cursor-pointer flex items-center justify-center gap-1.5">
              <Upload className="w-3.5 h-3.5" />
              <span>{uploading ? "আপলোড হচ্ছে..." : "ডিভাইস থেকে আপলোড"}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>

          {images.length > 0 && (
            <div className="flex flex-wrap gap-3 pt-2">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative w-24 h-24 rounded-2xl overflow-hidden border border-slate-200 group"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setImages(images.filter((_, i) => i !== idx))}
                    className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                  {img.isPrimary && (
                    <span className="absolute bottom-1 left-1 bg-sky-600 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">
                      মূল ছবি
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Variants Manager */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-sm font-bold text-slate-900">
              ৪. প্রোডাক্ট ভ্যারিয়েন্ট (যেমন: Size, Color)
            </h3>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={hasVariants}
                onChange={(e) => setHasVariants(e.target.checked)}
                className="rounded text-sky-600"
              />
              <span>ভ্যারিয়েন্ট রয়েছে</span>
            </label>
          </div>

          {hasVariants && (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                <input
                  type="text"
                  value={variantTitle}
                  onChange={(e) => setVariantTitle(e.target.value)}
                  placeholder="টাইটেল (যেমন: M / Black)"
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
                <input
                  type="text"
                  value={variantSku}
                  onChange={(e) => setVariantSku(e.target.value.toUpperCase())}
                  placeholder="SKU (SHIRT-M)"
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                />
                <input
                  type="number"
                  value={variantPrice}
                  onChange={(e) => setVariantPrice(e.target.value)}
                  placeholder="মূল্য (৳)"
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={variantStock}
                    onChange={(e) => setVariantStock(e.target.value)}
                    placeholder="স্টক"
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddVariant}
                    className="px-3 py-2 bg-sky-600 text-white rounded-xl text-xs font-bold"
                  >
                    যোগ
                  </button>
                </div>
              </div>

              {variants.length > 0 && (
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                  {variants.map((v, i) => (
                    <div key={v.id} className="p-3 flex items-center justify-between text-xs bg-white">
                      <div>
                        <span className="font-bold text-slate-800">{v.title}</span>
                        <span className="text-slate-400 font-mono ml-2">SKU: {v.sku}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-bold">৳{v.regularPrice}</span>
                        <span className="bg-slate-100 px-2 py-0.5 rounded font-bold">স্টক: {v.stock}</span>
                        <button
                          type="button"
                          onClick={() => setVariants(variants.filter((_, idx) => idx !== i))}
                          className="text-rose-500 hover:text-rose-700"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link
            href="/admin/products"
            className="px-6 py-3 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl"
          >
            বাতিল
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs shadow-md transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "সংরক্ষণ হচ্ছে..." : "পণ্য সংরক্ষণ করুন"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
