import { AnnouncementBar } from "@/components/storefront/AnnouncementBar";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { MobileBottomNav } from "@/components/storefront/MobileBottomNav";
import { HelpCircle } from "lucide-react";

const FAQS = [
  {
    q: "আমি কীভাবে অর্ডার করতে পারি?",
    a: "আপনার পছন্দের পণ্যের পেজে গিয়ে 'কার্টে যোগ করুন' বা 'এখনই কিনুন' বাটনে ক্লিক করুন। এরপর চেকআউট পেজে নাম, ঠিকানা ও মোবাইল নম্বর দিয়ে পেমেন্ট পদ্ধতি নির্বাচন করে অর্ডার সম্পন্ন করুন।",
  },
  {
    q: "ক্যাশ অন ডেলিভারি (COD) সুবিধা আছে কি?",
    a: "হ্যাঁ, সমগ্র বাংলাদেশেই আমাদের ক্যাশ অন ডেলিভারি সুবিধা রয়েছে। পণ্য হাতে পেয়ে মূল্য পরিশোধ করতে পারবেন।",
  },
  {
    q: "পণ্য হাতে পেতে কত সময় লাগে?",
    a: "ঢাকার ভেতরে সাধারণত ১-২ কার্যদিবস এবং ঢাকার বাইরে ২-৪ কার্যদিবসের মধ্যে ডেলিভারি সম্পন্ন হয়।",
  },
  {
    q: "সাইজ বা পণ্যে সমস্যা হলে পরিবর্তন করা যাবে কি?",
    a: "হ্যাঁ, পণ্য হাতে পাওয়ার ৭ দিনের মধ্যে আমাদের কাস্টমার সার্ভিসে যোগাযোগ করে সহজেই পরিবর্তন বা রিটার্ন করতে পারবেন।",
  },
  {
    q: "ডেলিভারি চার্জ কত?",
    a: "ঢাকার ভেতরে ৬০ টাকা এবং ঢাকার বাইরে ১২০ টাকা। তবে ১,৫০০ টাকার অধিক অর্ডারে সম্পূর্ণ ফ্রি ডেলিভারি প্রদান করা হয়।",
  },
];

export default function FaqPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-8">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center mx-auto">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">
            সাধারণ জিজ্ঞাসা (FAQ)
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm">
            কেনাকাটা সংক্রান্ত সচরাচর জিজ্ঞাসিত প্রশ্ন ও উত্তর
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs divide-y divide-slate-100">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="py-5 first:pt-0 last:pb-0">
              <h3 className="font-bold text-base text-slate-900 mb-2">
                {faq.q}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
