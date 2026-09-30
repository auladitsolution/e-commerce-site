"use client";

import { useState, useEffect } from "react";
import { Boxes, Plus, AlertTriangle, History, ArrowDown, ArrowUp } from "lucide-react";
import { formatDateBD } from "@/lib/utils/formatters";
import { ProductItem } from "@/types/ecommerce";
import { toast } from "sonner";

interface StockMovementItem {
  _id: string;
  productName: string;
  sku: string;
  variantTitle?: string;
  type: string;
  quantity: number;
  previousStock: number;
  newStock: number;
  reason?: string;
  createdBy: string;
  createdAt: string;
}

export default function AdminInventoryPage() {
  const [movements, setMovements] = useState<StockMovementItem[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<ProductItem[]>([]);
  const [productsList, setProductsList] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Adjustment Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [adjType, setAdjType] = useState<"PURCHASE" | "DAMAGE" | "ADJUSTMENT_IN" | "ADJUSTMENT_OUT">("PURCHASE");
  const [adjQty, setAdjQty] = useState("");
  const [adjReason, setAdjReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const [invRes, prodRes] = await Promise.all([
        fetch("/api/admin/inventory"),
        fetch("/api/products?limit=100"),
      ]);

      const invData = await invRes.json();
      const prodData = await prodRes.json();

      if (invRes.ok) {
        setMovements(invData.movements || []);
        setLowStockProducts(invData.lowStockProducts || []);
      }
      if (prodRes.ok) {
        setProductsList(prodData.products || []);
        if (prodData.products?.[0]) {
          setSelectedProductId(prodData.products[0].id || prodData.products[0]._id);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || !adjQty || !adjReason) {
      toast.error("সকল তথ্য পূরণ করুন");
      return;
    }

    const qtyNumber = parseInt(adjQty, 10);
    // If DAMAGE or ADJUSTMENT_OUT, qty is negative
    const finalQuantity = ["DAMAGE", "ADJUSTMENT_OUT"].includes(adjType)
      ? -Math.abs(qtyNumber)
      : Math.abs(qtyNumber);

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedProductId,
          quantity: finalQuantity,
          type: adjType,
          reason: adjReason.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("স্টক সমন্বয় সম্পন্ন হয়েছে!");
        setModalOpen(false);
        setAdjQty("");
        setAdjReason("");
        fetchData();
      } else {
        toast.error(data.error || "সমন্বয় করা যায়নি");
      }
    } catch {
      toast.error("সার্ভার ত্রুটি");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            ইনভেন্টরি ও স্টক মুভমেন্ট
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            পণ্য রিস্টক, স্টক সমন্বয় ও প্রতিটি মুভমেন্টের অডিট ট্রেইল
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>স্টক সমন্বয় / রিস্টক করুন</span>
        </button>
      </div>

      {/* Low Stock Alerts */}
      {lowStockProducts.length > 0 && (
        <div className="p-4 bg-rose-50 border border-rose-200/80 rounded-3xl space-y-3">
          <div className="flex items-center gap-2 font-bold text-rose-800 text-xs">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>সতর্কতা: {lowStockProducts.length} টি পণ্যের স্টক নূন্যতম সীমার নিচে নেমে গেছে!</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {lowStockProducts.map((p) => (
              <span
                key={p.id || p._id}
                className="px-3 py-1 bg-white border border-rose-200 text-rose-700 rounded-xl text-xs font-bold shadow-2xs"
              >
                {p.nameBn} — অবশিষ্ট: {p.stock} টি
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Stock Movement Log Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden space-y-2">
        <div className="p-5 border-b border-slate-100 flex items-center gap-2 font-extrabold text-slate-900 text-sm">
          <History className="w-4 h-4 text-sky-600" />
          <span>সাম্প্রতিক স্টক মুভমেন্ট হিস্ট্রি (Audit Log)</span>
        </div>

        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
          </div>
        ) : movements.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            কোনো মুভমেন্ট হিস্ট্রি পাওয়া যায়নি
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">তারিখ ও সময়</th>
                  <th className="py-3 px-4">পণ্য ও SKU</th>
                  <th className="py-3 px-4">টাইপ</th>
                  <th className="py-3 px-4">পরিমাণ</th>
                  <th className="py-3 px-4">পূর্বের স্টক → নতুন স্টক</th>
                  <th className="py-3 px-4">কারণ</th>
                  <th className="py-3 px-4 text-right">কর্তৃপক্ষ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {movements.map((m) => (
                  <tr key={m._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                      {formatDateBD(m.createdAt)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 block">{m.productName}</span>
                      <span className="text-slate-400 font-mono text-[11px]">{m.sku}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px]">
                        {m.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-black">
                      <span
                        className={`inline-flex items-center gap-0.5 ${
                          m.quantity > 0 ? "text-emerald-600" : "text-rose-600"
                        }`}
                      >
                        {m.quantity > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                        {m.quantity > 0 ? `+${m.quantity}` : m.quantity}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {m.previousStock} → <strong className="text-slate-900">{m.newStock}</strong>
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                      {m.reason || "অর্ডার বিক্রয়"}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-500 text-[11px]">
                      {m.createdBy}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Stock Adjustment Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in">
            <h3 className="text-base font-extrabold text-slate-900">
              ম্যানুয়াল স্টক সমন্বয় / রিস্টক
            </h3>

            <form onSubmit={handleAdjustSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  পণ্য নির্বাচন করুন:
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  {productsList.map((p) => {
                    const pid = (p.id || p._id)!;
                    return (
                      <option key={pid} value={pid}>
                        {p.nameBn} (বর্তমান স্টক: {p.stock})
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  মুভমেন্টের ধরন:
                </label>
                <select
                  value={adjType}
                  onChange={(e) => setAdjType(e.target.value as typeof adjType)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  <option value="PURCHASE">নতুন ক্রয় / রিস্টক (PURCHASE - যোগ)</option>
                  <option value="ADJUSTMENT_IN">সংশোধন ইন (ADJUSTMENT_IN - যোগ)</option>
                  <option value="DAMAGE">ক্ষতিগ্রস্ত বা নষ্ট (DAMAGE - বিয়োগ)</option>
                  <option value="ADJUSTMENT_OUT">সংশোধন আউট (ADJUSTMENT_OUT - বিয়োগ)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  পরিমাণ (সংখ্যা):
                </label>
                <input
                  type="number"
                  value={adjQty}
                  onChange={(e) => setAdjQty(e.target.value)}
                  placeholder="যেমন: 10"
                  min="1"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  সমন্বয়ের সুনির্দিষ্ট কারণ (অডিট ট্রেইলের জন্য আবশ্যক):
                </label>
                <input
                  type="text"
                  value={adjReason}
                  onChange={(e) => setAdjReason(e.target.value)}
                  placeholder="যেমন: নতুন চালানে ২০টি পিস স্টক ইন"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold disabled:opacity-50"
                >
                  {submitting ? "সমন্বয় হচ্ছে..." : "সমন্বয় সম্পন্ন করুন"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
