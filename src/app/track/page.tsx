"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Package,
  Clock,
  Truck,
  CheckCircle2,
  AlertCircle,
  MapPin,
} from "lucide-react";
import { AnnouncementBar } from "@/components/storefront/AnnouncementBar";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { MobileBottomNav } from "@/components/storefront/MobileBottomNav";
import { formatBDT, formatDateBD } from "@/lib/utils/formatters";
import { OrderStatus, PaymentStatus } from "@/types/ecommerce";
import { toast } from "sonner";

interface OrderTrackingData {
  orderNumber: string;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  grandTotal: number;
  items: {
    productName: string;
    quantity: number;
    unitPrice: number;
    image: string;
    variantTitle?: string;
  }[];
  courierInfo?: {
    courierName?: string;
    consignmentId?: string;
    trackingUrl?: string;
    notes?: string;
  };
  timeline: {
    status: OrderStatus;
    title: string;
    note?: string;
    timestamp: string;
  }[];
  createdAt: string;
}

function TrackContent() {
  const searchParams = useSearchParams();
  const initialOrderNumber = searchParams.get("orderNumber") || "";

  const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
  const [phone, setPhone] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [trackingData, setTrackingData] = useState<OrderTrackingData | null>(null);

  const fetchTracking = async (num: string, ph?: string, tk?: string) => {
    if (!num) return;
    setLoading(true);
    try {
      const res = await fetch("/api/orders/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderNumber: num,
          phone: ph || undefined,
          trackingToken: tk || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setTrackingData(data);
      } else {
        toast.error(data.error || "অর্ডার খুঁজে পাওয়া যায়নি");
        setTrackingData(null);
      }
    } catch {
      toast.error("সার্ভার অনুসন্ধান করতে ব্যর্থ হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderNumber) {
      setOrderNumber(initialOrderNumber);
    }
  }, [initialOrderNumber]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) {
      toast.error("অর্ডার নম্বর লিখুন");
      return;
    }
    if (!phone.trim() && !token.trim()) {
      toast.error("অর্ডার করার মোবাইল নম্বর অথবা ট্র্যাকিং টোকেন দিন");
      return;
    }
    fetchTracking(orderNumber.trim(), phone.trim(), token.trim());
  };

  const statusColors: Record<OrderStatus, string> = {
    PENDING: "text-amber-600 bg-amber-50 border-amber-200",
    CONFIRMED: "text-sky-600 bg-sky-50 border-sky-200",
    PROCESSING: "text-indigo-600 bg-indigo-50 border-indigo-200",
    PACKED: "text-purple-600 bg-purple-50 border-purple-200",
    SHIPPED: "text-blue-600 bg-blue-50 border-blue-200",
    DELIVERED: "text-emerald-600 bg-emerald-50 border-emerald-200",
    CANCELLED: "text-rose-600 bg-rose-50 border-rose-200",
    RETURN_REQUESTED: "text-orange-600 bg-orange-50 border-orange-200",
    RETURNED: "text-slate-600 bg-slate-50 border-slate-200",
    REFUNDED: "text-teal-600 bg-teal-50 border-teal-200",
  };

  return (
    <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="text-center max-w-xl mx-auto mb-8">
        <div className="w-14 h-14 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xs">
          <Package className="w-7 h-7" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          অর্ডার ট্র্যাকিং
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          আপনার অর্ডারের বর্তমান অবস্থা এবং ডেলিভারি আপডেট দেখতে তথ্য প্রদান করুন
        </p>
      </div>

      {/* Search Input Box */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs mb-8 space-y-4 max-w-xl mx-auto"
      >
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">
            অর্ডার নম্বর <span className="text-rose-500">*</span>:
          </label>
          <input
            type="text"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
            placeholder="যেমন: ORD-2026-000001"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold uppercase focus:ring-2 focus:ring-sky-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">
            অর্ডারে ব্যবহৃত মোবাইল নম্বর:
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="01700000000"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-sky-500 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Search className="w-4 h-4" />
          <span>{loading ? "অনুসন্ধান চলছে..." : "অর্ডার খুঁজুন"}</span>
        </button>
      </form>

      {/* Tracking Results */}
      {trackingData && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-8 animate-in fade-in">
          {/* Header Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
            <div>
              <span className="text-xs text-slate-400 font-bold block">অর্ডার নম্বর</span>
              <span className="text-xl sm:text-2xl font-mono font-black text-slate-900">
                {trackingData.orderNumber}
              </span>
              <span className="text-xs text-slate-500 block mt-0.5">
                অর্ডারের সময়: {formatDateBD(trackingData.createdAt)}
              </span>
            </div>

            <div className="flex flex-col sm:items-end gap-1.5">
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full border ${
                  statusColors[trackingData.orderStatus] || "text-slate-700 bg-slate-100"
                }`}
              >
                {trackingData.orderStatus}
              </span>
              <span className="text-xs text-slate-500">
                পেমেন্ট: {trackingData.paymentStatus} ({trackingData.paymentMethod})
              </span>
            </div>
          </div>

          {/* Courier Info if Shipped */}
          {trackingData.courierInfo?.courierName && (
            <div className="p-4 bg-sky-50 rounded-2xl border border-sky-200/80 flex items-start gap-3">
              <Truck className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <span className="font-bold text-sky-900 block">কুরিয়ার তথ্য:</span>
                <p className="text-sky-800">
                  কুরিয়ার সার্ভিস: <span className="font-bold">{trackingData.courierInfo.courierName}</span>
                  {trackingData.courierInfo.consignmentId && (
                    <> | ট্র্যাকিং আইডি: <span className="font-mono font-bold">{trackingData.courierInfo.consignmentId}</span></>
                  )}
                </p>
                {trackingData.courierInfo.trackingUrl && (
                  <a
                    href={trackingData.courierInfo.trackingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sky-600 underline font-semibold block"
                  >
                    সরাসরি কুরিয়ার পেজে ট্র্যাক করুন →
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Order Timeline */}
          <div>
            <h3 className="text-base font-extrabold text-slate-900 mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-sky-600" />
              <span>অর্ডার অগ্রগতি টাইমলাইন</span>
            </h3>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {trackingData.timeline.map((step, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-white border-4 border-sky-600" />
                  <div>
                    <span className="font-bold text-sm text-slate-900 block">
                      {step.title}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {formatDateBD(step.timestamp)}
                    </span>
                    {step.note && (
                      <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-xl mt-1 max-w-md">
                        {step.note}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Items Summary */}
          <div className="pt-6 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 mb-3">পণ্য তালিকা</h3>
            <div className="divide-y divide-slate-100">
              {trackingData.items.map((item, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt=""
                      className="w-10 h-10 rounded-lg object-cover border border-slate-100"
                    />
                    <div>
                      <span className="font-bold text-slate-800 block">
                        {item.productName}
                      </span>
                      {item.variantTitle && (
                        <span className="text-[11px] text-slate-400">
                          {item.variantTitle}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="font-bold text-slate-900">
                    {item.quantity} টি × {formatBDT(item.unitPrice)}
                  </span>
                </div>
              ))}
            </div>
            <div className="pt-3 border-t border-slate-200 flex justify-between font-extrabold text-sm text-slate-900">
              <span>সর্বমোট মূল্য:</span>
              <span className="text-sky-700 text-base">{formatBDT(trackingData.grandTotal)}</span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default function TrackOrderPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <AnnouncementBar />
      <Header />
      <Suspense fallback={<div className="p-12 text-center text-sm">লোড হচ্ছে...</div>}>
        <TrackContent />
      </Suspense>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
