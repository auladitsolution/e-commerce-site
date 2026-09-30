"use client";

import { useState, useEffect } from "react";
import { BarChart3, DollarSign, TrendingUp, Percent, Download } from "lucide-react";
import { formatBDT } from "@/lib/utils/formatters";

interface ProfitData {
  totalRevenue: number;
  totalCogs: number;
  totalDiscount: number;
  grossProfit: number;
  profitMargin: number;
  totalOrders: number;
}

export default function AdminReportsPage() {
  const [profit, setProfit] = useState<ProfitData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((res) => res.json())
      .then((d) => {
        setProfit(d.profit);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  }, []);

  const handleExportCSV = () => {
    if (!profit) return;
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Metric,Amount\n" +
      `Total Revenue,${profit.totalRevenue}\n` +
      `COGS (Cost of Goods Sold),${profit.totalCogs}\n` +
      `Discounts,${profit.totalDiscount}\n` +
      `Gross Profit,${profit.grossProfit}\n` +
      `Profit Margin,${profit.profitMargin}%\n` +
      `Total Completed Orders,${profit.totalOrders}\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sales_profit_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            ব্যবসায়িক রিপোর্ট ও লাভক্ষতি (Profit & Loss)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            ঐতিহাসিক পণ্যের ক্রয়মূল্য (COGS Snapshot) ভিত্তিক নির্ভুল ব্যবসায়িক লাভ বিশ্লেষণ
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          disabled={!profit}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center gap-2 self-start sm:self-auto disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>CSV রিপোর্ট ডাউনলোড করুন</span>
        </button>
      </div>

      {loading || !profit ? (
        <div className="flex justify-center p-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Main Financial KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                মোট বিক্রয় রাজস্ব (Revenue)
              </span>
              <span className="text-2xl font-black text-slate-900 block">
                {formatBDT(profit.totalRevenue)}
              </span>
              <span className="text-[11px] text-slate-400 block">
                {profit.totalOrders} টি কনফার্মড অর্ডার থেকে
              </span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                পণ্য কেনা বাবদ খরচ (COGS)
              </span>
              <span className="text-2xl font-black text-rose-600 block">
                {formatBDT(profit.totalCogs)}
              </span>
              <span className="text-[11px] text-slate-400 block">
                অর্ডারের সময়ের ক্রয়মূল্য সংরক্ষিত
              </span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                গ্রস প্রফিট (মোট লাভ)
              </span>
              <span className="text-2xl font-black text-emerald-600 block">
                {formatBDT(profit.grossProfit)}
              </span>
              <span className="text-[11px] text-emerald-600 font-bold block">
                নেট প্রফিট মার্জিন: {profit.profitMargin}%
              </span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                মোট ডিসকাউন্ট ছাড়
              </span>
              <span className="text-2xl font-black text-amber-600 block">
                {formatBDT(profit.totalDiscount)}
              </span>
              <span className="text-[11px] text-slate-400 block">
                কুপন ও অফার ছাড়
              </span>
            </div>
          </div>

          {/* Detailed Statement Table */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-6">
            <h3 className="font-extrabold text-slate-900 text-base pb-3 border-b border-slate-100 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-sky-600" />
              <span>আর্থিক হিসাব বিবরণী (Financial Statement)</span>
            </h3>

            <div className="max-w-2xl divide-y divide-slate-100 text-sm">
              <div className="py-3 flex justify-between">
                <span className="text-slate-600">১. মোট পণ্য বিক্রয় (Gross Sales Revenue)</span>
                <span className="font-bold text-slate-900">{formatBDT(profit.totalRevenue)}</span>
              </div>
              <div className="py-3 flex justify-between text-rose-600 font-semibold">
                <span>২. বিক্রীত পণ্যের উৎপাদন/ক্রয় মূল্য (Cost of Goods Sold)</span>
                <span>-{formatBDT(profit.totalCogs)}</span>
              </div>
              <div className="py-3 flex justify-between text-amber-600 font-semibold">
                <span>৩. ডিসকাউন্ট ও কুপন ভর্তুকি</span>
                <span>-{formatBDT(profit.totalDiscount)}</span>
              </div>
              <div className="py-4 flex justify-between text-base font-extrabold text-slate-900 border-t-2 border-slate-200">
                <span>মোট অর্জিত মুনাফা (Gross Profit)</span>
                <span className="text-emerald-600 text-xl">{formatBDT(profit.grossProfit)}</span>
              </div>
              <div className="py-2 flex justify-between text-xs text-slate-500">
                <span>মুনাফার হার (Margin Percentage)</span>
                <span className="font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full">
                  {profit.profitMargin}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
