"use client";

import { useState, useEffect } from "react";
import { Plus, Layers, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface CategoryDoc {
  _id: string;
  nameBn: string;
  nameEn: string;
  slug: string;
  sortOrder: number;
  featured: boolean;
  active: boolean;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryDoc[]>([]);
  const [loading, setLoading] = useState(true);

  // New Category form
  const [nameBn, setNameBn] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [slug, setSlug] = useState("");
  const [sortOrder, setSortOrder] = useState("1");
  const [creating, setCreating] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (res.ok) setCategories(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleNameEnChange = (val: string) => {
    setNameEn(val);
    setSlug(
      val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
    );
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameBn || !nameEn || !slug) {
      toast.error("সকল তথ্য পূরণ করুন");
      return;
    }

    setCreating(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nameBn: nameBn.trim(),
          nameEn: nameEn.trim(),
          slug: slug.trim(),
          sortOrder: Number(sortOrder || 1),
          featured: true,
          active: true,
        }),
      });

      if (res.ok) {
        toast.success("ক্যাটাগরি তৈরি হয়েছে!");
        setNameBn("");
        setNameEn("");
        setSlug("");
        fetchCategories();
      } else {
        toast.error("তৈরি করা সম্ভব হয়নি");
      }
    } catch {
      toast.error("সার্ভার ত্রুটি");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">ক্যাটাগরি ব্যবস্থাপনা</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          স্টোরের পণ্য বিভাগ, সাজানোর ক্রম ও নেভিগেশন কনফিগারেশন
        </p>
      </div>

      {/* New Category Form Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-2 flex items-center gap-2">
          <Plus className="w-4 h-4 text-sky-600" />
          <span>নতুন ক্যাটাগরি তৈরি করুন</span>
        </h3>

        <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">
              বাংলা নাম:
            </label>
            <input
              type="text"
              value={nameBn}
              onChange={(e) => setNameBn(e.target.value)}
              placeholder="যেমন: ফ্যাশন"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">
              English Name:
            </label>
            <input
              type="text"
              value={nameEn}
              onChange={(e) => handleNameEnChange(e.target.value)}
              placeholder="e.g. Fashion"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">
              স্লাগ (URL Slug):
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="fashion"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-sky-500 focus:outline-none"
              required
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={creating}
              className="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs disabled:opacity-50"
            >
              {creating ? "তৈরি হচ্ছে..." : "+ ক্যাটাগরি সংরক্ষণ"}
            </button>
          </div>
        </form>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">ক্যাটাগরি নাম (বাংলা)</th>
                  <th className="py-3 px-4">English Name</th>
                  <th className="py-3 px-4">স্লাগ (URL)</th>
                  <th className="py-3 px-4">ক্রম</th>
                  <th className="py-3 px-4 text-right">অবস্থা</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categories.map((cat) => (
                  <tr key={cat._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">{cat.nameBn}</td>
                    <td className="py-3 px-4 text-slate-600 font-sans">{cat.nameEn}</td>
                    <td className="py-3 px-4 font-mono text-sky-700 font-semibold">
                      /{cat.slug}
                    </td>
                    <td className="py-3 px-4 text-slate-600">{cat.sortOrder}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>সক্রিয়</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
