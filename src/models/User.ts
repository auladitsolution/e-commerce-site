import mongoose, { Schema, Document, Model } from "mongoose";
import { AdminRole, Permission } from "@/types/ecommerce";
import { ROLE_PERMISSIONS } from "@/lib/permissions/rbac";

export interface IUser extends Document {
  firebaseUid: string;
  email: string;
  name: string;
  role: AdminRole;
  permissions: Permission[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    firebaseUid: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    role: {
      type: String,
      enum: ["OWNER", "ADMIN", "ORDER_MANAGER", "PRODUCT_MANAGER", "CUSTOMER_SUPPORT", "ACCOUNTANT"],
      default: "ORDER_MANAGER",
    },
    permissions: [{ type: String }],
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

UserSchema.pre("save", function () {
  if (this.isModified("role") && (!this.permissions || this.permissions.length === 0)) {
    this.permissions = ROLE_PERMISSIONS[this.role] || [];
  }
});

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
