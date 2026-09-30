import mongoose, { Schema, Document, Model } from "mongoose";
import { PaymentMethod, PaymentStatus } from "@/types/ecommerce";

export interface IPaymentDoc extends Document {
  orderId: mongoose.Types.ObjectId;
  orderNumber: string;
  provider: string; // "MANUAL_BKASH", "MANUAL_NAGAD", "COD", "GATEWAY"
  method: PaymentMethod;
  amount: number;
  currency: string;
  status: PaymentStatus;
  transactionId?: string;
  senderNumber?: string;
  verifiedBy?: string;
  verifiedAt?: Date;
  rawCallback?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPaymentDoc>(
  {
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true, index: true },
    orderNumber: { type: String, required: true, index: true },
    provider: { type: String, required: true },
    method: {
      type: String,
      enum: ["COD", "BKASH", "NAGAD", "ROCKET", "BANK_TRANSFER", "ONLINE_GATEWAY"],
      required: true,
    },
    amount: { type: Number, required: true },
    currency: { type: String, default: "BDT" },
    status: {
      type: String,
      enum: ["PENDING", "PENDING_VERIFICATION", "PAID", "FAILED", "REFUNDED", "CANCELLED"],
      default: "PENDING",
      index: true,
    },
    transactionId: { type: String, sparse: true, index: true },
    senderNumber: { type: String },
    verifiedBy: { type: String },
    verifiedAt: { type: Date },
    rawCallback: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export const Payment: Model<IPaymentDoc> =
  mongoose.models.Payment || mongoose.model<IPaymentDoc>("Payment", PaymentSchema);
