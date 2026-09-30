import Link from "next/link";
import { Phone, Mail, MapPin, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-24 lg:pb-12 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 pb-12 border-b border-slate-800/80">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <span className="text-2xl font-bold text-white">স্মার্ট শপ</span>
                <span className="block text-[10px] tracking-widest text-sky-400 uppercase font-medium">
                  Bangladesh
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              বাংলাদেশের অন্যতম নির্ভরযোগ্য অনলাইন শপিং প্ল্যাটফর্ম। ফ্যাশন, ইলেকট্রনিক্স, গ্যাজেট ও লাইফস্টাইল পণ্য ১০০% নিশ্চয়তা ও দ্রুততম হোম ডেলিভারিতে।
            </p>

            <div className="space-y-2 pt-2 text-sm text-slate-300">
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                <span>হেল্পলাইন: ০১৭১১-০০০০০০ (সকাল ৯টা - রাত ১০টা)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <span>ইমেইল: support@smartshopbd.com</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
                <span>প্রধান কার্যালয়: ধানমন্ডি, ঢাকা, বাংলাদেশ</span>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-white font-bold text-sm tracking-wider uppercase mb-4">
              প্রয়োজনীয় লিংক
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  সকল পণ্য
                </Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-white transition-colors">
                  অর্ডার ট্র্যাক করুন
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-white transition-colors">
                  আমার অ্যাকাউন্ট
                </Link>
              </li>
              <li>
                <Link href="/account/wishlist" className="hover:text-white transition-colors">
                  পছন্দের তালিকা
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  যোগাযোগ
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="text-white font-bold text-sm tracking-wider uppercase mb-4">
              নীতিমালা ও শর্তাবলী
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/return-policy" className="hover:text-white transition-colors">
                  রিটার্ন ও রিফান্ড পলিসি
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-white transition-colors">
                  শিপিং ও ডেলিভারি নীতিমালা
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  গোপনীয়তা নীতিমালা
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  ব্যবহারের শর্তাবলী
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  সাধারণ জিজ্ঞাসা (FAQ)
                </Link>
              </li>
            </ul>
          </div>

          {/* Payment Methods */}
          <div>
            <h3 className="text-white font-bold text-sm tracking-wider uppercase mb-4">
              নিরাপদ পেমেন্ট
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              ক্যাশ অন ডেলিভারি এবং দেশের শীর্ষ মোবাইল ফিনান্সিয়াল সার্ভিসের মাধ্যমে সহজে মূল্য পরিশোধ করুন:
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-semibold text-slate-300">
                ক্যাশ অন ডেলিভারি (COD)
              </span>
              <span className="px-2.5 py-1.5 bg-pink-950 border border-pink-900 text-pink-400 rounded-lg text-xs font-bold">
                bKash
              </span>
              <span className="px-2.5 py-1.5 bg-orange-950 border border-orange-900 text-orange-400 rounded-lg text-xs font-bold">
                Nagad
              </span>
              <span className="px-2.5 py-1.5 bg-purple-950 border border-purple-900 text-purple-400 rounded-lg text-xs font-bold">
                Rocket
              </span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} স্মার্ট শপ বাংলাদেশ। সর্বস্বত্ব সংরক্ষিত।</p>
          <p className="flex items-center gap-1">
            <span>কারিগরী সহায়তায়:</span>
            <span className="text-sky-400 font-bold">Aulad IT Solution</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
