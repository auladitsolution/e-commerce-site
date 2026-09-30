import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProductVariantDoc {
  id: string;
  title: string;
  sku: string;
  barcode?: string;
  attributes: Record<string, string>;
  regularPrice: number;
  salePrice?: number;
  costPrice?: number;
  stock: number;
  image?: string;
  active: boolean;
}

export interface IProductImageDoc {
  url: string;
  publicId?: string;
  alt?: string;
  isPrimary?: boolean;
}

export interface IProductDoc extends Document {
  productCode: string;
  sku: string;
  barcode?: string;
  nameBn: string;
  nameEn: string;
  slug: string;
  shortDescription?: string;
  description: string;
  category: string;
  subcategory?: string;
  brand?: string;
  tags: string[];
  images: IProductImageDoc[];
  videoUrl?: string;
  regularPrice: number;
  salePrice?: number;
  costPrice?: number;
  stock: number;
  minimumStock: number;
  trackInventory: boolean;
  hasVariants: boolean;
  variants: IProductVariantDoc[];
  attributes: { name: string; values: string[] }[];
  weight?: number;
  dimensions?: { length?: number; width?: number; height?: number };
  shippingClass?: string;
  featured: boolean;
  newArrival: boolean;
  bestSeller: boolean;
  active: boolean;
  rating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductVariantSchema = new Schema<IProductVariantDoc>({
  id: { type: String, required: true },
  title: { type: String, required: true },
  sku: { type: String, required: true },
  barcode: { type: String },
  attributes: { type: Map, of: String, default: {} },
  regularPrice: { type: Number, required: true },
  salePrice: { type: Number },
  costPrice: { type: Number },
  stock: { type: Number, required: true, default: 0 },
  image: { type: String },
  active: { type: Boolean, default: true },
});

const ProductImageSchema = new Schema<IProductImageDoc>({
  url: { type: String, required: true },
  publicId: { type: String },
  alt: { type: String },
  isPrimary: { type: Boolean, default: false },
});

const ProductSchema = new Schema<IProductDoc>(
  {
    productCode: { type: String, required: true, index: true },
    sku: { type: String, required: true, unique: true, index: true },
    barcode: { type: String, sparse: true, index: true },
    nameBn: { type: String, required: true },
    nameEn: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    shortDescription: { type: String },
    description: { type: String, required: true },
    category: { type: String, required: true, index: true },
    subcategory: { type: String, index: true },
    brand: { type: String, index: true },
    tags: [{ type: String }],
    images: [ProductImageSchema],
    videoUrl: { type: String },
    regularPrice: { type: Number, required: true },
    salePrice: { type: Number },
    costPrice: { type: Number },
    stock: { type: Number, required: true, default: 0 },
    minimumStock: { type: Number, default: 5 },
    trackInventory: { type: Boolean, default: true },
    hasVariants: { type: Boolean, default: false },
    variants: [ProductVariantSchema],
    attributes: [
      {
        name: { type: String, required: true },
        values: [{ type: String }],
      },
    ],
    weight: { type: Number },
    dimensions: {
      length: { type: Number },
      width: { type: Number },
      height: { type: Number },
    },
    shippingClass: { type: String, default: "STANDARD" },
    featured: { type: Boolean, default: false, index: true },
    newArrival: { type: Boolean, default: false, index: true },
    bestSeller: { type: Boolean, default: false, index: true },
    active: { type: Boolean, default: true, index: true },
    rating: { type: Number, default: 5 },
    reviewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Text index for search across Bangla name, English name, and tags
ProductSchema.index({
  nameBn: "text",
  nameEn: "text",
  tags: "text",
  sku: "text",
});

export const Product: Model<IProductDoc> =
  mongoose.models.Product || mongoose.model<IProductDoc>("Product", ProductSchema);
