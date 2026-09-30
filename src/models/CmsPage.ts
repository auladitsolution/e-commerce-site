import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICmsPageDoc extends Document {
  slug: string;
  titleBn: string;
  titleEn: string;
  contentBn: string;
  contentEn: string;
  metaTitle?: string;
  metaDescription?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CmsPageSchema = new Schema<ICmsPageDoc>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    titleBn: { type: String, required: true },
    titleEn: { type: String, required: true },
    contentBn: { type: String, required: true },
    contentEn: { type: String, required: true },
    metaTitle: { type: String },
    metaDescription: { type: String },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const CmsPage: Model<ICmsPageDoc> =
  mongoose.models.CmsPage || mongoose.model<ICmsPageDoc>("CmsPage", CmsPageSchema);
