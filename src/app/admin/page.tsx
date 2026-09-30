"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  TrendingUp,
  DollarSign,
  Users,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Clock,
  Plus,
  ArrowRight,
} from "lucide-react";
import { formatBDT } from "@/lib/utils/formatters";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface DashboardData {
  todayOrders: number;
  todayRevenue: number;
  pendingOrders: number;
  processingOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalCustomers: number;
  lowStockCount: number;
  pendingReturns: number;
  revenueTrend: { date: string; revenue: number; orders: number }[];
  profit?: {
    totalRevenue: number;
    totalCogs: number;
    totalDiscount: number;
    grossProfit: number;
    profitMargin: number;
    totalOrders: number;
  };
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center p-16">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  const kpis = [
    {
      title: "আজকের বিক্রয়",
      value: formatBDT(data.todayRevenue),
      subtitle: `${data.todayOrders} টি অর্ডার থেকে`,
      icon: DollarSign,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      title: "পেন্ডিং অর্ডারসমূহ",
      value: data.pendingOrders,
      subtitle: "যাচাই ও কনফার্মেশন প্রয়োজন",
      icon: Clock,
      color: "text-amber-600 bg-amber-50",
    },
    {
      title: "প্রসেসিং ও শিপিং",
      value: data.processingOrders,
      subtitle: "প্যাকিং ও ডেলিভারি চলমান",
      icon: ShoppingBag,
      color: "text-sky-600 bg-sky-50",
    },
    {
      title: "ডেলিভারি সম্পন্ন",
      value: data.deliveredOrders,
      subtitle: "সফল লেনদেন",
      icon: CheckCircle2,
      color: "text-indigo-600 bg-indigo-50",
    },
    {
      title: "কম স্টক অ্যালার্ট",
      value: data.lowStockCount,
      subtitle: "অবিলম্বে রিস্টক প্রয়োজন",
      icon: AlertTriangle,
      color: "text-rose-600 bg-rose-50",
    },
    {
      title: "রিটার্ন অনুরোধ",
      value: data.pendingReturns,
      subtitle: "পর্যালোচনা অপেক্ষমাণ",
      icon: RotateCcw,
      color: "text-purple-600 bg-purple-50",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            ম্যানেজমেন্ট ড্যাশবোর্ড
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            এক নজরে আজকের ব্যবসায়িক পারফরম্যান্স, অর্ডার ফ্লো ও ইনভেন্টরি স্থিতি
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/new"
            className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন পণ্য যোগ করুন</span>
          </Link>
          <Link
            href="/admin/orders"
            className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4 text-sky-600" />
            <span>সকল অর্ডার</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">{kpi.title}</span>
                <div className={`p-2 rounded-xl ${kpi.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-extrabold text-slate-900 block">
                  {kpi.value}
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5 block">
                  {kpi.subtitle}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Revenue Trend Chart & Profit Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Trend Area Chart */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-sky-600" />
                <span>গত ৭ দিনের বিক্রয় প্রবাহ (Revenue Trend)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">দৈনিক অর্জিত আয় ও অর্ডার সংখ্যা</p>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.revenueTrend}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  formatter={(val: unknown) => [
                    formatBDT(Number(val) || 0),
                    "বিক্রয়",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#0284c7"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Profit Summary Widget */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 pb-2 border-b border-slate-100">
              লাভক্ষতি বিশ্লেষণ (COGS Profit)
            </h3>
            <p className="text-xs text-slate-400 mt-1 mb-4">
              ঐতিহাসিক ক্রয়মূল্য (Cost Snapshot) অনুযায়ী মোট লাভ
            </p>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-50">
                <span className="text-slate-500 font-medium">মোট রাজস্ব (Revenue)</span>
                <span className="font-bold text-slate-900">
                  {formatBDT(data.profit?.totalRevenue || 0)}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-50">
                <span className="text-slate-500 font-medium">বিক্রীত পণ্যের ব্যয় (COGS)</span>
                <span className="font-bold text-rose-600">
                  -{formatBDT(data.profit?.totalCogs || 0)}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-50">
                <span className="text-slate-500 font-medium">মোট ডিসকাউন্ট ছাড়</span>
                <span className="font-bold text-amber-600">
                  -{formatBDT(data.profit?.totalDiscount || 0)}
                </span>
              </div>
              <div className="flex justify-between py-2 text-sm font-extrabold text-slate-900 pt-2">
                <span>গ্রস প্রফিট (Gross Profit)</span>
                <span className="text-emerald-600 text-base">
                  {formatBDT(data.profit?.grossProfit || 0)}
                </span>
              </div>
              <div className="flex justify-between py-1 text-xs">
                <span className="text-slate-500">প্রফিট মার্জিন</span>
                <span className="font-black text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                  {data.profit?.profitMargin || 0}%
                </span>
              </div>
            </div>
          </div>

          <Link
            href="/admin/reports"
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold text-center block transition-colors shadow-xs"
          >
            বিস্তারিত রিপোর্ট দেখুন →
          </Link>
        </div>
      </div>
    </div>
  );
}
