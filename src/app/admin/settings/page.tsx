"use client";

import { useState, useEffect } from "react";
import { Settings, Save, ShieldCheck, Palette, Sliders, Store } from "lucide-react";
import { StoreSettingsConfig } from "@/types/ecommerce";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<StoreSettingsConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        setSettings(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        toast.success("স্টোর সেটিংস ও থিম সফলভাবে সংরক্ষিত হয়েছে!");
      } else {
        toast.error("সংরক্ষণ ব্যর্থ হয়েছে");
      }
    } catch {
      toast.error("সার্ভার ত্রুটি");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="flex justify-center p-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">স্টোর সেটিংস ও কনফিগারেশন</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            ব্র্যান্ডিং, থিম টোকেন, ফিচার ফ্ল্যাগস ও কমার্স নীতি পরিচালনা করুন
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Store Profile */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-2 flex items-center gap-2">
            <Store className="w-4 h-4 text-sky-600" />
            <span>১. স্টোর পরিচিতি ও প্রোফাইল</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                দোকানের নাম (বাংলা):
              </label>
              <input
                type="text"
                value={settings.storeProfile.nameBn}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    storeProfile: { ...settings.storeProfile, nameBn: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Store Name (English):
              </label>
              <input
                type="text"
                value={settings.storeProfile.nameEn}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    storeProfile: { ...settings.storeProfile, nameEn: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                হেল্পলাইন ফোন:
              </label>
              <input
                type="text"
                value={settings.storeProfile.phone}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    storeProfile: { ...settings.storeProfile, phone: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                সাপোর্ট ইমেইল:
              </label>
              <input
                type="email"
                value={settings.storeProfile.email}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    storeProfile: { ...settings.storeProfile, email: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                অফিস ঠিকানা:
              </label>
              <input
                type="text"
                value={settings.storeProfile.address}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    storeProfile: { ...settings.storeProfile, address: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>
        </div>

        {/* Theme Settings */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-2 flex items-center gap-2">
            <Palette className="w-4 h-4 text-sky-600" />
            <span>২. থিম ও ব্র্যান্ড কালার টোকেন</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                প্রাইমারি ব্র্যান্ড কালার (HEX):
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={settings.theme.primaryColor}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      theme: { ...settings.theme, primaryColor: e.target.value },
                    })
                  }
                  className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200"
                />
                <input
                  type="text"
                  value={settings.theme.primaryColor}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      theme: { ...settings.theme, primaryColor: e.target.value },
                    })
                  }
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                অ্যাকসেন্ট কালার (HEX):
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={settings.theme.accentColor}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      theme: { ...settings.theme, accentColor: e.target.value },
                    })
                  }
                  className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200"
                />
                <input
                  type="text"
                  value={settings.theme.accentColor}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      theme: { ...settings.theme, accentColor: e.target.value },
                    })
                  }
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              অ্যানাউন্সমেন্ট বার টেক্সট:
            </label>
            <input
              type="text"
              value={settings.theme.announcementText}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  theme: { ...settings.theme, announcementText: e.target.value },
                })
              }
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>
        </div>

        {/* Feature Flags */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-2 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-sky-600" />
            <span>৩. ফিচার ফ্ল্যাগস (Feature Flags)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { key: "guestCheckout", label: "গেস্ট চেকআউট সুবিধা" },
              { key: "wishlist", label: "পছন্দের তালিকা (Wishlist)" },
              { key: "reviews", label: "গ্রাহক রিভিউ ও রেটিং" },
              { key: "flashSale", label: "ফ্ল্যাশ সেল সেকশন" },
              { key: "coupons", label: "ডিসকাউন্ট কুপন ইঞ্জিন" },
              { key: "brands", label: "ব্র্যান্ড ফিল্টার" },
              { key: "recommendations", label: "সম্পর্কিত পণ্য সুপারিশ" },
              { key: "bulkProductManagement", label: "বাল্ক এক্সপোর্ট সাপোর্ট" },
              { key: "customerAccounts", label: "কাস্টমার অ্যাকাউন্ট ড্যাশবোর্ড" },
            ].map((f) => (
              <label
                key={f.key}
                className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={
                    settings.features[f.key as keyof typeof settings.features] as boolean
                  }
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      features: {
                        ...settings.features,
                        [f.key]: e.target.checked,
                      },
                    })
                  }
                  className="rounded text-sky-600"
                />
                <span className="text-xs font-bold text-slate-800">{f.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "সংরক্ষণ হচ্ছে..." : "সকল সেটিংস সংরক্ষণ করুন"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
