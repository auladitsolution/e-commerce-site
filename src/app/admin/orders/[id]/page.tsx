"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Truck,
  CreditCard,
  User,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { formatBDT, formatDateBD } from "@/lib/utils/formatters";
import { OrderDocument, OrderStatus } from "@/types/ecommerce";
import { toast } from "sonner";

interface Props {
  params: Promise<{ id: string }>;
}

export default function AdminOrderDetailPage({ params }: Props) {
  const { id } = use(params);

  const [order, setOrder] = useState<OrderDocument | null>(null);
  const [payment, setPayment] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  // Status update
  const [newStatus, setNewStatus] = useState<OrderStatus>("CONFIRMED");
  const [statusNote, setStatusNote] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Courier info
  const [courierName, setCourierName] = useState("");
  const [consignmentId, setConsignmentId] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");
  const [savingCourier, setSavingCourier] = useState(false);

  // Payment verify
  const [verifyingPayment, setVerifyingPayment] = useState(false);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${id}`);
      const data = await res.json();
      if (res.ok) {
        setOrder(data.order);
        setPayment(data.payment);
        setCourierName(data.order.courierInfo?.courierName || "");
        setConsignmentId(data.order.courierInfo?.consignmentId || "");
        setTrackingUrl(data.order.courierInfo?.trackingUrl || "");
      } else {
        toast.error("অর্ডার পাওয়া যায়নি");
      }
    } catch {
      toast.error("সার্ভার ত্রুটি");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;

    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          note: statusNote.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("অর্ডার স্থিতি সফলভাবে পরিবর্তন হয়েছে!");
        setStatusNote("");
        fetchOrder();
      } else {
        toast.error(data.error || "পরিবর্তন সম্ভব হয়নি");
      }
    } catch {
      toast.error("সার্ভার সমস্যা হয়েছে");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleSaveCourier = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingCourier(true);
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courierInfo: {
            courierName: courierName.trim(),
            consignmentId: consignmentId.trim(),
            trackingUrl: trackingUrl.trim(),
          },
        }),
      });

      if (res.ok) {
        toast.success("কুরিয়ার তথ্য হালনাগাদ করা হয়েছে!");
        fetchOrder();
      } else {
        toast.error("ব্যর্থ হয়েছে");
      }
    } catch {
      toast.error("সার্ভার ত্রুটি");
    } finally {
      setSavingCourier(false);
    }
  };

  const handleVerifyPayment = async () => {
    if (!confirm("আপনি কি পেমেন্ট নিশ্চিত করতে চান?")) return;
    setVerifyingPayment(true);
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentVerified: true }),
      });
      if (res.ok) {
        toast.success("পেমেন্ট সফলভাবে যাচাই হয়েছে!");
        fetchOrder();
      } else {
        toast.error("ব্যর্থ হয়েছে");
      }
    } catch {
      toast.error("সার্ভার সমস্যা");
    } finally {
      setVerifyingPayment(false);
    }
  };

  if (loading || !order) {
    return (
      <div className="flex justify-center p-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  // Next available statuses based on explicit matrix
  const transitionOptions: Record<OrderStatus, OrderStatus[]> = {
    PENDING: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["PROCESSING", "CANCELLED"],
    PROCESSING: ["PACKED", "CANCELLED"],
    PACKED: ["SHIPPED", "CANCELLED"],
    SHIPPED: ["DELIVERED", "CANCELLED"],
    DELIVERED: ["RETURN_REQUESTED", "RETURNED"],
    CANCELLED: [],
    RETURN_REQUESTED: ["RETURNED", "DELIVERED"],
    RETURNED: ["REFUNDED"],
    REFUNDED: [],
  };

  const nextAllowed = transitionOptions[order.orderStatus] || [];

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/orders"
            className="p-2 bg-white rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black font-mono text-slate-900">
              অর্ডার: {order.orderNumber}
            </h1>
            <p className="text-xs text-slate-500">
              অর্ডারের সময়: {formatDateBD(order.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
            {order.orderStatus}
          </span>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
            {order.paymentStatus}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Items & Customer details */}
        <div className="lg:col-span-8 space-y-6">
          {/* Items */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-2">
              অর্ডারকৃত পণ্যসমূহ
            </h3>

            <div className="divide-y divide-slate-100">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt=""
                      className="w-12 h-12 rounded-xl object-cover border border-slate-100 shrink-0"
                    />
                    <div>
                      <span className="font-bold text-slate-900 text-sm block">
                        {item.productName}
                      </span>
                      <span className="text-slate-400 font-mono text-[11px]">
                        SKU: {item.sku} {item.variantTitle && `(${item.variantTitle})`}
                      </span>
                      <span className="text-slate-500 block mt-0.5">
                        একক মূল্য: {formatBDT(item.unitPrice)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-900 text-sm block">
                      {formatBDT(item.finalPrice)}
                    </span>
                    <span className="text-slate-400 text-[11px]">
                      পরিমাণ: {item.quantity} টি
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>সাবটোটাল</span>
                <span className="font-bold text-slate-900">{formatBDT(order.subtotal)}</span>
              </div>
              {order.couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>কুপন ছাড় ({order.couponCode})</span>
                  <span>-{formatBDT(order.couponDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>শিপিং চার্জ</span>
                <span className="font-bold text-slate-900">
                  {formatBDT(order.shippingCharge)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                <span>সর্বমোট আদায়যোগ্য</span>
                <span className="text-base text-sky-700">{formatBDT(order.grandTotal)}</span>
              </div>
            </div>
          </div>

          {/* Customer & Address */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 text-xs">
            <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-sky-600" />
              <span>গ্রাহক ও শিপিং ঠিকানা</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-slate-400 block mb-0.5">প্রাপকের নাম:</span>
                <span className="font-bold text-slate-800 text-sm">
                  {order.shippingAddress?.recipientName}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">মোবাইল নম্বর:</span>
                <span className="font-mono font-bold text-slate-800 text-sm">
                  {order.shippingAddress?.phone}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">জেলা ও এলাকা:</span>
                <span className="font-bold text-slate-800">
                  {order.shippingAddress?.district}, {order.shippingAddress?.area}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">বিস্তারিত ঠিকানা:</span>
                <span className="font-bold text-slate-800">
                  {order.shippingAddress?.fullAddress}
                </span>
              </div>
            </div>

            {order.customerNote && (
              <div className="p-3 bg-amber-50 rounded-xl text-amber-800 border border-amber-200">
                <span className="font-bold block">গ্রাহকের বিশেষ নির্দেশনা:</span>
                <span>{order.customerNote}</span>
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-2 flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-600" />
              <span>টাইমলাইন ও হিস্ট্রি</span>
            </h3>

            <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {order.timeline.map((item, idx) => (
                <div key={idx} className="relative text-xs">
                  <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-white border-4 border-sky-600" />
                  <div>
                    <span className="font-bold text-slate-900 block">{item.title}</span>
                    <span className="text-slate-400 font-medium">
                      {formatDateBD(item.timestamp)} — {item.updatedBy}
                    </span>
                    {item.note && (
                      <p className="text-slate-600 bg-slate-50 p-2 rounded-xl mt-1">
                        {item.note}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Actions (Status transition, Courier, Manual Payment Verification) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Status Transition Action */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-2">
              অর্ডার স্থিতি পরিবর্তন
            </h3>

            {nextAllowed.length === 0 ? (
              <p className="text-xs text-slate-500">
                এই অর্ডারটি সর্বশেষ অবস্থায় রয়েছে ({order.orderStatus})।
              </p>
            ) : (
              <form onSubmit={handleUpdateStatus} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    পরবর্তী স্থিতি নির্বাচন করুন:
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  >
                    {nextAllowed.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    মন্তব্য / নোট (বাতিলের ক্ষেত্রে কারণ আবশ্যক):
                  </label>
                  <input
                    type="text"
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    placeholder="নোট বা কারণ লিখুন..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={updatingStatus}
                  className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
                >
                  {updatingStatus ? "আপডেট হচ্ছে..." : "স্থিতি আপডেট করুন"}
                </button>
              </form>
            )}
          </div>

          {/* Payment Status & Manual Verification */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-2 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-sky-600" />
              <span>পেমেন্ট তথ্য ও যাচাই</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">পদ্ধতি:</span>
                <span className="font-bold text-slate-900">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">স্থিতি:</span>
                <span
                  className={`font-bold px-2 py-0.5 rounded-full ${
                    order.paymentStatus === "PAID"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {order.paymentStatus}
                </span>
              </div>
            </div>

            {payment && (
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5 text-xs font-mono">
                {Boolean(payment.senderNumber) && (
                  <p>
                    প্রেরক নম্বর:{" "}
                    <span className="font-bold">{String(payment.senderNumber)}</span>
                  </p>
                )}
                {Boolean(payment.transactionId) && (
                  <p>
                    TrxID:{" "}
                    <span className="font-bold text-sky-700">
                      {String(payment.transactionId)}
                    </span>
                  </p>
                )}
              </div>
            )}

            {order.paymentStatus !== "PAID" && (
              <button
                type="button"
                disabled={verifyingPayment}
                onClick={handleVerifyPayment}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
              >
                {verifyingPayment ? "যাচাই হচ্ছে..." : "✓ পেমেন্ট কনফার্ম করুন (PAID)"}
              </button>
            )}
          </div>

          {/* Courier Information */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-2 flex items-center gap-2">
              <Truck className="w-4 h-4 text-sky-600" />
              <span>কুরিয়ার অ্যাসাইনমেন্ট</span>
            </h3>

            <form onSubmit={handleSaveCourier} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  কুরিয়ারের নাম:
                </label>
                <input
                  type="text"
                  value={courierName}
                  onChange={(e) => setCourierName(e.target.value)}
                  placeholder="যেমন: স্টেডফাস্ট / পেপারফ্লাই / সুন্দরবন"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  কনসাইনমেন্ট বা ট্র্যাকিং আইডি:
                </label>
                <input
                  type="text"
                  value={consignmentId}
                  onChange={(e) => setConsignmentId(e.target.value)}
                  placeholder="যেমন: CN-89472"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  কুরিয়ার ট্র্যাকিং লিঙ্ক:
                </label>
                <input
                  type="url"
                  value={trackingUrl}
                  onChange={(e) => setTrackingUrl(e.target.value)}
                  placeholder="https://courier.com/track/..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={savingCourier}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
              >
                {savingCourier ? "সংরক্ষণ হচ্ছে..." : "কুরিয়ার তথ্য সংরক্ষণ"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
