import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBannerDoc extends Document {
  title: string;
  subtitle?: string;
  desktopImage: string;
  mobileImage?: string;
  ctaText?: string;
  targetUrl: string;
  type: "HERO" | "PROMOTIONAL" | "CATEGORY";
  sortOrder: number;
  startAt?: Date;
  endAt?: Date;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BannerSchema = new Schema<IBannerDoc>(
  {
    title: { type: String, required: true },
    subtitle: { type: String },
    desktopImage: { type: String, required: true },
    mobileImage: { type: String },
    ctaText: { type: String, default: "এখনই কিনুন" },
    targetUrl: { type: String, required: true },
    type: { type: String, enum: ["HERO", "PROMOTIONAL", "CATEGORY"], default: "HERO" },
    sortOrder: { type: Number, default: 0 },
    startAt: { type: Date },
    endAt: { type: Date },
    active: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const Banner: Model<IBannerDoc> =
  mongoose.models.Banner || mongoose.model<IBannerDoc>("Banner", BannerSchema);
