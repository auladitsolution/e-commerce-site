import { connectDB } from "./mongoose";
import { Category } from "@/models/Category";
import { Brand } from "@/models/Brand";
import { Product } from "@/models/Product";
import { ShippingZone } from "@/models/ShippingZone";
import { Coupon } from "@/models/Coupon";
import { User } from "@/models/User";
import { StoreSettings } from "@/models/StoreSettings";

export async function seedInitialData() {
  await connectDB();

  // 1. Seed Store Settings
  const settingsCount = await StoreSettings.countDocuments();
  if (settingsCount === 0) {
    await StoreSettings.create({
      key: "global_store_settings",
      storeProfile: {
        nameBn: "স্মার্ট শপ বাংলাদেশ",
        nameEn: "Smart Shop Bangladesh",
        phone: "01711000000",
        email: "support@smartshopbd.com",
        address: "রোড ৪, ধানমন্ডি, ঢাকা, বাংলাদেশ",
        facebook: "https://facebook.com/smartshopbd",
        whatsapp: "01711000000",
      },
      commerce: {
        currency: "BDT",
        currencySymbol: "৳",
        codEnabled: true,
        guestCheckout: true,
        minimumOrderAmount: 0,
        orderPrefix: "ORD",
      },
      theme: {
        primaryColor: "#0284c7",
        primaryHover: "#0369a1",
        accentColor: "#f97316",
        borderRadius: "0.75rem",
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
    });
  }

  // 2. Seed Admin User
  const adminCount = await User.countDocuments();
  if (adminCount === 0) {
    await User.create({
      firebaseUid: "admin_master_uid_123",
      email: "admin@auladit.com",
      name: "Aulad Admin",
      role: "OWNER",
      active: true,
    });
  }

  // 3. Seed Shipping Zones
  const zoneCount = await ShippingZone.countDocuments();
  if (zoneCount === 0) {
    await ShippingZone.create([
      {
        name: "ঢাকার ভেতরে (Inside Dhaka)",
        districts: ["ঢাকা (Dhaka)", "ঢাকা", "dhaka", "গাজীপুর (Gazipur)", "নারায়ণগঞ্জ (Narayanganj)"],
        baseCharge: 60,
        freeShippingThreshold: 1500,
        estimatedDeliveryText: "১-২ কার্যদিবস",
        active: true,
      },
      {
        name: "ঢাকার বাইরে (Outside Dhaka)",
        districts: ["চট্টগ্রাম", "সিলেট", "রাজশাহী", "খুলনা", "বরিশাল", "রংপুর", "ময়মনসিংহ", "কুমিল্লা"],
        baseCharge: 120,
        freeShippingThreshold: 2000,
        estimatedDeliveryText: "২-৪ কার্যদিবস",
        active: true,
      },
    ]);
  }

  // 4. Seed Categories
  const categoryCount = await Category.countDocuments();
  if (categoryCount === 0) {
    await Category.create([
      {
        nameBn: "ফ্যাশন ও পোশাক",
        nameEn: "Fashion & Clothing",
        slug: "fashion",
        sortOrder: 1,
        featured: true,
        active: true,
      },
      {
        nameBn: "ইলেকট্রনিক্স ও গ্যাজেট",
        nameEn: "Electronics & Gadgets",
        slug: "electronics",
        sortOrder: 2,
        featured: true,
        active: true,
      },
      {
        nameBn: "কিডস ও বেবি",
        nameEn: "Kids & Baby",
        slug: "kids",
        sortOrder: 3,
        featured: true,
        active: true,
      },
      {
        nameBn: "কসমেটিক্স ও স্কিনকেয়ার",
        nameEn: "Cosmetics & Skincare",
        slug: "cosmetics",
        sortOrder: 4,
        featured: true,
        active: true,
      },
      {
        nameBn: "হোম ও লিভিং",
        nameEn: "Home & Living",
        slug: "home-living",
        sortOrder: 5,
        featured: true,
        active: true,
      },
    ]);
  }

  // 5. Seed Brands
  const brandCount = await Brand.countDocuments();
  if (brandCount === 0) {
    await Brand.create([
      { name: "Aarong Style", slug: "aarong-style", featured: true, active: true },
      { name: "Anjan's", slug: "anjans", featured: true, active: true },
      { name: "Mi Bangladesh", slug: "mi-bangladesh", featured: true, active: true },
      { name: "Apex Footwear", slug: "apex-footwear", featured: true, active: true },
    ]);
  }

  // 6. Seed Coupons
  const couponCount = await Coupon.countDocuments();
  if (couponCount === 0) {
    await Coupon.create([
      {
        code: "WELCOME10",
        type: "PERCENTAGE",
        amount: 10,
        minOrder: 1000,
        maxDiscount: 300,
        usageLimit: 1000,
        perCustomerLimit: 1,
        startDate: new Date(),
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        active: true,
      },
      {
        code: "FREESHIP",
        type: "FREE_SHIPPING",
        amount: 0,
        minOrder: 800,
        usageLimit: 500,
        perCustomerLimit: 2,
        startDate: new Date(),
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        active: true,
      },
      {
        code: "SMART200",
        type: "FIXED",
        amount: 200,
        minOrder: 2500,
        usageLimit: 200,
        perCustomerLimit: 1,
        startDate: new Date(),
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        active: true,
      },
    ]);
  }

  // 7. Seed Products with Variants & Pricing
  const productCount = await Product.countDocuments();
  if (productCount === 0) {
    await Product.create([
      {
        productCode: "FSH-001",
        sku: "FSH-SHIRT-01",
        nameBn: "প্রিমিয়াম সুতি ফর্মাল শার্ট (নেভি ব্লু)",
        nameEn: "Premium 100% Cotton Formal Shirt - Navy Blue",
        slug: "premium-cotton-formal-shirt-navy",
        shortDescription: "১০০% প্রিমিয়াম সুতি কাপড়ে তৈরি আরামদায়ক ও নিখুঁত ফিটিং শার্ট। অফিস ও ফর্মাল ব্যবহারের জন্য চমৎকার।",
        description: "এই এক্সক্লুসিভ ফর্মাল শার্টটি সর্বোচ্চ মানের চিরুনি করা ১০০% সুতি কাপড়ে তৈরি। সারাদিনের আরামদায়ক ব্যবহারের জন্য এটি উপযোগী। কালার গ্যারান্টিযুক্ত এবং সহজে কুঁচকে যায় না।",
        category: "fashion",
        subcategory: "men",
        brand: "Aarong Style",
        tags: ["শার্ট", "ফর্মাল শার্ট", "কটন শার্ট", "মেনস ফ্যাশন"],
        images: [
          {
            url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80",
            alt: "Navy Blue Formal Shirt",
            isPrimary: true,
          },
          {
            url: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80",
            alt: "Shirt Texture",
          },
        ],
        regularPrice: 1650,
        salePrice: 1290,
        costPrice: 850,
        stock: 35,
        minimumStock: 5,
        trackInventory: true,
        hasVariants: true,
        variants: [
          {
            id: "v_m",
            title: "সাইজ: M (৪০)",
            sku: "FSH-SHIRT-M",
            attributes: { Size: "M" },
            regularPrice: 1650,
            salePrice: 1290,
            costPrice: 850,
            stock: 15,
            active: true,
          },
          {
            id: "v_l",
            title: "সাইজ: L (৪২)",
            sku: "FSH-SHIRT-L",
            attributes: { Size: "L" },
            regularPrice: 1650,
            salePrice: 1290,
            costPrice: 850,
            stock: 12,
            active: true,
          },
          {
            id: "v_xl",
            title: "সাইজ: XL (৪৪)",
            sku: "FSH-SHIRT-XL",
            attributes: { Size: "XL" },
            regularPrice: 1650,
            salePrice: 1290,
            costPrice: 850,
            stock: 8,
            active: true,
          },
        ],
        attributes: [
          { name: "Size", values: ["M", "L", "XL"] },
          { name: "Fabric", values: ["100% Cotton"] },
        ],
        featured: true,
        newArrival: true,
        bestSeller: true,
        active: true,
        rating: 4.8,
        reviewCount: 24,
      },
      {
        productCode: "ELC-002",
        sku: "ELC-SWATCH-PRO",
        nameBn: "আল্ট্রা এইচডি স্মার্টওয়াচ — ব্লুটুথ কলিং ও হেলথ ট্র্যাকার",
        nameEn: "Ultra HD Smartwatch with Bluetooth Calling & Health Tracking",
        slug: "ultra-hd-smartwatch-bluetooth-calling",
        shortDescription: "২.০১ ইঞ্চি অ্যামোলেড ডিসপ্লে, দীর্ঘস্থায়ী ব্যাটারি ও ১০০+ স্পোর্টস মোড সম্বলিত আধুনিক স্মার্টওয়াচ।",
        description: "আপনার ফিটনেস ও দৈনন্দিন নোটিফিকেশন ট্র্যাক করার সেরা স্মার্টওয়াচ। সরাসরি ঘড়ি দিয়ে কল রিসিভ ও ডায়াল করা যায়। হার্ট রেট, ব্লাড অক্সিজেন এবং স্লিপ মনিটর সুবিধা রয়েছে। আইপি৬৮ ওয়াটার রেজিস্ট্যান্ট।",
        category: "electronics",
        subcategory: "wearables",
        brand: "Mi Bangladesh",
        tags: ["স্মার্টওয়াচ", "গ্যাজেট", "ঘড়ি", "ফিটনেস ট্র্যাকার"],
        images: [
          {
            url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
            alt: "Ultra HD Smartwatch",
            isPrimary: true,
          },
          {
            url: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80",
            alt: "Smartwatch Side View",
          },
        ],
        regularPrice: 3499,
        salePrice: 2490,
        costPrice: 1600,
        stock: 40,
        minimumStock: 5,
        trackInventory: true,
        hasVariants: false,
        variants: [],
        attributes: [
          { name: "Display", values: ["2.01 inch AMOLED"] },
          { name: "Battery", values: ["7 Days"] },
        ],
        featured: true,
        newArrival: true,
        bestSeller: true,
        active: true,
        rating: 4.9,
        reviewCount: 38,
      },
      {
        productCode: "FSH-003",
        sku: "FSH-PANJABI-01",
        nameBn: "এক্সক্লুসিভ জ্যাকার্ড সুতি সেমি-লং পাঞ্জাবি",
        nameEn: "Exclusive Jacquard Cotton Semi-Long Panjabi",
        slug: "exclusive-jacquard-cotton-semi-long-panjabi",
        shortDescription: "আকর্ষণীয় এমব্রয়ডারি কলার ও বাটনসহ আরামদায়ক সুতি পাঞ্জাবি। উৎসব ও যেকোনো অনুষ্ঠানে পরার উপযোগী।",
        description: "উচ্চমানের জ্যাকার্ড সুতি কাপড়ে তৈরি পাঞ্জাবি। সূক্ষ্ম কারুকাজ ও আধুনিক কাট। কালার ফাস্টনেস ১০০% নিশ্চিত।",
        category: "fashion",
        brand: "Anjan's",
        tags: ["পাঞ্জাবি", "ঈদ কালেকশন", "মেনস ফ্যাশন"],
        images: [
          {
            url: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80",
            alt: "Exclusive Panjabi",
            isPrimary: true,
          },
        ],
        regularPrice: 2450,
        salePrice: 1890,
        costPrice: 1100,
        stock: 22,
        minimumStock: 4,
        trackInventory: true,
        hasVariants: false,
        variants: [],
        attributes: [{ name: "Material", values: ["Jacquard Cotton"] }],
        featured: true,
        newArrival: true,
        bestSeller: false,
        active: true,
        rating: 4.7,
        reviewCount: 15,
      },
      {
        productCode: "CSM-004",
        sku: "CSM-SERUM-01",
        nameBn: "ন্যাচারাল ভিটামিন সি গ্লো ফেস সিরাম (৩০মিলি)",
        nameEn: "Natural Vitamin C Glow Face Serum (30ml)",
        slug: "natural-vitamin-c-glow-face-serum",
        shortDescription: "ত্বকের উজ্জ্বলতা বৃদ্ধি ও দাগ দূর করতে কার্যকর ভিটামিন সি ও হ্যালুরোনিক এসিড সমৃদ্ধ সিরাম।",
        description: "ডার্মাটোলজিস্ট টেস্টেড নিরাপদ ফর্মুলা। ত্বকের কালো দাগ, রোদে পোড়া ভাব এবং ফাইন লাইনস দূর করে প্রাকৃতিক লাবণ্য ফিরিয়ে আনে।",
        category: "cosmetics",
        tags: ["ফেস সিরাম", "স্কিনকেয়ার", "ভিটামিন সি", "সৌন্দর্য"],
        images: [
          {
            url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80",
            alt: "Vitamin C Serum",
            isPrimary: true,
          },
        ],
        regularPrice: 1150,
        salePrice: 850,
        costPrice: 500,
        stock: 50,
        minimumStock: 8,
        trackInventory: true,
        hasVariants: false,
        variants: [],
        attributes: [{ name: "Volume", values: ["30ml"] }],
        featured: true,
        newArrival: false,
        bestSeller: true,
        active: true,
        rating: 5.0,
        reviewCount: 19,
      },
      {
        productCode: "KID-005",
        sku: "KID-SET-01",
        nameBn: "বেবি সফট কটন ২-পিস পোশাক সেট",
        nameEn: "Baby Soft Organic Cotton 2-Piece Outfit Set",
        slug: "baby-soft-organic-cotton-2-piece-outfit-set",
        shortDescription: "শিশুর কোমল ত্বকের জন্য ১০০% অর্গানিক সুতি ও নিওপ্রিন ফ্রি নরম আরামদায়ক পোশাক সেট।",
        description: "০-১৮ মাসের বাচ্চাদের উপযোগী চমৎকার কালার ও প্রিন্ট। নরম কাপড় যা শিশুর ত্বকে কোনো ধরনের চুলকানি বা র‍্যাশ সৃষ্টি করে না।",
        category: "kids",
        tags: ["বাচ্চাদের পোশাক", "বেবি ক্লথ", "কিডস ফ্যাশন"],
        images: [
          {
            url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&auto=format&fit=crop&q=80",
            alt: "Baby Outfit Set",
            isPrimary: true,
          },
        ],
        regularPrice: 850,
        salePrice: 650,
        costPrice: 380,
        stock: 30,
        minimumStock: 5,
        trackInventory: true,
        hasVariants: false,
        variants: [],
        attributes: [{ name: "Age", values: ["0-6 Months", "6-12 Months", "12-18 Months"] }],
        featured: false,
        newArrival: true,
        bestSeller: true,
        active: true,
        rating: 4.8,
        reviewCount: 12,
      },
      {
        productCode: "HML-006",
        sku: "HML-BED-01",
        nameBn: "লাক্সারি কিং সাইজ কটন বেডশিট ও ২ বালিশের কভার সেট",
        nameEn: "Luxury King Size Pure Cotton Bedsheet Set with 2 Pillow Covers",
        slug: "luxury-king-size-cotton-bedsheet-set",
        shortDescription: "১০০% প্রিমিয়াম সুতি কিং সাইজ বেডকভার। রঙের শতভাগ নিশ্চয়তা ও নিখুঁত ফিনিশিং।",
        description: "৭.৫ x ৮.৫ ফিট কিং সাইজ খাটের জন্য একদম মানানসই। আকর্ষণীয় আধুনিক প্যাটার্ন ডিজাইন যা আপনার বেডরুমের সৌন্দর্য দ্বিগুণ করবে।",
        category: "home-living",
        tags: ["বেডশিট", "হোম ডেকর", "সুতি চাদর"],
        images: [
          {
            url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&auto=format&fit=crop&q=80",
            alt: "Luxury Bedsheet Set",
            isPrimary: true,
          },
        ],
        regularPrice: 1850,
        salePrice: 1450,
        costPrice: 900,
        stock: 18,
        minimumStock: 3,
        trackInventory: true,
        hasVariants: false,
        variants: [],
        attributes: [{ name: "Size", values: ["King Size (7.5 x 8.5 ft)"] }],
        featured: false,
        newArrival: false,
        bestSeller: true,
        active: true,
        rating: 4.6,
        reviewCount: 9,
      },
    ]);
  }

  console.log("Database seeded successfully!");
}
