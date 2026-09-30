import { Truck, RotateCcw, ShieldCheck, Headphones } from "lucide-react";

export function TrustBadges() {
  const BADGES = [
    {
      icon: Truck,
      title: "দ্রুততম ডেলিভারি",
      subtitle: "ঢাকার ভেতর ২৪-৪৮ ঘণ্টা, সারা দেশে ৩-৪ দিন",
      color: "text-sky-600 bg-sky-50",
    },
    {
      icon: ShieldCheck,
      title: "নিরাপদ পেমেন্ট ও ক্যাশ অন ডেলিভারি",
      subtitle: "পণ্য হাতে পেয়ে মূল্য পরিশোধের নিশ্চিত সুবিধা",
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      icon: RotateCcw,
      title: "৭ দিনের সহজ রিটার্ন",
      subtitle: "ত্রুটিপূর্ণ পণ্যের ঝামেলাহীন পরিবর্তন ও রিফান্ড",
      color: "text-amber-600 bg-amber-50",
    },
    {
      icon: Headphones,
      title: "২৪/৭ কাস্টমার সাপোর্ট",
      subtitle: "যেকোনো জিজ্ঞাসায় আমাদের টিম সর্বদা প্রস্তুত",
      color: "text-indigo-600 bg-indigo-50",
    },
  ];

  return (
    <section className="py-12 bg-white border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {BADGES.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div
                key={idx}
                className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100/80 hover:border-slate-200 transition-colors"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${b.color}`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {b.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {b.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
