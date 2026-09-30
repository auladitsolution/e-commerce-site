import { AnnouncementBar } from "@/components/storefront/AnnouncementBar";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { MobileBottomNav } from "@/components/storefront/MobileBottomNav";
import { Truck } from "lucide-react";

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-8">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center mx-auto">
            <Truck className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">
            শিপিং ও ডেলিভারি নীতিমালা (Shipping Policy)
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm">
            বাংলাদেশের ৬৪ জেলায় দ্রুত ও নিরাপদ ডেলিভারি সংক্রান্ত সকল তথ্য
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs space-y-6 text-sm text-slate-600 leading-relaxed">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-2">১. ডেলিভারি এলাকা ও চার্জ</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>ঢাকার ভেতরে:</strong> ডেলিভারি চার্জ ৬০ টাকা (১-২ কার্যদিবসের মধ্যে ডেলিভারি)।</li>
              <li><strong>ঢাকার বাইরে সমগ্র বাংলাদেশে:</strong> ডেলিভারি চার্জ ১২০ টাকা (২-৪ কার্যদিবসের মধ্যে ডেলিভারি)।</li>
              <li><strong>ফ্রি ডেলিভারি অফার:</strong> ১,৫০০ টাকার অধিক অর্ডারে সমগ্র বাংলাদেশে কোনো ডেলিভারি চার্জ নেই।</li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900 mb-2">২. কুরিয়ার ট্র্যাকিং</h3>
            <p>
              অর্ডারটি কুরিয়ারে হস্তান্তর করার সাথে সাথে গ্রাহককে এসএমএস বা ইন-অ্যাপ ট্র্যাকিং লিঙ্ক প্রদান করা হয়। এছাড়া আমাদের ওয়েবসাইটের &apos;অর্ডার ট্র্যাক করুন&apos; পেজ থেকে যেকোনো সময় রিয়েল-টাইম স্থিতি জানা যাবে।
            </p>
          </div>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
