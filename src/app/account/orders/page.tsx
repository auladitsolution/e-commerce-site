"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Package, ArrowRight, Clock, RotateCcw } from "lucide-react";
import { AnnouncementBar } from "@/components/storefront/AnnouncementBar";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { MobileBottomNav } from "@/components/storefront/MobileBottomNav";
import { useAuth } from "@/hooks/useAuth";
import { formatBDT, formatDateBD } from "@/lib/utils/formatters";
import { OrderDocument } from "@/types/ecommerce";
import { toast } from "sonner";

export default function CustomerOrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<OrderDocument[]>([]);
  const [loading, setLoading] = useState(true);

  // Return request modal
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderDocument | null>(null);
  const [returnReason, setReturnReason] = useState("");
  const [returnDescription, setReturnDescription] = useState("");
  const [submittingReturn, setSubmittingReturn] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders?limit=20");
        const data = await res.json();
        if (res.ok) {
          setOrders(data.orders || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  const handleOpenReturn = (order: OrderDocument) => {
    setSelectedOrder(order);
    setReturnReason("পণ্য ক্ষতিগ্রস্ত / সাইজ সমস্যা");
    setReturnDescription("");
    setReturnModalOpen(true);
  };

  const handleReturnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    setSubmittingReturn(true);
    try {
      const res = await fetch("/api/returns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: selectedOrder._id,
          orderNumber: selectedOrder.orderNumber,
          items: selectedOrder.items.map((i) => ({
            productId: i.productId,
            sku: i.sku,
            productName: i.productName,
            quantity: i.quantity,
          })),
          reason: returnReason,
          description: returnDescription,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "রিটার্ন অনুরোধ সফলভাবে জমা হয়েছে!");
        setReturnModalOpen(false);
        // Refresh orders
        const refreshed = await fetch("/api/orders?limit=20").then((r) => r.json());
        setOrders(refreshed.orders || []);
      } else {
        toast.error(data.error || "অনুরোধ সম্পন্ন হয়নি");
      }
    } catch {
      toast.error("সার্ভার সমস্যা হয়েছে");
    } finally {
      setSubmittingReturn(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              আমার অর্ডারসমূহ
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              আপনার পূর্ববর্তী অর্ডারের তালিকা, বর্তমান স্থিতি ও রিসিট
            </p>
          </div>
          <Link
            href="/products"
            className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
          >
            <span>নতুন অর্ডার করুন</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs max-w-md mx-auto my-8">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 text-base mb-1">
              কোনো পূর্ববর্তী অর্ডার পাওয়া যায়নি
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              আপনি এখনও কোনো অর্ডার করেননি। আমাদের নতুন কালেকশন ঘুরে দেখুন।
            </p>
            <Link
              href="/products"
              className="px-6 py-2.5 bg-sky-600 text-white rounded-xl text-xs font-bold inline-block"
            >
              পণ্য ব্রাউজ করুন
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((ord) => (
              <div
                key={ord._id}
                className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
                  <div>
                    <span className="text-xs text-slate-400 font-bold block">অর্ডার নং</span>
                    <span className="text-base font-mono font-black text-slate-900">
                      {ord.orderNumber}
                    </span>
                    <span className="text-xs text-slate-500 block mt-0.5">
                      {formatDateBD(ord.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                      {ord.orderStatus}
                    </span>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                      {ord.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="divide-y divide-slate-100">
                  {ord.items.map((item, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.image}
                          alt=""
                          className="w-12 h-12 rounded-xl object-cover border border-slate-100"
                        />
                        <div>
                          <span className="font-bold text-slate-800 block text-sm">
                            {item.productName}
                          </span>
                          {item.variantTitle && (
                            <span className="text-slate-500 text-[11px]">
                              {item.variantTitle}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="font-bold text-slate-900 text-sm">
                        {item.quantity} × {formatBDT(item.unitPrice)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer of card */}
                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-xs text-slate-500">
                    <span>ডেলিভারি ঠিকানা: </span>
                    <span className="font-medium text-slate-800">
                      {ord.shippingAddress?.district}, {ord.shippingAddress?.area}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-extrabold text-slate-900">
                      মোট: {formatBDT(ord.grandTotal)}
                    </span>

                    <Link
                      href={`/track?orderNumber=${ord.orderNumber}`}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>ট্র্যাক করুন</span>
                    </Link>

                    {ord.orderStatus === "DELIVERED" && (
                      <button
                        onClick={() => handleOpenReturn(ord)}
                        className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>রিটার্ন অনুরোধ</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Return Request Modal */}
        {returnModalOpen && selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4 animate-in fade-in">
              <h3 className="text-lg font-bold text-slate-900">
                রিটার্ন বা পরিবর্তন অনুরোধ: {selectedOrder.orderNumber}
              </h3>
              <p className="text-xs text-slate-500">
                আমাদের রিটার্ন পলিসি অনুযায়ী ৭ দিনের মধ্যে রিটার্ন সম্পন্ন করতে নিচের তথ্য প্রদান করুন।
              </p>

              <form onSubmit={handleReturnSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    রিটার্নের কারণ:
                  </label>
                  <select
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  >
                    <option value="পণ্য ক্ষতিগ্রস্ত / ভাঙা">পণ্য ক্ষতিগ্রস্ত / ভাঙা</option>
                    <option value="সাইজ বা কালার সমস্যা">সাইজ বা কালার সমস্যা</option>
                    <option value="ভুল পণ্য ডেলিভারি">ভুল পণ্য ডেলিভারি</option>
                    <option value="ছবি বা বিবরণের সাথে অমিল">ছবি বা বিবরণের সাথে অমিল</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    বিস্তারিত বিবরণ:
                  </label>
                  <textarea
                    value={returnDescription}
                    onChange={(e) => setReturnDescription(e.target.value)}
                    rows={3}
                    placeholder="সমস্যার বিস্তারিত বর্ণনা লিখুন..."
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setReturnModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    disabled={submittingReturn}
                    className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold disabled:opacity-50"
                  >
                    {submittingReturn ? "জমা হচ্ছে..." : "অনুরোধ জমা দিন"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
