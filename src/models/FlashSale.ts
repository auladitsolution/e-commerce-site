import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFlashSaleProduct {
  productId: mongoose.Types.ObjectId;
  promotionalPrice: number;
}

export interface IFlashSaleDoc extends Document {
  title: string;
  startAt: Date;
  endAt: Date;
  products: IFlashSaleProduct[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FlashSaleProductSchema = new Schema<IFlashSaleProduct>({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  promotionalPrice: { type: Number, required: true },
});

const FlashSaleSchema = new Schema<IFlashSaleDoc>(
  {
    title: { type: String, required: true },
    startAt: { type: Date, required: true },
    endAt: { type: Date, required: true },
    products: [FlashSaleProductSchema],
    active: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const FlashSale: Model<IFlashSaleDoc> =
  mongoose.models.FlashSale || mongoose.model<IFlashSaleDoc>("FlashSale", FlashSaleSchema);
