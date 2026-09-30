import mongoose, { Schema, Document, Model } from "mongoose";

export interface IShippingZoneDoc extends Document {
  name: string;
  districts: string[];
  baseCharge: number;
  freeShippingThreshold?: number;
  estimatedDeliveryText: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ShippingZoneSchema = new Schema<IShippingZoneDoc>(
  {
    name: { type: String, required: true },
    districts: [{ type: String }],
    baseCharge: { type: Number, required: true },
    freeShippingThreshold: { type: Number },
    estimatedDeliveryText: { type: String, default: "২-৩ কার্যদিবসের মধ্যে ডেলিভারি" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const ShippingZone: Model<IShippingZoneDoc> =
  mongoose.models.ShippingZone ||
  mongoose.model<IShippingZoneDoc>("ShippingZone", ShippingZoneSchema);
