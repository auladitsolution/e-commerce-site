import { AnnouncementBar } from "@/components/storefront/AnnouncementBar";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { MobileBottomNav } from "@/components/storefront/MobileBottomNav";
import { Sparkles, ShieldCheck, HeartHandshake, Award } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-8">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6 text-amber-500" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            আমাদের সম্পর্কে (About Us)
          </h1>
          <p className="text-slate-500 text-sm max-w-xl mx-auto">
            বিশ্বস্ততা, গুণগত মান এবং গ্রাহক সন্তুষ্টির অঙ্গীকার নিয়ে এগিয়ে চলা স্মার্ট শপ বাংলাদেশ।
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs space-y-6 text-sm text-slate-600 leading-relaxed">
          <p>
            <strong className="text-slate-900">স্মার্ট শপ বাংলাদেশ</strong> হলো একটি আধুনিক, মানসম্মত এবং গ্রাহক-কেন্দ্রিক ইকমার্স প্ল্যাটফর্ম। আমাদের মূল লক্ষ্য হলো সমগ্র বাংলাদেশের গ্রাহকদের কাছে অথেনটিক ও প্রিমিয়াম কোয়ালিটির ফ্যাশন, গ্যাজেট, ইলেকট্রনিক্স ও কিডস আইটেম পৌঁছে দেওয়া।
          </p>
          <p>
            আমরা বিশ্বাস করি অনলাইন কেনাকাটা হওয়া উচিত সম্পূর্ণ ঝুঁকিমুক্ত ও স্বচ্ছ। এজন্যই আমরা সারা দেশে ক্যাশ অন ডেলিভারি এবং ৭ দিনের ঝামেলাহীন রিটার্ন পলিসি প্রদান করছি।
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
            <div className="p-4 bg-slate-50 rounded-2xl text-center space-y-1">
              <ShieldCheck className="w-6 h-6 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-slate-900">১০০% অথেনটিক</h4>
              <p className="text-xs text-slate-500">প্রতিটি পণ্যের গুণগত মান পরীক্ষিত</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl text-center space-y-1">
              <HeartHandshake className="w-6 h-6 text-sky-600 mx-auto" />
              <h4 className="font-bold text-slate-900">গ্রাহক সন্তুষ্টি</h4>
              <p className="text-xs text-slate-500">২৪/৭ সার্বক্ষণিক সহায়তা</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl text-center space-y-1">
              <Award className="w-6 h-6 text-amber-600 mx-auto" />
              <h4 className="font-bold text-slate-900">দ্রুত ডেলিভারি</h4>
              <p className="text-xs text-slate-500">সর্বোচ্চ গতি ও নির্ভরযোগ্যতা</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
