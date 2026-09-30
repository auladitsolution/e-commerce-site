"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, Edit, Trash2, CheckCircle2, XCircle, Package } from "lucide-react";
import { formatBDT } from "@/lib/utils/formatters";
import { ProductItem } from "@/types/ecommerce";
import { toast } from "sonner";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchProducts = async (q = "") => {
    setLoading(true);
    try {
      const url = q ? `/api/products?search=${encodeURIComponent(q)}&limit=50` : "/api/products?limit=50";
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) {
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts(search.trim());
  };

  const handleDeactivate = async (id: string, name: string) => {
    if (!confirm(`আপনি কি "${name}" নিষ্ক্রিয় করতে চান?`)) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("পণ্য নিষ্ক্রিয় করা হয়েছে");
        fetchProducts(search.trim());
      } else {
        toast.error("ব্যর্থ হয়েছে");
      }
    } catch {
      toast.error("সার্ভার ত্রুটি");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">পণ্য তালিকা ও ব্যবস্থাপনা</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            স্টোরের সকল পণ্যের মূল্য, স্টক, ছবি ও ভ্যারিয়েন্ট পরিচালনা করুন
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন পণ্য যোগ করুন</span>
        </Link>
      </div>

      {/* Search & Filter Bar */}
      <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
        <div className="relative flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="নাম বা SKU দিয়ে খুঁজুন..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
        >
          খুঁজুন
        </button>
      </form>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p>কোনো পণ্য পাওয়া যায়নি</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">পণ্য</th>
                  <th className="py-3 px-4">SKU / কোড</th>
                  <th className="py-3 px-4">ক্যাটাগরি</th>
                  <th className="py-3 px-4">মূল্য</th>
                  <th className="py-3 px-4">স্টক</th>
                  <th className="py-3 px-4">স্থিতি</th>
                  <th className="py-3 px-4 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => {
                  const id = (p.id || p._id)!;
                  return (
                    <tr key={id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={p.images?.[0]?.url || "/placeholder-product.jpg"}
                            alt=""
                            className="w-10 h-10 rounded-xl object-cover border border-slate-100 shrink-0"
                          />
                          <div>
                            <Link
                              href={`/products/${p.slug}`}
                              target="_blank"
                              className="font-bold text-slate-900 hover:text-sky-600 line-clamp-1"
                            >
                              {p.nameBn}
                            </Link>
                            <span className="text-[11px] text-slate-400 font-sans">
                              {p.nameEn}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-600">
                        {p.sku}
                      </td>
                      <td className="py-3 px-4 capitalize text-slate-600">
                        {p.category}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-extrabold text-slate-900">
                          {formatBDT(p.salePrice || p.regularPrice)}
                        </span>
                        {p.salePrice && p.salePrice < p.regularPrice && (
                          <span className="text-[10px] text-slate-400 line-through block">
                            {formatBDT(p.regularPrice)}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`font-bold px-2.5 py-0.5 rounded-full ${
                            p.stock <= p.minimumStock
                              ? "bg-rose-50 text-rose-600"
                              : "bg-emerald-50 text-emerald-700"
                          }`}
                        >
                          {p.stock} টি
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {p.active ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>সক্রিয়</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-slate-400 font-bold">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>নিষ্ক্রিয়</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/products/${id}/edit`}
                            className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                            title="সম্পাদনা"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          {p.active && (
                            <button
                              onClick={() => handleDeactivate(id, p.nameBn)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="নিষ্ক্রিয় করুন"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
