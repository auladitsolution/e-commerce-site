import mongoose, { Schema, Document, Model } from "mongoose";
import { StoreSettingsConfig } from "@/types/ecommerce";

export interface IStoreSettingsDoc extends Document, Omit<StoreSettingsConfig, "_id"> {
  key: string;
}

const DEFAULT_STORE_SETTINGS: StoreSettingsConfig = {
  storeProfile: {
    nameBn: "স্মার্ট শপ বাংলাদেশ",
    nameEn: "Smart Shop Bangladesh",
    tagline: "বিশ্বস্ত অনলাইন শপিং প্ল্যাটফর্ম",
    logo: "",
    favicon: "",
    phone: "০১৭১১-০০০০০০",
    email: "support@smartshopbd.com",
    address: "রোড নং ৪, ধানমন্ডি, ঢাকা - ১২০৫, বাংলাদেশ",
    workingHours: "সকাল ৯টা - রাত ১০টা",
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    whatsapp: "01700000000",
    youtube: "https://youtube.com",
  },
  announcement: {
    enabled: true,
    text: "৳১,৫০০+ অর্ডারে সমগ্র বাংলাদেশে ফ্রি হোম ডেলিভারি!",
    highlightText: "১০০% অথেনটিক ও ক্যাশ অন ডেলিভারি",
    phoneText: "হেল্পলাইন: ০১৭১১-০০০০০০",
    trackText: "অর্ডার ট্র্যাক করুন",
  },
  hero: {
    badgeText: "ধামাকা সিজনাল অফার — সর্বোচ্চ ৫০% পর্যন্ত ছাড়!",
    titleLine1: "স্মার্ট কেনাকাটায়",
    titleHighlight: "স্মার্ট শপ",
    titleLine2: "আপনার পাশে",
    description: "সেরা মানের ফ্যাশন, ইলেকট্রনিক্স, বাচ্চাদের পোশাক ও ঘরোয়া প্রয়োজনীয় পণ্য এখন এক ঠিকানায়। দ্রুততম ক্যাশ অন ডেলিভারি এবং নিশ্চিত নির্ভরযোগ্যতা।",
    cta1Text: "কেনাকাটা শুরু করুন",
    cta1Link: "/products",
    cta2Text: "হট ডিলস দেখুন",
    cta2Link: "/products?featured=true",
    showcaseImage: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop&q=80",
    showcaseBadge: "নতুন ট্রেন্ড কালেকশন",
    showcaseTitle: "ঈদ ও সামার এক্সক্লুসিভ",
    showcasePriceTag: "শুরু ৳৪৯৯ থেকে",
    trustItem1: "সারা দেশে হোম ডেলিভারি",
    trustItem2: "১০০% আসল প্রোডাক্ট",
    trustItem3: "সহজ রিটার্ন পলিসি",
  },
  promotionalBanner: {
    enabled: true,
    badge: "এক্সক্লুসিভ ডিল",
    title: "বিকাশ অথবা নগদে প্রি-পেমেন্টে বিশেষ ক্যাশব্যাক অফার!",
    description: "যেকোনো অর্ডারে ফ্রি ডেলিভারি পেতে কুপন কোড ব্যবহার করুন:",
    couponCode: "FREESHIP",
    buttonText: "অফার পণ্য দেখুন",
    buttonLink: "/products",
  },
  trustBadges: {
    enabled: true,
    items: [
      {
        icon: "Truck",
        title: "দ্রুততম ডেলিভারি",
        subtitle: "ঢাকার ভেতর ২৪-৪৮ ঘণ্টা, সারা দেশে ৩-৪ দিন",
      },
      {
        icon: "ShieldCheck",
        title: "নিরাপদ পেমেন্ট ও ক্যাশ অন ডেলিভারি",
        subtitle: "পণ্য হাতে পেয়ে মূল্য পরিশোধের নিশ্চিত সুবিধা",
      },
      {
        icon: "RotateCcw",
        title: "৭ দিনের সহজ রিটার্ন",
        subtitle: "ত্রুটিপূর্ণ পণ্যের ঝামেলাহীন পরিবর্তন ও রিফান্ড",
      },
      {
        icon: "Headphones",
        title: "২৪/৭ কাস্টমার সাপোর্ট",
        subtitle: "যেকোনো জিজ্ঞাসায় আমাদের টিম সর্বদা প্রস্তুত",
      },
    ],
  },
  newsletter: {
    enabled: true,
    title: "নতুন অফার ও বিশেষ ছাড়ের আপডেট পান",
    subtitle: "আমাদের সাপ্তাহিক নিউজলেটারে যুক্ত হয়ে এক্সক্লুসিভ ডিসকাউন্ট কুপন ও নতুন কালেকশনের আগাম তথ্য পান সবার আগে।",
    buttonText: "যুক্ত হোন",
  },
  footer: {
    aboutText: "বাংলাদেশের অন্যতম নির্ভরযোগ্য অনলাইন শপিং প্ল্যাটফর্ম। ফ্যাশন, ইলেকট্রনিক্স, গ্যাজেট ও লাইফস্টাইল পণ্য ১০০% নিশ্চয়তা ও দ্রুততম হোম ডেলিভারিতে।",
    workingHours: "সকাল ৯টা - রাত ১০টা",
    copyrightText: "স্মার্ট শপ বাংলাদেশ। সর্বস্বত্ব সংরক্ষিত।",
    devCreditText: "কারিগরী সহায়তায়: Aulad IT Solution",
    acceptedPaymentMethods: "ক্যাশ অন ডেলিভারি (COD), bKash, Nagad, Rocket",
  },
  shipping: {
    insideDhakaCharge: 60,
    outsideDhakaCharge: 120,
    freeShippingThreshold: 1500,
    estimatedDeliveryDhaka: "২৪-৪৮ ঘণ্টা",
    estimatedDeliveryOutside: "৩-৫ দিন",
  },
  commerce: {
    currency: "BDT",
    currencySymbol: "৳",
    codEnabled: true,
    guestCheckout: true,
    minimumOrderAmount: 0,
    defaultShippingZone: "inside_dhaka",
    orderPrefix: "ORD",
  },
  theme: {
    primaryColor: "#0284c7",
    primaryHover: "#0369a1",
    accentColor: "#f97316",
    borderRadius: "0.75rem",
    logoUrl: "",
    faviconUrl: "",
    announcementText: "৳১,৫০০+ অর্ডারে সমগ্র বাংলাদেশে ফ্রি হোম ডেলিভারি!",
    showAnnouncement: true,
  },
  features: {
    guestCheckout: true,
    wishlist: true,
    reviews: true,
    flashSale: true,
    coupons: true,
    brands: true,
    productBundles: false,
    recommendations: true,
    abandonedCart: false,
    expenseManagement: false,
    customerSegments: false,
    bulkProductManagement: true,
    courierIntegration: false,
    onlinePayment: false,
    bilingualStorefront: true,
    customerAccounts: true,
  },
};

const StoreSettingsSchema = new Schema<IStoreSettingsDoc>(
  {
    key: { type: String, default: "global_store_settings", unique: true },
    storeProfile: {
      nameBn: { type: String, default: DEFAULT_STORE_SETTINGS.storeProfile.nameBn },
      nameEn: { type: String, default: DEFAULT_STORE_SETTINGS.storeProfile.nameEn },
      tagline: { type: String, default: DEFAULT_STORE_SETTINGS.storeProfile.tagline },
      logo: { type: String, default: "" },
      favicon: { type: String, default: "" },
      phone: { type: String, default: DEFAULT_STORE_SETTINGS.storeProfile.phone },
      email: { type: String, default: DEFAULT_STORE_SETTINGS.storeProfile.email },
      address: { type: String, default: DEFAULT_STORE_SETTINGS.storeProfile.address },
      workingHours: { type: String, default: DEFAULT_STORE_SETTINGS.storeProfile.workingHours },
      facebook: { type: String, default: DEFAULT_STORE_SETTINGS.storeProfile.facebook },
      instagram: { type: String, default: DEFAULT_STORE_SETTINGS.storeProfile.instagram },
      whatsapp: { type: String, default: DEFAULT_STORE_SETTINGS.storeProfile.whatsapp },
      youtube: { type: String, default: DEFAULT_STORE_SETTINGS.storeProfile.youtube },
    },
    announcement: {
      enabled: { type: Boolean, default: true },
      text: { type: String, default: DEFAULT_STORE_SETTINGS.announcement.text },
      highlightText: { type: String, default: DEFAULT_STORE_SETTINGS.announcement.highlightText },
      phoneText: { type: String, default: DEFAULT_STORE_SETTINGS.announcement.phoneText },
      trackText: { type: String, default: DEFAULT_STORE_SETTINGS.announcement.trackText },
    },
    hero: {
      badgeText: { type: String, default: DEFAULT_STORE_SETTINGS.hero.badgeText },
      titleLine1: { type: String, default: DEFAULT_STORE_SETTINGS.hero.titleLine1 },
      titleHighlight: { type: String, default: DEFAULT_STORE_SETTINGS.hero.titleHighlight },
      titleLine2: { type: String, default: DEFAULT_STORE_SETTINGS.hero.titleLine2 },
      description: { type: String, default: DEFAULT_STORE_SETTINGS.hero.description },
      cta1Text: { type: String, default: DEFAULT_STORE_SETTINGS.hero.cta1Text },
      cta1Link: { type: String, default: DEFAULT_STORE_SETTINGS.hero.cta1Link },
      cta2Text: { type: String, default: DEFAULT_STORE_SETTINGS.hero.cta2Text },
      cta2Link: { type: String, default: DEFAULT_STORE_SETTINGS.hero.cta2Link },
      showcaseImage: { type: String, default: DEFAULT_STORE_SETTINGS.hero.showcaseImage },
      showcaseBadge: { type: String, default: DEFAULT_STORE_SETTINGS.hero.showcaseBadge },
      showcaseTitle: { type: String, default: DEFAULT_STORE_SETTINGS.hero.showcaseTitle },
      showcasePriceTag: { type: String, default: DEFAULT_STORE_SETTINGS.hero.showcasePriceTag },
      trustItem1: { type: String, default: DEFAULT_STORE_SETTINGS.hero.trustItem1 },
      trustItem2: { type: String, default: DEFAULT_STORE_SETTINGS.hero.trustItem2 },
      trustItem3: { type: String, default: DEFAULT_STORE_SETTINGS.hero.trustItem3 },
    },
    promotionalBanner: {
      enabled: { type: Boolean, default: true },
      badge: { type: String, default: DEFAULT_STORE_SETTINGS.promotionalBanner.badge },
      title: { type: String, default: DEFAULT_STORE_SETTINGS.promotionalBanner.title },
      description: { type: String, default: DEFAULT_STORE_SETTINGS.promotionalBanner.description },
      couponCode: { type: String, default: DEFAULT_STORE_SETTINGS.promotionalBanner.couponCode },
      buttonText: { type: String, default: DEFAULT_STORE_SETTINGS.promotionalBanner.buttonText },
      buttonLink: { type: String, default: DEFAULT_STORE_SETTINGS.promotionalBanner.buttonLink },
    },
    trustBadges: {
      enabled: { type: Boolean, default: true },
      items: [
        {
          icon: { type: String },
          title: { type: String },
          subtitle: { type: String },
        },
      ],
    },
    newsletter: {
      enabled: { type: Boolean, default: true },
      title: { type: String, default: DEFAULT_STORE_SETTINGS.newsletter.title },
      subtitle: { type: String, default: DEFAULT_STORE_SETTINGS.newsletter.subtitle },
      buttonText: { type: String, default: DEFAULT_STORE_SETTINGS.newsletter.buttonText },
    },
    footer: {
      aboutText: { type: String, default: DEFAULT_STORE_SETTINGS.footer.aboutText },
      workingHours: { type: String, default: DEFAULT_STORE_SETTINGS.footer.workingHours },
      copyrightText: { type: String, default: DEFAULT_STORE_SETTINGS.footer.copyrightText },
      devCreditText: { type: String, default: DEFAULT_STORE_SETTINGS.footer.devCreditText },
      acceptedPaymentMethods: { type: String, default: DEFAULT_STORE_SETTINGS.footer.acceptedPaymentMethods },
    },
    shipping: {
      insideDhakaCharge: { type: Number, default: DEFAULT_STORE_SETTINGS.shipping.insideDhakaCharge },
      outsideDhakaCharge: { type: Number, default: DEFAULT_STORE_SETTINGS.shipping.outsideDhakaCharge },
      freeShippingThreshold: { type: Number, default: DEFAULT_STORE_SETTINGS.shipping.freeShippingThreshold },
      estimatedDeliveryDhaka: { type: String, default: DEFAULT_STORE_SETTINGS.shipping.estimatedDeliveryDhaka },
      estimatedDeliveryOutside: { type: String, default: DEFAULT_STORE_SETTINGS.shipping.estimatedDeliveryOutside },
    },
    commerce: {
      currency: { type: String, default: "BDT" },
      currencySymbol: { type: String, default: "৳" },
      codEnabled: { type: Boolean, default: true },
      guestCheckout: { type: Boolean, default: true },
      minimumOrderAmount: { type: Number, default: 0 },
      defaultShippingZone: { type: String, default: "inside_dhaka" },
      orderPrefix: { type: String, default: "ORD" },
    },
    theme: {
      primaryColor: { type: String, default: "#0284c7" },
      primaryHover: { type: String, default: "#0369a1" },
      accentColor: { type: String, default: "#f97316" },
      borderRadius: { type: String, default: "0.75rem" },
      logoUrl: { type: String, default: "" },
      faviconUrl: { type: String, default: "" },
      announcementText: { type: String, default: "৳১,৫০০+ অর্ডারে সমগ্র বাংলাদেশে ফ্রি হোম ডেলিভারি!" },
      showAnnouncement: { type: Boolean, default: true },
    },
    features: {
      guestCheckout: { type: Boolean, default: true },
      wishlist: { type: Boolean, default: true },
      reviews: { type: Boolean, default: true },
      flashSale: { type: Boolean, default: true },
      coupons: { type: Boolean, default: true },
      brands: { type: Boolean, default: true },
      productBundles: { type: Boolean, default: false },
      recommendations: { type: Boolean, default: true },
      abandonedCart: { type: Boolean, default: false },
      expenseManagement: { type: Boolean, default: false },
      customerSegments: { type: Boolean, default: false },
      bulkProductManagement: { type: Boolean, default: true },
      courierIntegration: { type: Boolean, default: false },
      onlinePayment: { type: Boolean, default: false },
      bilingualStorefront: { type: Boolean, default: true },
      customerAccounts: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

export const StoreSettings: Model<IStoreSettingsDoc> =
  mongoose.models.StoreSettings ||
  mongoose.model<IStoreSettingsDoc>("StoreSettings", StoreSettingsSchema);

export async function getStoreSettings(): Promise<StoreSettingsConfig> {
  try {
    const raw = await StoreSettings.findOne({ key: "global_store_settings" }).lean();
    if (!raw) {
      return DEFAULT_STORE_SETTINGS;
    }

    const settings = raw as unknown as StoreSettingsConfig;

    // Deep merge with defaults to ensure all nested properties exist even on existing records
    return {
      _id: raw._id?.toString(),
      storeProfile: { ...DEFAULT_STORE_SETTINGS.storeProfile, ...settings.storeProfile },
      announcement: { ...DEFAULT_STORE_SETTINGS.announcement, ...settings.announcement },
      hero: { ...DEFAULT_STORE_SETTINGS.hero, ...settings.hero },
      promotionalBanner: { ...DEFAULT_STORE_SETTINGS.promotionalBanner, ...settings.promotionalBanner },
      trustBadges: {
        enabled: settings.trustBadges?.enabled ?? DEFAULT_STORE_SETTINGS.trustBadges.enabled,
        items:
          settings.trustBadges?.items && settings.trustBadges.items.length > 0
            ? settings.trustBadges.items
            : DEFAULT_STORE_SETTINGS.trustBadges.items,
      },
      newsletter: { ...DEFAULT_STORE_SETTINGS.newsletter, ...settings.newsletter },
      footer: { ...DEFAULT_STORE_SETTINGS.footer, ...settings.footer },
      shipping: { ...DEFAULT_STORE_SETTINGS.shipping, ...settings.shipping },
      commerce: { ...DEFAULT_STORE_SETTINGS.commerce, ...settings.commerce },
      theme: { ...DEFAULT_STORE_SETTINGS.theme, ...settings.theme },
      features: { ...DEFAULT_STORE_SETTINGS.features, ...settings.features },
    };
  } catch (err) {
    console.error("getStoreSettings error:", err);
    return DEFAULT_STORE_SETTINGS;
  }
}
