import mongoose, { Schema, Document, Model } from "mongoose";
import { StockMovementType } from "@/types/ecommerce";

export interface IStockMovement extends Document {
  product: mongoose.Types.ObjectId;
  productName: string;
  sku: string;
  variantId?: string;
  variantTitle?: string;
  type: StockMovementType;
  quantity: number;
  previousStock: number;
  newStock: number;
  referenceType: "ORDER" | "ADJUSTMENT" | "PURCHASE" | "RETURN" | "INITIAL";
  referenceId?: string;
  reason?: string;
  createdBy?: string;
  createdAt: Date;
}

const StockMovementSchema = new Schema<IStockMovement>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true, index: true },
    productName: { type: String, required: true },
    sku: { type: String, required: true, index: true },
    variantId: { type: String },
    variantTitle: { type: String },
    type: {
      type: String,
      enum: [
        "PURCHASE",
        "ORDER_RESERVATION",
        "SALE",
        "CANCELLATION_RELEASE",
        "RETURN",
        "ADJUSTMENT_IN",
        "ADJUSTMENT_OUT",
        "DAMAGE",
        "OPENING_STOCK",
      ],
      required: true,
      index: true,
    },
    quantity: { type: Number, required: true },
    previousStock: { type: Number, required: true },
    newStock: { type: Number, required: true },
    referenceType: {
      type: String,
      enum: ["ORDER", "ADJUSTMENT", "PURCHASE", "RETURN", "INITIAL"],
      required: true,
    },
    referenceId: { type: String, index: true },
    reason: { type: String },
    createdBy: { type: String, default: "SYSTEM" },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const StockMovement: Model<IStockMovement> =
  mongoose.models.StockMovement ||
  mongoose.model<IStockMovement>("StockMovement", StockMovementSchema);
