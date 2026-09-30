"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Eye, Filter, ShoppingBag } from "lucide-react";
import { formatBDT, formatDateBD } from "@/lib/utils/formatters";
import { OrderDocument, OrderStatus } from "@/types/ecommerce";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderDocument[]>([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchOrders = async (status = statusFilter, q = search) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (status && status !== "ALL") params.append("status", status);
      if (q) params.append("search", q);
      params.append("limit", "50");

      const res = await fetch(`/api/orders?${params.toString()}`);
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

  useEffect(() => {
    fetchOrders(statusFilter, search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders(statusFilter, search);
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

  const filters = [
    { label: "সকল অর্ডার", val: "ALL" },
    { label: "অপেক্ষমাণ", val: "PENDING" },
    { label: "কনফার্মড", val: "CONFIRMED" },
    { label: "প্রসেসিং", val: "PROCESSING" },
    { label: "কুরিয়ারে পাঠানো", val: "SHIPPED" },
    { label: "ডেলিভারড", val: "DELIVERED" },
    { label: "বাতিল", val: "CANCELLED" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">অর্ডার ম্যানেজমেন্ট</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            সকল অর্ডারের স্থিতি পরিবর্তন, কুরিয়ার ট্র্যাকিং ও পেমেন্ট যাচাই করুন
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {filters.map((f) => (
            <button
              key={f.val}
              onClick={() => setStatusFilter(f.val)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                statusFilter === f.val
                  ? "bg-sky-600 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="অর্ডার নং / ফোন নম্বর..."
            className="px-3.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none min-w-[200px]"
          />
          <button
            type="submit"
            className="px-4 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold"
          >
            খুঁজুন
          </button>
        </form>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p>কোনো অর্ডার পাওয়া যায়নি</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">অর্ডার নম্বর</th>
                  <th className="py-3 px-4">গ্রাহক ও মোবাইল</th>
                  <th className="py-3 px-4">তারিখ</th>
                  <th className="py-3 px-4">মোট টাকা</th>
                  <th className="py-3 px-4">পেমেন্ট</th>
                  <th className="py-3 px-4">অর্ডার স্থিতি</th>
                  <th className="py-3 px-4 text-right">বিস্তারিত</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((ord) => {
                  const id = ord._id!;
                  const customerName =
                    ord.shippingAddress?.recipientName ||
                    ord.guestCustomerInfo?.name ||
                    "গ্রাহক";
                  const phone =
                    ord.shippingAddress?.phone || ord.guestCustomerInfo?.phone || "";

                  return (
                    <tr key={id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-black text-slate-900">
                        {ord.orderNumber}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-800 block">
                          {customerName}
                        </span>
                        <span className="text-slate-400 font-mono text-[11px]">
                          {phone}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {formatDateBD(ord.createdAt)}
                      </td>
                      <td className="py-3 px-4 font-extrabold text-slate-900">
                        {formatBDT(ord.grandTotal)}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold block">{ord.paymentMethod}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                            ord.paymentStatus === "PAID"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {ord.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-full border inline-block ${
                            statusColors[ord.orderStatus] || "text-slate-700 bg-slate-50"
                          }`}
                        >
                          {ord.orderStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/admin/orders/${id}`}
                          className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold rounded-xl transition-colors inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>ম্যানেজ</span>
                        </Link>
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
