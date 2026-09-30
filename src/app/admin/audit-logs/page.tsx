"use client";

import { useState, useEffect } from "react";
import { ShieldAlert, History } from "lucide-react";
import { formatDateBD } from "@/lib/utils/formatters";

interface AuditLogItem {
  _id: string;
  actor: { email: string; role: string };
  action: string;
  entityType: string;
  beforeSummary?: string;
  afterSummary?: string;
  reason?: string;
  createdAt: string;
}

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/audit")
      .then((res) => res.json())
      .then((data) => {
        setLogs(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">অডিট লগ ও নিরাপত্তা রেকর্ড</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          সংবেদনশীল কার্যকলাপে (মূল্য পরিবর্তন, স্টক সমন্বয়, স্ট্যাটাস পরিবর্তন) জড়িতদের রেকর্ড
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            কোনো অডিট লগ পাওয়া যায়নি
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">তারিখ ও সময়</th>
                  <th className="py-3 px-4">ইউজার ও রোল</th>
                  <th className="py-3 px-4">অ্যাকশন</th>
                  <th className="py-3 px-4">এনটিটি</th>
                  <th className="py-3 px-4">পরিবর্তনের বিবরণ</th>
                  <th className="py-3 px-4 text-right">কারণ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                      {formatDateBD(log.createdAt)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-800 block">
                        {log.actor.email}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {log.actor.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-sky-700">
                      {log.action}
                    </td>
                    <td className="py-3 px-4 uppercase font-semibold text-slate-600">
                      {log.entityType}
                    </td>
                    <td className="py-3 px-4 text-slate-700 max-w-sm">
                      {log.afterSummary || log.beforeSummary || "—"}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-500">
                      {log.reason || "স্বাভাবিক প্রক্রিয়া"}
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
