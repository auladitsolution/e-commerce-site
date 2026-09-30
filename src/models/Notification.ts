import mongoose, { Schema, Document, Model } from "mongoose";

export interface INotificationDoc extends Document {
  recipientType: "ADMIN" | "CUSTOMER";
  recipientId?: string; // customer ID or admin role/id
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotificationDoc>(
  {
    recipientType: { type: String, enum: ["ADMIN", "CUSTOMER"], required: true, index: true },
    recipientId: { type: String, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    link: { type: String },
    read: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Notification: Model<INotificationDoc> =
  mongoose.models.Notification ||
  mongoose.model<INotificationDoc>("Notification", NotificationSchema);
