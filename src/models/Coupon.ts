import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICouponDoc extends Document {
  code: string;
  type: "PERCENTAGE" | "FIXED" | "FREE_SHIPPING";
  amount: number;
  minOrder: number;
  maxDiscount?: number;
  usageLimit?: number;
  usageCount: number;
  perCustomerLimit: number;
  applicableCategories: string[];
  applicableProducts: string[];
  startDate: Date;
  expiryDate: Date;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CouponSchema = new Schema<ICouponDoc>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, index: true },
    type: { type: String, enum: ["PERCENTAGE", "FIXED", "FREE_SHIPPING"], required: true },
    amount: { type: Number, required: true },
    minOrder: { type: Number, default: 0 },
    maxDiscount: { type: Number },
    usageLimit: { type: Number },
    usageCount: { type: Number, default: 0 },
    perCustomerLimit: { type: Number, default: 1 },
    applicableCategories: [{ type: String }],
    applicableProducts: [{ type: String }],
    startDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true },
    active: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const Coupon: Model<ICouponDoc> =
  mongoose.models.Coupon || mongoose.model<ICouponDoc>("Coupon", CouponSchema);
