import mongoose, { Schema, Document, Model } from "mongoose";
import { OrderStatus, PaymentMethod, PaymentStatus, OrderItemSnapshot, OrderTimelineItem } from "@/types/ecommerce";

export interface IOrderDoc extends Document {
  orderNumber: string;
  trackingToken: string;
  customer?: mongoose.Types.ObjectId;
  isGuest: boolean;
  guestCustomerInfo?: {
    name: string;
    phone: string;
    email?: string;
  };
  items: OrderItemSnapshot[];
  shippingAddress: {
    label: string;
    recipientName: string;
    phone: string;
    district: string;
    area: string;
    fullAddress: string;
  };
  subtotal: number;
  productDiscount: number;
  couponDiscount: number;
  shippingCharge: number;
  additionalCharge: number;
  grandTotal: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  couponCode?: string;
  customerNote?: string;
  internalNote?: string;
  courierInfo?: {
    courierName?: string;
    consignmentId?: string;
    trackingUrl?: string;
    shippingDate?: Date;
    notes?: string;
  };
  cancellationReason?: string;
  timeline: OrderTimelineItem[];
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSnapshotSchema = new Schema<OrderItemSnapshot>({
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  sku: { type: String, required: true },
  variantId: { type: String },
  variantTitle: { type: String },
  image: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  costSnapshot: { type: Number, default: 0 },
  finalPrice: { type: Number, required: true },
});

const OrderTimelineSchema = new Schema<OrderTimelineItem>({
  status: { type: String, required: true },
  title: { type: String, required: true },
  note: { type: String },
  timestamp: { type: Date, default: Date.now },
  updatedBy: { type: String, default: "SYSTEM" },
});

const OrderSchema = new Schema<IOrderDoc>(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    trackingToken: { type: String, required: true, unique: true, index: true },
    customer: { type: Schema.Types.ObjectId, ref: "Customer", index: true },
    isGuest: { type: Boolean, default: false },
    guestCustomerInfo: {
      name: { type: String },
      phone: { type: String, index: true },
      email: { type: String },
    },
    items: [OrderItemSnapshotSchema],
    shippingAddress: {
      label: { type: String, default: "বাসা" },
      recipientName: { type: String, required: true },
      phone: { type: String, required: true },
      district: { type: String, required: true },
      area: { type: String, required: true },
      fullAddress: { type: String, required: true },
    },
    subtotal: { type: Number, required: true },
    productDiscount: { type: Number, default: 0 },
    couponDiscount: { type: Number, default: 0 },
    shippingCharge: { type: Number, required: true },
    additionalCharge: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["COD", "BKASH", "NAGAD", "ROCKET", "BANK_TRANSFER", "ONLINE_GATEWAY"],
      required: true,
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "PENDING_VERIFICATION", "PAID", "FAILED", "REFUNDED", "CANCELLED"],
      default: "PENDING",
      index: true,
    },
    orderStatus: {
      type: String,
      enum: [
        "PENDING",
        "CONFIRMED",
        "PROCESSING",
        "PACKED",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED",
        "RETURN_REQUESTED",
        "RETURNED",
        "REFUNDED",
      ],
      default: "PENDING",
      index: true,
    },
    couponCode: { type: String },
    customerNote: { type: String },
    internalNote: { type: String },
    courierInfo: {
      courierName: { type: String },
      consignmentId: { type: String },
      trackingUrl: { type: String },
      shippingDate: { type: Date },
      notes: { type: String },
    },
    cancellationReason: { type: String },
    timeline: [OrderTimelineSchema],
  },
  { timestamps: true }
);

export const Order: Model<IOrderDoc> =
  mongoose.models.Order || mongoose.model<IOrderDoc>("Order", OrderSchema);
