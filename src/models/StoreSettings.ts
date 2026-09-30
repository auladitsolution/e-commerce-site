import mongoose, { Schema, Document, Model } from "mongoose";
import { StoreSettingsConfig } from "@/types/ecommerce";

export interface IStoreSettingsDoc extends Document, StoreSettingsConfig {
  key: string;
}

const StoreSettingsSchema = new Schema<IStoreSettingsDoc>(
  {
    key: { type: String, default: "global_store_settings", unique: true },
    storeProfile: {
      nameBn: { type: String, default: "স্মার্ট শপ বাংলাদেশ" },
      nameEn: { type: String, default: "Smart Shop Bangladesh" },
      logo: { type: String, default: "" },
      favicon: { type: String, default: "" },
      phone: { type: String, default: "01700000000" },
      email: { type: String, default: "support@smartshopbd.com" },
      address: { type: String, default: "ঢাকা, বাংলাদেশ" },
      facebook: { type: String, default: "https://facebook.com" },
      instagram: { type: String, default: "" },
      whatsapp: { type: String, default: "01700000000" },
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
  const settings = await StoreSettings.findOne({ key: "global_store_settings" }).lean();
  if (settings) {
    return settings as unknown as StoreSettingsConfig;
  }
  // Return standard defaults if not yet seeded
  return {
    storeProfile: {
      nameBn: "স্মার্ট শপ বাংলাদেশ",
      nameEn: "Smart Shop Bangladesh",
      phone: "01700000000",
      email: "support@smartshopbd.com",
      address: "ঢাকা, বাংলাদেশ",
      facebook: "https://facebook.com",
      whatsapp: "01700000000",
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
  };
}
