import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICustomerAddress {
  label: string;
  recipientName: string;
  phone: string;
  district: string;
  area: string;
  fullAddress: string;
  isDefault: boolean;
}

export interface ICustomer extends Document {
  firebaseUid: string;
  name: string;
  phone: string;
  email?: string;
  photoUrl?: string;
  addresses: ICustomerAddress[];
  wishlist: mongoose.Types.ObjectId[];
  totalOrders: number;
  totalSpent: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AddressSubSchema = new Schema<ICustomerAddress>({
  label: { type: String, default: "বাসা" },
  recipientName: { type: String, required: true },
  phone: { type: String, required: true },
  district: { type: String, required: true },
  area: { type: String, required: true },
  fullAddress: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
});

const CustomerSchema = new Schema<ICustomer>(
  {
    firebaseUid: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    phone: { type: String, required: true, index: true },
    email: { type: String, sparse: true, index: true },
    photoUrl: { type: String },
    addresses: [AddressSubSchema],
    wishlist: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    totalOrders: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Customer: Model<ICustomer> =
  mongoose.models.Customer || mongoose.model<ICustomer>("Customer", CustomerSchema);
