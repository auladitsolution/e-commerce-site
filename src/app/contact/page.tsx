"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Send, MessageSquare } from "lucide-react";
import { AnnouncementBar } from "@/components/storefront/AnnouncementBar";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { MobileBottomNav } from "@/components/storefront/MobileBottomNav";
import { toast } from "sonner";
import { useStoreSettings } from "@/hooks/useStoreSettings";

export default function ContactPage() {
  const { settings } = useStoreSettings();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const storeProfile = settings?.storeProfile;
  const nameBn = storeProfile?.nameBn || "স্মার্ট শপ বাংলাদেশ";
  const hotline = storeProfile?.phone || "০১৭১১-০০০০০০";
  const hours = storeProfile?.workingHours || "সকাল ৯টা - রাত ১০টা";
  const email = storeProfile?.email || "support@smartshopbd.com";
  const address = storeProfile?.address || "রোড নং ৪, ধানমন্ডি, ঢাকা - ১২০৫, বাংলাদেশ";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !message) {
      toast.error("সবগুলো ঘর পূরণ করুন");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success("আপনার বার্তা সফলভাবে গৃহীত হয়েছে! শীঘ্রই আমাদের প্রতিনিধি যোগাযোগ করবেন।");
      setName("");
      setPhone("");
      setMessage("");
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-10">
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            যোগাযোগ ও হেল্পডেস্ক (Contact Us)
          </h1>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            যেকোনো তথ্য, অর্ডার অনুসন্ধান বা অভিযোগের জন্য আমাদের সাথে সরাসরি যোগাযোগ করুন
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Contact Details */}
          <div className="lg:col-span-5 bg-sky-900 text-white p-8 rounded-3xl space-y-6 shadow-md">
            <div>
              <h3 className="text-xl font-bold mb-2">{nameBn}</h3>
              <p className="text-sky-200 text-xs leading-relaxed">
                আমাদের কাস্টমার কেয়ার টিম সপ্তাহের ৭ দিনই আপনার সেবায় নিয়োজিত।
              </p>
            </div>

            <div className="space-y-4 text-sm text-sky-100">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-white">হেল্পলাইন</span>
                  <span>{hotline} ({hours})</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-white">ইমেইল</span>
                  <span>{email}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-white">অফিস ঠিকানা</span>
                  <span>{address}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs">
            <h3 className="font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-sky-600" />
              <span>আমাদের বার্তা পাঠান</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  আপনার নাম:
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="যেমন: আরিয়ান মাহমুদ"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  মোবাইল নম্বর:
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

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  বার্তা / অভিযোগ / জিজ্ঞাসা:
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  placeholder="আপনার বার্তা বিস্তারিত লিখুন..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? "পাঠানো হচ্ছে..." : "বার্তা পাঠান"}</span>
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
