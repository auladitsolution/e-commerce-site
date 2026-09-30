import mongoose, { Schema, Document, Model } from "mongoose";

export interface IReturnItem {
  productId: string;
  sku: string;
  productName: string;
  quantity: number;
}

export interface IReturnRequestDoc extends Document {
  order: mongoose.Types.ObjectId;
  orderNumber: string;
  customer?: mongoose.Types.ObjectId;
  items: IReturnItem[];
  reason: string;
  description: string;
  evidenceImages: string[];
  status: "REQUESTED" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "RECEIVED" | "COMPLETED";
  refundAmount?: number;
  adminNote?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReturnItemSchema = new Schema<IReturnItem>({
  productId: { type: String, required: true },
  sku: { type: String, required: true },
  productName: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const ReturnRequestSchema = new Schema<IReturnRequestDoc>(
  {
    order: { type: Schema.Types.ObjectId, ref: "Order", required: true, index: true },
    orderNumber: { type: String, required: true, index: true },
    customer: { type: Schema.Types.ObjectId, ref: "Customer" },
    items: [ReturnItemSchema],
    reason: { type: String, required: true },
    description: { type: String, required: true },
    evidenceImages: [{ type: String }],
    status: {
      type: String,
      enum: ["REQUESTED", "UNDER_REVIEW", "APPROVED", "REJECTED", "RECEIVED", "COMPLETED"],
      default: "REQUESTED",
      index: true,
    },
    refundAmount: { type: Number },
    adminNote: { type: String },
  },
  { timestamps: true }
);

export const ReturnRequest: Model<IReturnRequestDoc> =
  mongoose.models.ReturnRequest ||
  mongoose.model<IReturnRequestDoc>("ReturnRequest", ReturnRequestSchema);
