import { z } from "zod";
import sanitizeHtml from "sanitize-html";

export const sanitizeString = (val: string) => {
  return sanitizeHtml(val, {
    allowedTags: [],
    allowedAttributes: {},
  }).trim();
};

export const sanitizeRichText = (val: string) => {
  return sanitizeHtml(val, {
    allowedTags: ["b", "i", "em", "strong", "a", "p", "ul", "ol", "li", "br", "h3", "h4"],
    allowedAttributes: {
      a: ["href", "target", "rel"],
    },
  }).trim();
};

export const addressSchema = z.object({
  label: z.string().default("বাসা"),
  recipientName: z.string().min(2, "প্রাপকের নাম নূন্যতম ২ অক্ষর হতে হবে"),
  phone: z.string().regex(/^(?:\+?88)?01[3-9]\d{8}$/, "সঠিক বাংলাদেশী মোবাইল নম্বর দিন (১১ ডিজিট)"),
  district: z.string().min(1, "জেলা নির্বাচন করুন"),
  area: z.string().min(1, "থানা বা এলাকা দিন"),
  fullAddress: z.string().min(5, "বিস্তারিত ঠিকানা দিন"),
  isDefault: z.boolean().optional(),
});

export const checkoutItemSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().optional(),
  quantity: z.number().int().positive("পরিমাণ ১ বা তার বেশি হতে হবে"),
});

export const checkoutSchema = z.object({
  isGuest: z.boolean().default(false),
  customerInfo: z.object({
    name: z.string().min(2, "নাম নূন্যতম ২ অক্ষর হতে হবে"),
    phone: z.string().regex(/^(?:\+?88)?01[3-9]\d{8}$/, "সঠিক বাংলাদেশী মোবাইল নম্বর দিন"),
    email: z.string().email("সঠিক ইমেইল দিন").optional().or(z.literal("")),
  }),
  shippingAddress: addressSchema,
  items: z.array(checkoutItemSchema).min(1, "কার্টে অন্তত একটি পণ্য থাকতে হবে"),
  paymentMethod: z.enum(["COD", "BKASH", "NAGAD", "ROCKET", "BANK_TRANSFER", "ONLINE_GATEWAY"]),
  manualPaymentDetails: z.object({
    senderNumber: z.string().optional(),
    transactionId: z.string().optional(),
  }).optional(),
  couponCode: z.string().optional(),
  customerNote: z.string().max(500).optional(),
});

export const productVariantSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  sku: z.string().min(1),
  barcode: z.string().optional(),
  attributes: z.record(z.string(), z.string()),
  regularPrice: z.number().min(0),
  salePrice: z.number().min(0).optional(),
  costPrice: z.number().min(0).optional(),
  stock: z.number().int().min(0),
  image: z.string().optional(),
  active: z.boolean().default(true),
});

export const productSchema = z.object({
  productCode: z.string().min(1),
  sku: z.string().min(1),
  barcode: z.string().optional(),
  nameBn: z.string().min(2, "বাংলা নাম আবশ্যক"),
  nameEn: z.string().min(2, "ইংরেজি নাম আবশ্যক"),
  slug: z.string().min(2),
  shortDescription: z.string().optional(),
  description: z.string().min(5, "পণ্যের বিবরণ আবশ্যক"),
  category: z.string().min(1, "ক্যাটাগরি আবশ্যক"),
  subcategory: z.string().optional(),
  brand: z.string().optional(),
  tags: z.array(z.string()).default([]),
  images: z.array(z.object({
    url: z.string().url(),
    publicId: z.string().optional(),
    alt: z.string().optional(),
    isPrimary: z.boolean().optional(),
  })).min(1, "অন্তত একটি ছবি আবশ্যক"),
  videoUrl: z.string().optional(),
  regularPrice: z.number().positive("নিয়মিত মূল্য ধনাত্মক হতে হবে"),
  salePrice: z.number().min(0).optional(),
  costPrice: z.number().min(0).optional(),
  stock: z.number().int().min(0, "স্টক ঋণাত্মক হতে পারে না"),
  minimumStock: z.number().int().min(0).default(5),
  trackInventory: z.boolean().default(true),
  hasVariants: z.boolean().default(false),
  variants: z.array(productVariantSchema).default([]),
  attributes: z.array(z.object({
    name: z.string(),
    values: z.array(z.string()),
  })).default([]),
  featured: z.boolean().default(false),
  newArrival: z.boolean().default(false),
  bestSeller: z.boolean().default(false),
  active: z.boolean().default(true),
});

export const reviewSchema = z.object({
  productId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(2, "শিরোনাম আবশ্যক").max(100),
  comment: z.string().min(5, "মতামত নূন্যতম ৫ অক্ষর হতে হবে").max(1000),
});

export const couponSchema = z.object({
  code: z.string().min(3).toUpperCase(),
  type: z.enum(["PERCENTAGE", "FIXED", "FREE_SHIPPING"]),
  amount: z.number().min(0),
  minOrder: z.number().min(0).default(0),
  maxDiscount: z.number().min(0).optional(),
  usageLimit: z.number().int().min(1).optional(),
  perCustomerLimit: z.number().int().min(1).default(1),
  startDate: z.string(),
  expiryDate: z.string(),
  active: z.boolean().default(true),
});
