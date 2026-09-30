"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ShieldCheck,
  Truck,
  CreditCard,
  ShoppingBag,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { AnnouncementBar } from "@/components/storefront/AnnouncementBar";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { BD_DISTRICTS, formatBDT, validateBDPhone } from "@/lib/utils/formatters";
import { PaymentMethod } from "@/types/ecommerce";
import { toast } from "sonner";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items, subtotal, clearCart, isLoaded } = useCart();
  const { user } = useAuth();

  const initialCoupon = searchParams.get("coupon") || "";

  // Form State
  const [name, setName] = useState(user?.displayName || "");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [district, setDistrict] = useState("ঢাকা (Dhaka)");
  const [area, setArea] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [customerNote, setCustomerNote] = useState("");

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("COD");
  const [senderNumber, setSenderNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");

  const [couponCode, setCouponCode] = useState(initialCoupon);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Dynamic Shipping Charge
  const isDhaka = district.includes("ঢাকা") || district.toLowerCase().includes("dhaka");
  const shippingCharge = subtotal >= 1500 ? 0 : isDhaka ? 60 : 120;
  const grandTotal = Math.max(0, subtotal - couponDiscount + shippingCharge);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!items.length) {
      toast.error("আপনার কার্ট খালি!");
      return;
    }

    if (!name.trim()) {
      toast.error("আপনার নাম লিখুন");
      return;
    }

    if (!validateBDPhone(phone)) {
      toast.error("সঠিক ১১ ডিজিটের বাংলাদেশী মোবাইল নম্বর দিন (যেমন: 01700000000)");
      return;
    }

    if (!area.trim() || !fullAddress.trim()) {
      toast.error("থানা ও বিস্তারিত ঠিকানা লিখুন");
      return;
    }

    if (
      ["BKASH", "NAGAD", "ROCKET"].includes(paymentMethod) &&
      (!senderNumber.trim() || !transactionId.trim())
    ) {
      toast.error("মোবাইল ব্যাংকিংয়ের প্রেরক নম্বর ও ট্রানজেকশন আইডি (TrxID) লিখুন");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        isGuest: !user,
        customerInfo: {
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
        },
        shippingAddress: {
          label: "বাসা",
          recipientName: name.trim(),
          phone: phone.trim(),
          district,
          area: area.trim(),
          fullAddress: fullAddress.trim(),
        },
        items: items.map((i) => ({
          productId: i.productId,
          variantId: i.variantId,
          quantity: i.quantity,
        })),
        paymentMethod,
        manualPaymentDetails:
          paymentMethod !== "COD"
            ? {
                senderNumber: senderNumber.trim(),
                transactionId: transactionId.trim().toUpperCase(),
              }
            : undefined,
        couponCode: couponCode ? couponCode.trim().toUpperCase() : undefined,
        customerNote: customerNote.trim() || undefined,
      };

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "অর্ডার সম্পন্ন করা সম্ভব হয়নি");
      }

      toast.success("আপনার অর্ডার সফলভাবে সম্পন্ন হয়েছে!");
      clearCart();
      router.push(
        `/checkout/success?orderNumber=${data.orderNumber}&token=${data.trackingToken}`
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "অর্ডার সম্পন্ন করতে সমস্যা হয়েছে";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">কার্ট খালি থাকায় চেকআউট সম্ভব নয়</h2>
        <button
          onClick={() => router.push("/products")}
          className="px-6 py-2.5 bg-sky-600 text-white rounded-xl text-sm font-bold"
        >
          কেনাকাটা করুন
        </button>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          চেকআউট ও অর্ডার কনফার্মেশন
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          ডেলিভারি ঠিকানা ও পেমেন্ট পদ্ধতি নির্বাচন করে অর্ডারটি সম্পূর্ণ করুন
        </p>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Customer Info & Address */}
        <div className="lg:col-span-7 space-y-6">
          {/* Shipping Address Card */}
          <div className="bg-white p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 font-extrabold text-slate-900 text-sm sm:text-base">
              <Truck className="w-5 h-5 text-sky-600" />
              <span>ডেলিভারি ঠিকানা ও প্রাপকের তথ্য</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  আপনার নাম <span className="text-rose-500">*</span>:
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="যেমন: তানভীর আহমেদ"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  মোবাইল নম্বর <span className="text-rose-500">*</span>:
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01700000000"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                ইমেইল ঠিকানা (ঐচ্ছিক):
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  জেলা <span className="text-rose-500">*</span>:
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  {BD_DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  থানা / এলাকা <span className="text-rose-500">*</span>:
                </label>
                <input
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="যেমন: ধানমন্ডি / মিরপুর ১০"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                বিস্তারিত ঠিকানা (রোড, বাসা নম্বর) <span className="text-rose-500">*</span>:
              </label>
              <textarea
                value={fullAddress}
                onChange={(e) => setFullAddress(e.target.value)}
                rows={2}
                placeholder="যেমন: বাড়ি নং ১২, রোড নং ৪, সেক্টর ৩"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                অর্ডার সংক্রান্ত বিশেষ নির্দেশনা (ঐচ্ছিক):
              </label>
              <input
                type="text"
                value={customerNote}
                onChange={(e) => setCustomerNote(e.target.value)}
                placeholder="ডেলিভারির সময় বা বিশেষ কোনো অনুরোধ..."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="bg-white p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 font-extrabold text-slate-900 text-sm sm:text-base">
              <CreditCard className="w-5 h-5 text-sky-600" />
              <span>পেমেন্ট পদ্ধতি বেছে নিন</span>
            </div>

            <div className="space-y-3">
              {/* COD */}
              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === "COD"
                    ? "bg-sky-50 border-sky-600 shadow-xs"
                    : "bg-white border-slate-200 hover:bg-slate-50"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                  className="mt-1 text-sky-600"
                />
                <div>
                  <span className="font-bold text-sm text-slate-900 block">
                    ক্যাশ অন ডেলিভারি (Cash on Delivery)
                  </span>
                  <span className="text-xs text-slate-500">
                    পণ্য হাতে পেয়ে দেখে মূল্য পরিশোধ করুন।
                  </span>
                </div>
              </label>

              {/* bKash */}
              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === "BKASH"
                    ? "bg-pink-50 border-pink-600 shadow-xs"
                    : "bg-white border-slate-200 hover:bg-slate-50"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "BKASH"}
                  onChange={() => setPaymentMethod("BKASH")}
                  className="mt-1 text-pink-600"
                />
                <div>
                  <span className="font-bold text-sm text-pink-700 block">
                    বিকাশ (bKash Manual / Send Money)
                  </span>
                  <span className="text-xs text-slate-500">
                    আমাদের মার্চেন্ট/পার্সোনাল নম্বরে সেন্ড মানি করে TrxID দিন।
                  </span>
                </div>
              </label>

              {/* Nagad */}
              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === "NAGAD"
                    ? "bg-orange-50 border-orange-600 shadow-xs"
                    : "bg-white border-slate-200 hover:bg-slate-50"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "NAGAD"}
                  onChange={() => setPaymentMethod("NAGAD")}
                  className="mt-1 text-orange-600"
                />
                <div>
                  <span className="font-bold text-sm text-orange-700 block">
                    নগদ (Nagad Manual)
                  </span>
                  <span className="text-xs text-slate-500">
                    নগদ নম্বরে পেমেন্ট করে ট্রানজেকশন আইডি দিন।
                  </span>
                </div>
              </label>
            </div>

            {/* Mobile Banking Input fields if BKASH/NAGAD selected */}
            {["BKASH", "NAGAD", "ROCKET"].includes(paymentMethod) && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 animate-in fade-in">
                <p className="text-xs text-slate-600 font-semibold">
                  আমাদের {paymentMethod} নম্বর:{" "}
                  <span className="font-mono text-slate-900 font-bold bg-white px-2 py-0.5 rounded border border-slate-200">
                    01711-000000 (Personal)
                  </span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      যে নম্বর থেকে পাঠিয়েছেন:
                    </label>
                    <input
                      type="tel"
                      value={senderNumber}
                      onChange={(e) => setSenderNumber(e.target.value)}
                      placeholder="017xxxxxxxx"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      ট্রানজেকশন আইডি (TrxID):
                    </label>
                    <input
                      type="text"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                      placeholder="9X8Y7Z6..."
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono uppercase font-bold focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Order Review & Confirmation */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs space-y-6 sticky top-24">
            <h3 className="font-extrabold text-slate-900 text-lg pb-3 border-b border-slate-100 flex items-center justify-between">
              <span>অর্ডারকৃত পণ্যসমূহ</span>
              <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full">
                {items.length} টি আইটেম
              </span>
            </h3>

            {/* Items miniature list */}
            <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 pr-1 space-y-2">
              {items.map((i) => (
                <div
                  key={`${i.productId}-${i.variantId || "def"}`}
                  className="pt-2 pb-2 flex items-center gap-3"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={i.image}
                    alt=""
                    className="w-12 h-12 rounded-xl object-cover border border-slate-100 shrink-0"
                  />
                  <div className="flex-1 text-xs">
                    <span className="font-bold text-slate-800 line-clamp-1">
                      {i.productName}
                    </span>
                    <span className="text-slate-500">
                      {formatBDT(i.unitPrice)} × {i.quantity}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-900">
                    {formatBDT(i.finalPrice)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-2.5 pt-4 border-t border-slate-100 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>পণ্যের মূল্য</span>
                <span className="font-bold text-slate-900">{formatBDT(subtotal)}</span>
              </div>

              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>কুপন ছাড়</span>
                  <span>-{formatBDT(couponDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>ডেলিভারি চার্জ</span>
                <span className="font-bold text-slate-900">
                  {shippingCharge === 0 ? (
                    <span className="text-emerald-600 font-bold">ফ্রি</span>
                  ) : (
                    formatBDT(shippingCharge)
                  )}
                </span>
              </div>

              <div className="flex justify-between text-base font-extrabold text-slate-900 pt-3 border-t border-slate-200">
                <span>সর্বমোট</span>
                <span className="text-2xl font-black text-sky-700">
                  {formatBDT(grandTotal)}
                </span>
              </div>
            </div>

            {/* Confirm CTA */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 text-white font-extrabold rounded-2xl shadow-xl shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all text-base active:scale-98"
            >
              <Lock className="w-4 h-4" />
              <span>{submitting ? "অর্ডার প্রসেস হচ্ছে..." : "অর্ডার কনফার্ম করুন"}</span>
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-medium pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>১০০% নিরাপদ ও এনক্রিপ্টেড চেকআউট</span>
            </div>
          </div>
        </div>
      </form>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <AnnouncementBar />
      <Header />
      <Suspense fallback={<div className="p-12 text-center text-sm">লোড হচ্ছে...</div>}>
        <CheckoutContent />
      </Suspense>
      <Footer />
    </div>
  );
}
