import { AnnouncementBar } from "@/components/storefront/AnnouncementBar";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { MobileBottomNav } from "@/components/storefront/MobileBottomNav";
import { RotateCcw } from "lucide-react";

export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-8">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto">
            <RotateCcw className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">
            রিটার্ন ও রিফান্ড নীতিমালা (Return & Refund Policy)
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm">
            গ্রাহকের সর্বোচ্চ সন্তুষ্টি ও অধিকার সুরক্ষায় আমাদের স্পষ্ট নীতিমালা
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs space-y-6 text-sm text-slate-600 leading-relaxed">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-2">১. রিটার্নের সময়সীমা</h3>
            <p>
              পণ্য ডেলিভারি পাওয়ার দিন থেকে পরবর্তী ৭ (সাত) দিনের মধ্যে রিটার্ন বা পরিবর্তনের আবেদন করা যাবে।
            </p>
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900 mb-2">২. রিটার্ন যোগ্যতার শর্তাবলী</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>পণ্যটি অব্যবহৃত, অক্ষত এবং মূল প্যাকেজিং সহ থাকতে হবে।</li>
              <li>পণ্যের সাথে থাকা ট্যাগ, বারকোড এবং আনুষাঙ্গিক সব কিছু সংযুক্ত থাকতে হবে।</li>
              <li>ডেলিভারির সময় ভাঙা বা ত্রুটিপূর্ণ পাওয়া গেলে ডেলিভারিম্যানের সামনেই আনবক্সিং ভিডিও করার পরামর্শ দেওয়া হচ্ছে।</li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900 mb-2">৩. রিফান্ড পদ্ধতি</h3>
            <p>
              রিটার্নকৃত পণ্য আমাদের ওয়্যারহাউজে পৌঁছানোর পর যাচাই-বাছাই শেষে ৩-৫ কার্যদিবসের মধ্যে গ্রাহকের বিকাশ, নগদ অথবা ব্যাংক অ্যাকাউন্টে মূল্য ফেরত প্রদান করা হবে।
            </p>
          </div>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
