"use client";

import { useState, useEffect, useRef } from "react";
import {
  Save,
  Store,
  Megaphone,
  Sparkles,
  Gift,
  ShieldCheck,
  Mail,
  Truck,
  Palette,
  Sliders,
  Upload,
  Eye,
  ExternalLink,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  MapPin,
  Phone,
  Link as LinkIcon,
} from "lucide-react";
import { StoreSettingsConfig } from "@/types/ecommerce";
import { toast } from "sonner";

type TabKey =
  | "branding"
  | "announcement"
  | "hero"
  | "promo"
  | "trust"
  | "newsletter"
  | "footer"
  | "shipping"
  | "theme"
  | "features";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<StoreSettingsConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("branding");
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  const logoFileRef = useRef<HTMLInputElement>(null);
  const faviconFileRef = useRef<HTMLInputElement>(null);
  const heroImageFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        setSettings(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Admin settings fetch error:", err);
        setLoading(false);
      });
  }, []);

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldKey: string,
    updateFn: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(fieldKey);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "ecommerce/branding");

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && (data.url || data.secure_url)) {
        const imageUrl = data.url || data.secure_url;
        updateFn(imageUrl);
        toast.success("ছবি সফলভাবে আপলোড হয়েছে!");
      } else {
        toast.error(data.error || "আপলোড ব্যর্থ হয়েছে");
      }
    } catch {
      toast.error("আপলোডে সার্ভার সমস্যা হয়েছে");
    } finally {
      setUploadingField(null);
      e.target.value = "";
    }
  };

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
        const updated = await res.json();
        setSettings(updated);
        toast.success("সকল সেটিংস ও কনফিগারেশন সফলভাবে সংরক্ষিত হয়েছে!");
      } else {
        toast.error("সংরক্ষণ ব্যর্থ হয়েছে");
      }
    } catch {
      toast.error("সার্ভার ত্রুটি");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="flex flex-col items-center justify-center p-24 space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-600"></div>
        <p className="text-xs text-slate-500 font-medium">
          স্টোর কাস্টমাইজেশন প্যানেল লোড হচ্ছে...
        </p>
      </div>
    );
  }

  const tabs: { key: TabKey; label: string; icon: React.ElementType }[] = [
    { key: "branding", label: "স্টোর ও ব্র্যান্ডিং", icon: Store },
    { key: "announcement", label: "টপ নোটিফিকেশন বার", icon: Megaphone },
    { key: "hero", label: "হিরো ব্যানার ও শোকেস", icon: Sparkles },
    { key: "promo", label: "প্রমোশনাল অফার ব্যানার", icon: Gift },
    { key: "trust", label: "ট্রাস্ট ব্যাজ ও সুবিধা", icon: ShieldCheck },
    { key: "newsletter", label: "নিউজলেটার সেকশন", icon: Mail },
    { key: "footer", label: "ফুটার ও যোগাযোগ", icon: Clock },
    { key: "shipping", label: "শিপিং ও ডেলিভারি রেট", icon: Truck },
    { key: "theme", label: "থিম ও ব্র্যান্ড কালার", icon: Palette },
    { key: "features", label: "ফিচার ফ্ল্যাগস", icon: Sliders },
  ];

  return (
    <div className="space-y-6 max-w-6xl pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900">
              সাইট কাস্টমাইজেশন ও স্টোর সেটিংস
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
              লাইভ সিঙ্ক
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            সাইটে প্রদর্শিত ব্যানার, টেক্সট, লোগো, হেল্পলাইন, ডেলিভারি চার্জ ও থিম এখান থেকেই সরাসরি পরিবর্তন করুন।
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>স্টোরফ্রন্টে দেখুন</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-md shadow-sky-600/20 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "সংরক্ষণ হচ্ছে..." : "পরিবর্তন সংরক্ষণ করুন"}</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-amber-400" : "text-slate-400"}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* ===================== TAB 1: BRANDING ===================== */}
        {activeTab === "branding" && (
          <div className="space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <Store className="w-5 h-5 text-sky-600" />
                  <span>দোকানের নাম ও পরিচিতি (Store Profile)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  হেডার, ফুটার এবং ব্রাউজার ট্যাবে প্রদর্শিত নাম ও লোগো নির্ধারণ করুন
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
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
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
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
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    দোকানের স্লোগান / ট্যাগলাইন:
                  </label>
                  <input
                    type="text"
                    value={settings.storeProfile.tagline || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        storeProfile: { ...settings.storeProfile, tagline: e.target.value },
                      })
                    }
                    placeholder="যেমন: বিশ্বস্ত অনলাইন শপিং প্ল্যাটফর্ম"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Logo & Favicon Upload */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                {/* Store Logo */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-800 block">
                    দোকানের মূল লোগো (Store Logo):
                  </label>
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                      {settings.storeProfile.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={settings.storeProfile.logo}
                          alt="Logo Preview"
                          className="w-full h-full object-contain p-1"
                        />
                      ) : (
                        <Store className="w-8 h-8 text-slate-300" />
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={settings.storeProfile.logo || ""}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            storeProfile: { ...settings.storeProfile, logo: e.target.value },
                          })
                        }
                        placeholder="ছবির URL লিখুন বা আপলোড করুন..."
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                      />
                      <input
                        type="file"
                        ref={logoFileRef}
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleFileUpload(e, "logo", (url) =>
                            setSettings({
                              ...settings,
                              storeProfile: { ...settings.storeProfile, logo: url },
                            })
                          )
                        }
                      />
                      <button
                        type="button"
                        onClick={() => logoFileRef.current?.click()}
                        disabled={uploadingField === "logo"}
                        className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>
                          {uploadingField === "logo" ? "আপলোড হচ্ছে..." : "কম্পিউটার থেকে লোগো আপলোড"}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Favicon */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-800 block">
                    ব্রাউজার ফেভিকন (Favicon Icon):
                  </label>
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                      {settings.storeProfile.favicon ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={settings.storeProfile.favicon}
                          alt="Favicon Preview"
                          className="w-10 h-10 object-contain"
                        />
                      ) : (
                        <Sparkles className="w-8 h-8 text-slate-300" />
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={settings.storeProfile.favicon || ""}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            storeProfile: { ...settings.storeProfile, favicon: e.target.value },
                          })
                        }
                        placeholder="ফেভিকন আইকন URL..."
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                      />
                      <input
                        type="file"
                        ref={faviconFileRef}
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleFileUpload(e, "favicon", (url) =>
                            setSettings({
                              ...settings,
                              storeProfile: { ...settings.storeProfile, favicon: url },
                            })
                          )
                        }
                      />
                      <button
                        type="button"
                        onClick={() => faviconFileRef.current?.click()}
                        disabled={uploadingField === "favicon"}
                        className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>
                          {uploadingField === "favicon" ? "আপলোড হচ্ছে..." : "ফেভিকন আপলোড"}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="border-t border-slate-100 pt-6">
                <h4 className="font-bold text-slate-900 text-xs mb-3 uppercase tracking-wider text-slate-400">
                  যোগাযোগ ও কাস্টমার সাপোর্ট তথ্য
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium"
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
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      গ্রাহক সেবা কার্যঘণ্টা:
                    </label>
                    <input
                      type="text"
                      value={settings.storeProfile.workingHours || ""}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          storeProfile: { ...settings.storeProfile, workingHours: e.target.value },
                        })
                      }
                      placeholder="যেমন: সকাল ৯টা - রাত ১০টা"
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                    />
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3">
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      অফিস / শোরুম ঠিকানা:
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
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="border-t border-slate-100 pt-6">
                <h4 className="font-bold text-slate-900 text-xs mb-3 uppercase tracking-wider text-slate-400">
                  সোশ্যাল মিডিয়া পেজ লিংক
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Facebook URL:
                    </label>
                    <input
                      type="text"
                      value={settings.storeProfile.facebook || ""}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          storeProfile: { ...settings.storeProfile, facebook: e.target.value },
                        })
                      }
                      placeholder="https://facebook.com/yourpage"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      WhatsApp Number:
                    </label>
                    <input
                      type="text"
                      value={settings.storeProfile.whatsapp || ""}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          storeProfile: { ...settings.storeProfile, whatsapp: e.target.value },
                        })
                      }
                      placeholder="01700000000"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Instagram URL:
                    </label>
                    <input
                      type="text"
                      value={settings.storeProfile.instagram || ""}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          storeProfile: { ...settings.storeProfile, instagram: e.target.value },
                        })
                      }
                      placeholder="https://instagram.com/yourhandle"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      YouTube URL:
                    </label>
                    <input
                      type="text"
                      value={settings.storeProfile.youtube || ""}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          storeProfile: { ...settings.storeProfile, youtube: e.target.value },
                        })
                      }
                      placeholder="https://youtube.com/@channel"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 2: ANNOUNCEMENT BAR ===================== */}
        {activeTab === "announcement" && (
          <div className="space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                    <Megaphone className="w-5 h-5 text-sky-600" />
                    <span>টপ অ্যানাউন্সমেন্ট বার কনফিগারেশন</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    সাইটের একেবারে শীর্ষে প্রদর্শিত নোটিফিকেশন বার
                  </p>
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                  <span className="text-xs font-bold text-slate-700">বারটি চালু রাখুন:</span>
                  <input
                    type="checkbox"
                    checked={settings.announcement?.enabled !== false}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        announcement: {
                          ...settings.announcement,
                          enabled: e.target.checked,
                        },
                      })
                    }
                    className="w-5 h-5 text-sky-600 rounded"
                  />
                </label>
              </div>

              {/* Live Preview Box */}
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  লাইভ প্রিভিউ (সরাসরি যেমন দেখাবে):
                </label>
                <div className="bg-sky-950 text-sky-100 text-xs py-2 px-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-2 shadow-inner">
                  <div className="flex items-center gap-2">
                    <Truck className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                    <span className="font-medium text-amber-300">
                      {settings.announcement?.text || "৳১,৫০০+ অর্ডারে সমগ্র বাংলাদেশে ফ্রি হোম ডেলিভারি!"}
                    </span>
                    <span className="hidden md:inline text-sky-400">|</span>
                    <span className="hidden md:inline text-sky-200">
                      {settings.announcement?.highlightText || "১০০% অথেনটিক ও ক্যাশ অন ডেলিভারি"}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sky-200 text-xs">
                    <span>{settings.announcement?.phoneText || `হেল্পলাইন: ${settings.storeProfile.phone}`}</span>
                    <span className="text-amber-300 underline font-medium">
                      {settings.announcement?.trackText || "অর্ডার ট্র্যাক করুন"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    প্রধান অফার / ডেলিভারি টেক্সট:
                  </label>
                  <input
                    type="text"
                    value={settings.announcement?.text || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        announcement: { ...settings.announcement, text: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      হাইলাইট ট্রাস্ট টেক্সট:
                    </label>
                    <input
                      type="text"
                      value={settings.announcement?.highlightText || ""}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          announcement: {
                            ...settings.announcement,
                            highlightText: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      হেল্পলাইন লেবেল টেক্সট:
                    </label>
                    <input
                      type="text"
                      value={settings.announcement?.phoneText || ""}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          announcement: {
                            ...settings.announcement,
                            phoneText: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      ট্র্যাকিং বাটন টেক্সট:
                    </label>
                    <input
                      type="text"
                      value={settings.announcement?.trackText || ""}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          announcement: {
                            ...settings.announcement,
                            trackText: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 3: HERO BANNER & SHOWCASE ===================== */}
        {activeTab === "hero" && (
          <div className="space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <span>হোমপেজ হিরো ব্যানার ও শোকেস কার্ড কাস্টমাইজেশন</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  হোমপেজের প্রধান হেডলাইন, বাটন, ব্যানার ছবি ও আকর্ষণীয় প্রমোশন পরিবর্তন করুন
                </p>
              </div>

              {/* Title & Badge */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    টপ অফার ব্যাজ টেক্সট:
                  </label>
                  <input
                    type="text"
                    value={settings.hero?.badgeText || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        hero: { ...settings.hero, badgeText: e.target.value },
                      })
                    }
                    placeholder="যেমন: ধামাকা সিজনাল অফার — সর্বোচ্চ ৫০% পর্যন্ত ছাড়!"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      শিরোনাম অংশ ১ (Line 1):
                    </label>
                    <input
                      type="text"
                      value={settings.hero?.titleLine1 || ""}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          hero: { ...settings.hero, titleLine1: e.target.value },
                        })
                      }
                      placeholder="যেমন: স্মার্ট কেনাকাটায়"
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1 text-sky-600">
                      রঙিন হাইলাইট টেক্সট (Highlight):
                    </label>
                    <input
                      type="text"
                      value={settings.hero?.titleHighlight || ""}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          hero: { ...settings.hero, titleHighlight: e.target.value },
                        })
                      }
                      placeholder="যেমন: স্মার্ট শপ"
                      className="w-full px-3.5 py-2 bg-sky-50 border border-sky-300 rounded-xl text-xs font-bold text-sky-800"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      শিরোনাম অংশ ২ (Line 2):
                    </label>
                    <input
                      type="text"
                      value={settings.hero?.titleLine2 || ""}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          hero: { ...settings.hero, titleLine2: e.target.value },
                        })
                      }
                      placeholder="যেমন: আপনার পাশে"
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    বিস্তারিত বিবরণ / সাবটাইটেল:
                  </label>
                  <textarea
                    rows={3}
                    value={settings.hero?.description || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        hero: { ...settings.hero, description: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white"
                  />
                </div>
              </div>

              {/* Call to Action Buttons */}
              <div className="border-t border-slate-100 pt-5">
                <h4 className="font-bold text-slate-800 text-xs mb-3">
                  অ্যাকশন বাটন (Buttons & Links)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                    <span className="text-xs font-bold text-sky-700 block">১ম বাটন (Primary CTA)</span>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                        বাটনের নাম:
                      </label>
                      <input
                        type="text"
                        value={settings.hero?.cta1Text || ""}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            hero: { ...settings.hero, cta1Text: e.target.value },
                          })
                        }
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                        বাটন লিংক (URL):
                      </label>
                      <input
                        type="text"
                        value={settings.hero?.cta1Link || ""}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            hero: { ...settings.hero, cta1Link: e.target.value },
                          })
                        }
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                    <span className="text-xs font-bold text-amber-700 block">২য় বাটন (Secondary CTA)</span>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                        বাটনের নাম:
                      </label>
                      <input
                        type="text"
                        value={settings.hero?.cta2Text || ""}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            hero: { ...settings.hero, cta2Text: e.target.value },
                          })
                        }
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                        বাটন লিংক (URL):
                      </label>
                      <input
                        type="text"
                        value={settings.hero?.cta2Link || ""}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            hero: { ...settings.hero, cta2Link: e.target.value },
                          })
                        }
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Showcase Banner Graphic */}
              <div className="border-t border-slate-100 pt-5">
                <h4 className="font-bold text-slate-800 text-xs mb-3">
                  হিরো শোকেস কার্ড ও ছবি (Showcase Image & Card)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        ব্যানার ছবির লিংক (Image URL):
                      </label>
                      <input
                        type="text"
                        value={settings.hero?.showcaseImage || ""}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            hero: { ...settings.hero, showcaseImage: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                      />
                    </div>

                    <input
                      type="file"
                      ref={heroImageFileRef}
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleFileUpload(e, "heroImage", (url) =>
                          setSettings({
                            ...settings,
                            hero: { ...settings.hero, showcaseImage: url },
                          })
                        )
                      }
                    />

                    <button
                      type="button"
                      onClick={() => heroImageFileRef.current?.click()}
                      disabled={uploadingField === "heroImage"}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      <span>
                        {uploadingField === "heroImage" ? "আপলোড হচ্ছে..." : "নতুন ব্যানার ছবি আপলোড করুন"}
                      </span>
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                          কার্ড ব্যাজ:
                        </label>
                        <input
                          type="text"
                          value={settings.hero?.showcaseBadge || ""}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              hero: { ...settings.hero, showcaseBadge: e.target.value },
                            })
                          }
                          className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                          কার্ড টাইটেল:
                        </label>
                        <input
                          type="text"
                          value={settings.hero?.showcaseTitle || ""}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              hero: { ...settings.hero, showcaseTitle: e.target.value },
                            })
                          }
                          className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                          প্রাইস ট্যাগ:
                        </label>
                        <input
                          type="text"
                          value={settings.hero?.showcasePriceTag || ""}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              hero: { ...settings.hero, showcasePriceTag: e.target.value },
                            })
                          }
                          className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-amber-600"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Card Preview */}
                  <div className="bg-slate-900 p-4 rounded-3xl text-white space-y-2">
                    <span className="text-[10px] text-slate-400 font-mono block">কার্ড প্রিভিউ:</span>
                    <div className="relative rounded-2xl overflow-hidden h-48 bg-slate-800">
                      {settings.hero?.showcaseImage && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={settings.hero.showcaseImage}
                          alt="Showcase Preview"
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute bottom-2 left-2 right-2 bg-slate-950/80 backdrop-blur-md p-2.5 rounded-xl flex items-center justify-between border border-white/10">
                        <div>
                          <span className="text-amber-400 text-[10px] font-bold block">
                            {settings.hero?.showcaseBadge || "নতুন ট্রেন্ড"}
                          </span>
                          <span className="text-white text-xs font-bold">
                            {settings.hero?.showcaseTitle || "এক্সক্লুসিভ কালেকশন"}
                          </span>
                        </div>
                        <span className="text-[10px] bg-amber-400 text-slate-950 font-extrabold px-2 py-1 rounded-lg">
                          {settings.hero?.showcasePriceTag || "শুরু ৳৪৯৯"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3 Mini Trust Bullets */}
              <div className="border-t border-slate-100 pt-5">
                <h4 className="font-bold text-slate-800 text-xs mb-3">
                  হিরো ব্যানারের ৩টি কুইক ট্রাস্ট পয়েন্ট
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={settings.hero?.trustItem1 || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        hero: { ...settings.hero, trustItem1: e.target.value },
                      })
                    }
                    placeholder="১ম ট্রাস্ট পয়েন্ট"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                  <input
                    type="text"
                    value={settings.hero?.trustItem2 || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        hero: { ...settings.hero, trustItem2: e.target.value },
                      })
                    }
                    placeholder="২য় ট্রাস্ট পয়েন্ট"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                  <input
                    type="text"
                    value={settings.hero?.trustItem3 || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        hero: { ...settings.hero, trustItem3: e.target.value },
                      })
                    }
                    placeholder="৩য় ট্রাস্ট পয়েন্ট"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 4: PROMOTIONAL MID-BANNER ===================== */}
        {activeTab === "promo" && (
          <div className="space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                    <Gift className="w-5 h-5 text-indigo-600" />
                    <span>প্রমোশনাল অফার মিড-ব্যানার (Promotional Mid-Banner)</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    হোমপেজের মাঝখানে প্রদর্শিত আকর্ষণীয় অফার ও কুপন ব্যানার
                  </p>
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                  <span className="text-xs font-bold text-slate-700">ব্যানার চালু রাখুন:</span>
                  <input
                    type="checkbox"
                    checked={settings.promotionalBanner?.enabled !== false}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        promotionalBanner: {
                          ...settings.promotionalBanner,
                          enabled: e.target.checked,
                        },
                      })
                    }
                    className="w-5 h-5 text-sky-600 rounded"
                  />
                </label>
              </div>

              {/* Banner Live Preview */}
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  লাইভ প্রিভিউ:
                </label>
                <div className="rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-sky-900 via-indigo-950 to-slate-950 text-white shadow-lg space-y-3">
                  <span className="px-2.5 py-0.5 bg-amber-400 text-slate-950 rounded-full text-[10px] font-black uppercase tracking-wider inline-block">
                    {settings.promotionalBanner?.badge || "এক্সক্লুসিভ ডিল"}
                  </span>
                  <h4 className="text-xl sm:text-2xl font-black">
                    {settings.promotionalBanner?.title || "বিকাশ অথবা নগদে প্রি-পেমেন্টে বিশেষ ক্যাশব্যাক অফার!"}
                  </h4>
                  <p className="text-slate-300 text-xs sm:text-sm">
                    {settings.promotionalBanner?.description || "যেকোনো অর্ডারে ফ্রি ডেলিভারি পেতে কুপন কোড ব্যবহার করুন: "}
                    <span className="font-mono font-bold text-amber-300 bg-white/10 px-2 py-0.5 rounded ml-1">
                      {settings.promotionalBanner?.couponCode || "FREESHIP"}
                    </span>
                  </p>
                  <div className="pt-2">
                    <span className="inline-block px-4 py-2 bg-white text-slate-950 font-bold rounded-xl text-xs">
                      {settings.promotionalBanner?.buttonText || "অফার পণ্য দেখুন"} →
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    অফার ব্যাজ টেক্সট:
                  </label>
                  <input
                    type="text"
                    value={settings.promotionalBanner?.badge || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        promotionalBanner: {
                          ...settings.promotionalBanner,
                          badge: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    প্রদর্শিত কুপন কোড:
                  </label>
                  <input
                    type="text"
                    value={settings.promotionalBanner?.couponCode || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        promotionalBanner: {
                          ...settings.promotionalBanner,
                          couponCode: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3.5 py-2 bg-amber-50 border border-amber-300 text-amber-900 rounded-xl text-xs font-mono font-black"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    প্রধান আকর্ষণীয় শিরোনাম:
                  </label>
                  <input
                    type="text"
                    value={settings.promotionalBanner?.title || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        promotionalBanner: {
                          ...settings.promotionalBanner,
                          title: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    অফার বিবরণ / নিয়মাবলী:
                  </label>
                  <input
                    type="text"
                    value={settings.promotionalBanner?.description || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        promotionalBanner: {
                          ...settings.promotionalBanner,
                          description: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    বাটন টেক্সট:
                  </label>
                  <input
                    type="text"
                    value={settings.promotionalBanner?.buttonText || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        promotionalBanner: {
                          ...settings.promotionalBanner,
                          buttonText: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    বাটন লিংক (URL):
                  </label>
                  <input
                    type="text"
                    value={settings.promotionalBanner?.buttonLink || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        promotionalBanner: {
                          ...settings.promotionalBanner,
                          buttonLink: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 5: TRUST BADGES ===================== */}
        {activeTab === "trust" && (
          <div className="space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <span>গ্রাহক আস্থা ও ট্রাস্ট ব্যাজ (Trust Badges)</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    দ্রুত ডেলিভারি, ক্যাশ অন ডেলিভারি, রিটার্ন পলিসি ও ২৪/৭ সাপোর্টের মতো ৪টি কার্ড পরিচালনা করুন
                  </p>
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                  <span className="text-xs font-bold text-slate-700">সেকশন চালু রাখুন:</span>
                  <input
                    type="checkbox"
                    checked={settings.trustBadges?.enabled !== false}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        trustBadges: {
                          ...settings.trustBadges,
                          enabled: e.target.checked,
                        },
                      })
                    }
                    className="w-5 h-5 text-sky-600 rounded"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(settings.trustBadges?.items || []).map((item, idx) => (
                  <div
                    key={idx}
                    className="p-5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-slate-800">
                        ব্যাজ #{idx + 1}
                      </span>
                      <select
                        value={item.icon || "Truck"}
                        onChange={(e) => {
                          const newItems = [...settings.trustBadges.items];
                          newItems[idx] = { ...newItems[idx], icon: e.target.value };
                          setSettings({
                            ...settings,
                            trustBadges: { ...settings.trustBadges, items: newItems },
                          });
                        }}
                        className="text-xs bg-white border border-slate-200 rounded-lg px-2 py-1 font-semibold"
                      >
                        <option value="Truck">ডেলিভারি আইকন (Truck)</option>
                        <option value="ShieldCheck">নিরাপত্তা আইকন (Shield)</option>
                        <option value="RotateCcw">রিটার্ন আইকন (Rotate)</option>
                        <option value="Headphones">সাপোর্ট আইকন (Headphones)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                        শিরোনাম:
                      </label>
                      <input
                        type="text"
                        value={item.title || ""}
                        onChange={(e) => {
                          const newItems = [...settings.trustBadges.items];
                          newItems[idx] = { ...newItems[idx], title: e.target.value };
                          setSettings({
                            ...settings,
                            trustBadges: { ...settings.trustBadges, items: newItems },
                          });
                        }}
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                        সাবটাইটেল / বিবরণ:
                      </label>
                      <input
                        type="text"
                        value={item.subtitle || ""}
                        onChange={(e) => {
                          const newItems = [...settings.trustBadges.items];
                          newItems[idx] = { ...newItems[idx], subtitle: e.target.value };
                          setSettings({
                            ...settings,
                            trustBadges: { ...settings.trustBadges, items: newItems },
                          });
                        }}
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 6: NEWSLETTER ===================== */}
        {activeTab === "newsletter" && (
          <div className="space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                    <Mail className="w-5 h-5 text-sky-600" />
                    <span>নিউজলেটার ও সাবস্ক্রিপশন সেকশন</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    ফুটারের উপরে অবস্থিত গ্রাহক সাবস্ক্রিপশন ব্লক
                  </p>
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                  <span className="text-xs font-bold text-slate-700">সেকশন চালু রাখুন:</span>
                  <input
                    type="checkbox"
                    checked={settings.newsletter?.enabled !== false}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        newsletter: {
                          ...settings.newsletter,
                          enabled: e.target.checked,
                        },
                      })
                    }
                    className="w-5 h-5 text-sky-600 rounded"
                  />
                </label>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    প্রধান শিরোনাম:
                  </label>
                  <input
                    type="text"
                    value={settings.newsletter?.title || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        newsletter: { ...settings.newsletter, title: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    সাবটাইটেল / উৎসাহমূলক বার্তা:
                  </label>
                  <textarea
                    rows={2}
                    value={settings.newsletter?.subtitle || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        newsletter: { ...settings.newsletter, subtitle: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div className="max-w-xs">
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    বাটন টেক্সট:
                  </label>
                  <input
                    type="text"
                    value={settings.newsletter?.buttonText || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        newsletter: { ...settings.newsletter, buttonText: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 7: FOOTER & CONTACT ===================== */}
        {activeTab === "footer" && (
          <div className="space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <Clock className="w-5 h-5 text-indigo-600" />
                  <span>ফুটার ও লিগ্যাল নোটিশ কাস্টমাইজেশন</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  ফুটারের ব্র্যান্ড তথ্য, কপিরাইট, পেমেন্ট ব্যাজ ও ডেভেলপার ক্রেডিট পরিচালনা করুন
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    কোম্পানি পরিচিতি টেক্সট (About Company Bio):
                  </label>
                  <textarea
                    rows={3}
                    value={settings.footer?.aboutText || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        footer: { ...settings.footer, aboutText: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      কপিরাইট নোটিশ (Copyright Text):
                    </label>
                    <input
                      type="text"
                      value={settings.footer?.copyrightText || ""}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          footer: { ...settings.footer, copyrightText: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      আইটি / ডেভেলপার ক্রেডিট:
                    </label>
                    <input
                      type="text"
                      value={settings.footer?.devCreditText || ""}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          footer: { ...settings.footer, devCreditText: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    অনুমোদিত পেমেন্ট মেথড ব্যাজ (কমা দিয়ে পৃথক করুন):
                  </label>
                  <input
                    type="text"
                    value={settings.footer?.acceptedPaymentMethods || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        footer: { ...settings.footer, acceptedPaymentMethods: e.target.value },
                      })
                    }
                    placeholder="ক্যাশ অন ডেলিভারি (COD), bKash, Nagad, Rocket, Visa"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 8: SHIPPING & COMMERCE ===================== */}
        {activeTab === "shipping" && (
          <div className="space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <Truck className="w-5 h-5 text-sky-600" />
                  <span>শিপিং চার্জ, ডেলিভারি রেট ও কমার্স নীতি</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  কার্ট এবং চেকআউটে স্বয়ংক্রিয়ভাবে হিসাবকৃত ডেলিভারি ফি এবং ফ্রি শিপিং সীমা
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-sky-50 border border-sky-200/80 rounded-2xl">
                  <label className="text-xs font-extrabold text-sky-900 block mb-1">
                    ঢাকার ভেতরে ডেলিভারি চার্জ (টাকা):
                  </label>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="text-base font-extrabold text-sky-800">৳</span>
                    <input
                      type="number"
                      min={0}
                      value={settings.shipping?.insideDhakaCharge ?? 60}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          shipping: {
                            ...settings.shipping,
                            insideDhakaCharge: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full px-3 py-1.5 bg-white border border-sky-300 rounded-xl text-base font-black text-slate-900"
                    />
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
                  <label className="text-xs font-extrabold text-slate-800 block mb-1">
                    ঢাকার বাইরে ডেলিভারি চার্জ (টাকা):
                  </label>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="text-base font-extrabold text-slate-600">৳</span>
                    <input
                      type="number"
                      min={0}
                      value={settings.shipping?.outsideDhakaCharge ?? 120}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          shipping: {
                            ...settings.shipping,
                            outsideDhakaCharge: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-base font-black text-slate-900"
                    />
                  </div>
                </div>

                <div className="p-4 bg-emerald-50 border border-emerald-200/80 rounded-2xl">
                  <label className="text-xs font-extrabold text-emerald-900 block mb-1">
                    ফ্রি শিপিং থ্রেশহোল্ড (টাকা):
                  </label>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="text-base font-extrabold text-emerald-700">৳</span>
                    <input
                      type="number"
                      min={0}
                      value={settings.shipping?.freeShippingThreshold ?? 1500}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          shipping: {
                            ...settings.shipping,
                            freeShippingThreshold: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full px-3 py-1.5 bg-white border border-emerald-300 rounded-xl text-base font-black text-emerald-900"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    আনুমানিক ডেলিভারি সময় (ঢাকার ভেতরে):
                  </label>
                  <input
                    type="text"
                    value={settings.shipping?.estimatedDeliveryDhaka || "২৪-৪৮ ঘণ্টা"}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        shipping: {
                          ...settings.shipping,
                          estimatedDeliveryDhaka: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    আনুমানিক ডেলিভারি সময় (ঢাকার বাইরে):
                  </label>
                  <input
                    type="text"
                    value={settings.shipping?.estimatedDeliveryOutside || "৩-৫ দিন"}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        shipping: {
                          ...settings.shipping,
                          estimatedDeliveryOutside: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  />
                </div>
              </div>

              {/* General Commerce Settings */}
              <div className="border-t border-slate-100 pt-5 space-y-4">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider text-slate-400">
                  অর্ডার ও কারেন্সি সেটিংস
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      মুদ্রা প্রতীক (Currency Symbol):
                    </label>
                    <input
                      type="text"
                      value={settings.commerce.currencySymbol}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          commerce: { ...settings.commerce, currencySymbol: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      সর্বনিম্ন অর্ডার মূল্য (টাকা):
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={settings.commerce.minimumOrderAmount}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          commerce: {
                            ...settings.commerce,
                            minimumOrderAmount: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      অর্ডার প্রিফিক্স কোড:
                    </label>
                    <input
                      type="text"
                      value={settings.commerce.orderPrefix}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          commerce: { ...settings.commerce, orderPrefix: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.commerce.codEnabled}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          commerce: { ...settings.commerce, codEnabled: e.target.checked },
                        })
                      }
                      className="w-4 h-4 text-sky-600 rounded"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">
                        ক্যাশ অন ডেলিভারি (Cash on Delivery) সক্রিয়
                      </span>
                      <span className="text-[11px] text-slate-500">
                        গ্রাহকরা চেকআউটে পণ্য হাতে পেয়ে টাকা পরিশোধ অপশন পাবেন
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 9: THEME & COLORS ===================== */}
        {activeTab === "theme" && (
          <div className="space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <Palette className="w-5 h-5 text-sky-600" />
                  <span>থিম, ব্র্যান্ড কালার ও ভিজ্যুয়াল স্টাইল</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  সাইটের প্রধান বোতাম, হেডারের অ্যাকসেন্ট কালার এবং স্টাইলিং টোকেন নির্ধারণ করুন
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                  <label className="text-xs font-bold text-slate-800 block">
                    প্রাইমারি ব্র্যান্ড কালার:
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={settings.theme.primaryColor}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          theme: { ...settings.theme, primaryColor: e.target.value },
                        })
                      }
                      className="w-12 h-12 rounded-xl cursor-pointer border border-slate-300"
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
                      className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                  <label className="text-xs font-bold text-slate-800 block">
                    প্রাইমারি হোভার কালার:
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={settings.theme.primaryHover}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          theme: { ...settings.theme, primaryHover: e.target.value },
                        })
                      }
                      className="w-12 h-12 rounded-xl cursor-pointer border border-slate-300"
                    />
                    <input
                      type="text"
                      value={settings.theme.primaryHover}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          theme: { ...settings.theme, primaryHover: e.target.value },
                        })
                      }
                      className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                  <label className="text-xs font-bold text-slate-800 block">
                    অ্যাকসেন্ট কালার (Highlight):
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={settings.theme.accentColor}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          theme: { ...settings.theme, accentColor: e.target.value },
                        })
                      }
                      className="w-12 h-12 rounded-xl cursor-pointer border border-slate-300"
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
                      className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 10: FEATURES ===================== */}
        {activeTab === "features" && (
          <div className="space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-sky-600" />
                  <span>স্টোর ফিচার ফ্ল্যাগস (Feature Toggles)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  প্রয়োজনীয় মডিউলগুলো ইচ্ছেমতো চালু বা বন্ধ রাখুন
                </p>
              </div>

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
                    className="flex items-center gap-3 p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors"
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
                      className="w-4 h-4 rounded text-sky-600"
                    />
                    <span className="text-xs font-bold text-slate-800">{f.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Global Save Button at bottom */}
        <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 shadow-xl flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>পরিবর্তনগুলো সংরক্ষিত হলে স্টোরফ্রন্টে সাথে সাথে আপডেট দৃশ্যমান হবে</span>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "সংরক্ষণ হচ্ছে..." : "সকল পরিবর্তন সংরক্ষণ করুন"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
