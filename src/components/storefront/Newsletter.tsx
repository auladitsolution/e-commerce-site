"use client";

import { useState } from "react";
import { Mail, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("সঠিক ইমেইল অ্যাড্রেস লিখুন");
      return;
    }
    setSubscribed(true);
    toast.success("আমাদের নিউজলেটারে সাবস্ক্রাইব করার জন্য ধন্যবাদ!");
    setEmail("");
  };

  return (
    <section className="py-12 bg-sky-900 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mx-auto text-amber-300">
            <Mail className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold">
            নতুন অফার ও বিশেষ ছাড়ের আপডেট পান
          </h2>
          <p className="text-sky-200 text-sm">
            আমাদের সাপ্তাহিক নিউজলেটারে যুক্ত হয়ে এক্সক্লুসিভ ডিসকাউন্ট কুপন ও নতুন কালেকশনের আগাম তথ্য পান সবার আগে।
          </p>

          {subscribed ? (
            <div className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500/20 text-emerald-300 text-sm font-bold border border-emerald-500/30">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>ধন্যবাদ! আপনি সফলভাবে যুক্ত হয়েছেন।</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="আপনার ইমেইল অ্যাড্রেস লিখুন..."
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-sm text-white placeholder-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-white/15"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-sm shadow-md transition-colors whitespace-nowrap"
              >
                যুক্ত হোন
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
