import mongoose, { Schema, Document, Model } from "mongoose";

export interface IRefundDoc extends Document {
  order: mongoose.Types.ObjectId;
  orderNumber: string;
  returnRequest?: mongoose.Types.ObjectId;
  amount: number;
  method: string; // "BKASH", "NAGAD", "BANK", "STORE_CREDIT"
  status: "PENDING" | "PROCESSED" | "FAILED";
  reason: string;
  processedBy: string;
  processedAt?: Date;
  transactionReference?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RefundSchema = new Schema<IRefundDoc>(
  {
    order: { type: Schema.Types.ObjectId, ref: "Order", required: true, index: true },
    orderNumber: { type: String, required: true, index: true },
    returnRequest: { type: Schema.Types.ObjectId, ref: "ReturnRequest", index: true },
    amount: { type: Number, required: true },
    method: { type: String, required: true },
    status: {
      type: String,
      enum: ["PENDING", "PROCESSED", "FAILED"],
      default: "PENDING",
      index: true,
    },
    reason: { type: String, required: true },
    processedBy: { type: String, required: true },
    processedAt: { type: Date },
    transactionReference: { type: String },
  },
  { timestamps: true }
);

export const Refund: Model<IRefundDoc> =
  mongoose.models.Refund || mongoose.model<IRefundDoc>("Refund", RefundSchema);
