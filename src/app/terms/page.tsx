import { AnnouncementBar } from "@/components/storefront/AnnouncementBar";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { MobileBottomNav } from "@/components/storefront/MobileBottomNav";
import { FileText } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-8">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">
            ব্যবহারের শর্তাবলী (Terms & Conditions)
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm">
            ওয়েবসাইট ব্যবহার এবং কেনাকাটার নিয়মাবলী
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs space-y-6 text-sm text-slate-600 leading-relaxed">
          <p>
            আমাদের প্ল্যাটফর্মে অর্ডার প্রদানের মাধ্যমে আপনি আমাদের সেবা ও বিক্রয় শর্তাবলীতে সম্মতি প্রকাশ করছেন।
          </p>
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-2">১. পণ্যের তথ্য ও মূল্য</h3>
            <p>
              সব পণ্যের প্রদর্শিত মূল্য টাকায় (BDT) নির্ধারিত এবং ভ্যাট অন্তর্ভুক্ত। কোনো ভুল তথ্য বা অসঙ্গতি পরিলক্ষিত হলে কর্তৃপক্ষ অর্ডার সংশোধন বা বাতিলের অধিকার সংরক্ষণ করে।
            </p>
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-2">২. অর্ডার কনফার্মেশন ও ডেলিভারি</h3>
            <p>
              অর্ডার সাবমিট করার পর আমাদের প্রতিনিধি গ্রাহকের প্রদত্ত মোবাইল নম্বরে যোগাযোগ করে ডেলিভারি কনফার্ম করবেন।
            </p>
          </div>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
