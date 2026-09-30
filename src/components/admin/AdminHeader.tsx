"use client";

import { Bell, ShieldCheck, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function AdminHeader() {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Single-Tenant Security Verified</span>
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs">
            <User className="w-4 h-4" />
          </div>
          <div className="text-left hidden sm:block">
            <span className="text-xs font-bold text-slate-800 block leading-tight">
              {user?.displayName || "Aulad Administrator"}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              Role: OWNER
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
