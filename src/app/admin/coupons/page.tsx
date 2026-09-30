"use client";

import { useState, useEffect } from "react";
import { Tag, Plus, CheckCircle2 } from "lucide-react";
import { formatBDT, formatDateBD } from "@/lib/utils/formatters";
import { toast } from "sonner";

interface CouponItem {
  _id: string;
  code: string;
  type: "PERCENTAGE" | "FIXED" | "FREE_SHIPPING";
  amount: number;
  minOrder: number;
  maxDiscount?: number;
  usageCount: number;
  expiryDate: string;
  active: boolean;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<CouponItem[]>([]);
  const [loading, setLoading] = useState(true);

  // New Coupon form
  const [code, setCode] = useState("");
  const [type, setType] = useState<"PERCENTAGE" | "FIXED" | "FREE_SHIPPING">("PERCENTAGE");
  const [amount, setAmount] = useState("");
  const [minOrder, setMinOrder] = useState("");
  const [maxDiscount, setMaxDiscount] = useState("");
  const [creating, setCreating] = useState(false);

  const fetchCoupons = async () => {
    try {
      const res = await fetch("/api/admin/coupons");
      const data = await res.json();
      if (res.ok) setCoupons(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !amount) {
      toast.error("কুপন কোড ও পরিমাণ পূরণ করুন");
      return;
    }

    setCreating(true);
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: code.trim().toUpperCase(),
          type,
          amount: Number(amount),
          minOrder: minOrder ? Number(minOrder) : 0,
          maxDiscount: maxDiscount ? Number(maxDiscount) : undefined,
        }),
      });

      if (res.ok) {
        toast.success("কুপন কোড তৈরি সম্পন্ন!");
        setCode("");
        setAmount("");
        setMinOrder("");
        setMaxDiscount("");
        fetchCoupons();
      } else {
        toast.error("তৈরি করা যায়নি");
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
        <h1 className="text-2xl font-extrabold text-slate-900">কুপন ও প্রমোশন কোড</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          গ্রাহকদের জন্য বিশেষ ডিসকাউন্ট এবং ফ্রি ডেলিভারি কুপন পরিচালনা করুন
        </p>
      </div>

      {/* New Coupon Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-2 flex items-center gap-2">
          <Plus className="w-4 h-4 text-sky-600" />
          <span>নতুন ডিসকাউন্ট কুপন তৈরি</span>
        </h3>

        <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">
              কুপন কোড:
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="SAVE15"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono uppercase font-bold focus:ring-2 focus:ring-sky-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">
              ধরনের:
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as typeof type)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-sky-500 focus:outline-none"
            >
              <option value="PERCENTAGE">শতাংশ ছাড় (%)</option>
              <option value="FIXED">নির্দিষ্ট ছাড় (৳)</option>
              <option value="FREE_SHIPPING">ফ্রি ডেলিভারি</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">
              ছাড়ের পরিমাণ (% বা ৳):
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="15"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-sky-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">
              নূন্যতম অর্ডার (৳):
            </label>
            <input
              type="number"
              value={minOrder}
              onChange={(e) => setMinOrder(e.target.value)}
              placeholder="1000"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={creating}
              className="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs disabled:opacity-50"
            >
              {creating ? "..." : "+ কুপন তৈরি"}
            </button>
          </div>
        </form>
      </div>

      {/* Coupons Table */}
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
                  <th className="py-3 px-4">কুপন কোড</th>
                  <th className="py-3 px-4">ধরন</th>
                  <th className="py-3 px-4">ছাড়</th>
                  <th className="py-3 px-4">নূন্যতম অর্ডার</th>
                  <th className="py-3 px-4">ব্যবহার হয়েছে</th>
                  <th className="py-3 px-4">মেয়াদ</th>
                  <th className="py-3 px-4 text-right">অবস্থা</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {coupons.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-black text-sky-700">
                      {c.code}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-600">
                      {c.type === "PERCENTAGE"
                        ? "শতাংশ (%)"
                        : c.type === "FIXED"
                        ? "নির্দিষ্ট (৳)"
                        : "ফ্রি ডেলিভারি"}
                    </td>
                    <td className="py-3 px-4 font-extrabold text-slate-900">
                      {c.type === "PERCENTAGE"
                        ? `${c.amount}%`
                        : c.type === "FIXED"
                        ? formatBDT(c.amount)
                        : "ফ্রি শিপিং"}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {formatBDT(c.minOrder)}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-700">
                      {c.usageCount} বার
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {formatDateBD(c.expiryDate)}
                    </td>
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
