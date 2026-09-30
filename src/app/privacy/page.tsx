import { AnnouncementBar } from "@/components/storefront/AnnouncementBar";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { MobileBottomNav } from "@/components/storefront/MobileBottomNav";
import { ShieldCheck } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-8">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">
            গোপনীয়তা নীতিমালা (Privacy Policy)
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm">
            আপনার ব্যক্তিগত তথ্যের নিরাপত্তা এবং সুরক্ষা আমাদের অগ্রাধিকার
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs space-y-6 text-sm text-slate-600 leading-relaxed">
          <p>
            স্মার্ট শপ বাংলাদেশ গ্রাহকদের ব্যক্তিগত তথ্যের সর্বোচ্চ সুরক্ষা নিশ্চিতে প্রতিশ্রুতিবদ্ধ। আমরা কেবল অর্ডার ডেলিভারি, কাস্টমার সার্ভিস ও নিরাপত্তা নিশ্চিতকরণের জন্য প্রয়োজনীয় তথ্য (নাম, ঠিকানা ও মোবাইল নম্বর) সংগ্রহ করে থাকি।
          </p>
          <p>
            আমরা কখনই আপনার ব্যক্তিগত বা যোগাযোগের তথ্য কোনো তৃতীয় পক্ষের কাছে বিক্রয় বা বাণিজ্যিক উদ্দেশ্যে ভাগ করি না।
          </p>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
