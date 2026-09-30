import { Coupon, ICouponDoc } from "@/models/Coupon";
import { Order } from "@/models/Order";

export interface CouponValidationResult {
  valid: boolean;
  message?: string;
  coupon?: ICouponDoc;
  discountAmount: number;
  freeShipping: boolean;
}

export class CouponService {
  static async validateCoupon(
    code: string,
    subtotal: number,
    customerId?: string,
    customerPhone?: string
  ): Promise<CouponValidationResult> {
    const coupon = await Coupon.findOne({
      code: code.trim().toUpperCase(),
      active: true,
    });

    if (!coupon) {
      return { valid: false, message: "কুপনটি সঠিক নয় বা সক্রিয় নেই", discountAmount: 0, freeShipping: false };
    }

    const now = new Date();
    if (now < coupon.startDate) {
      return { valid: false, message: "কুপনটির মেয়াদ এখনও শুরু হয়নি", discountAmount: 0, freeShipping: false };
    }

    if (now > coupon.expiryDate) {
      return { valid: false, message: "কুপনটির মেয়াদ উত্তীর্ণ হয়ে গেছে", discountAmount: 0, freeShipping: false };
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return { valid: false, message: "কুপনটির ব্যবহারের সর্বোচ্চ সীমা শেষ হয়ে গেছে", discountAmount: 0, freeShipping: false };
    }

    if (subtotal < coupon.minOrder) {
      return {
        valid: false,
        message: `এই কুপনটি ব্যবহার করতে নূন্যতম ৳${coupon.minOrder} টাকার অর্ডার প্রয়োজন`,
        discountAmount: 0,
        freeShipping: false,
      };
    }

    // Check per-customer limit if customerId or customerPhone is provided
    if (coupon.perCustomerLimit && (customerId || customerPhone)) {
      const query: Record<string, unknown> = {
        couponCode: coupon.code,
        orderStatus: { $ne: "CANCELLED" },
      };
      if (customerId) {
        query.customer = customerId;
      } else if (customerPhone) {
        query["guestCustomerInfo.phone"] = customerPhone;
      }

      const existingOrders = await Order.countDocuments(query);
      if (existingOrders >= coupon.perCustomerLimit) {
        return {
          valid: false,
          message: "আপনি ইতিমধ্যে এই কুপনটি ব্যবহারের সর্বোচ্চ সীমাতে পৌঁছে গেছেন",
          discountAmount: 0,
          freeShipping: false,
        };
      }
    }

    let discountAmount = 0;
    let freeShipping = false;

    if (coupon.type === "FREE_SHIPPING") {
      freeShipping = true;
    } else if (coupon.type === "PERCENTAGE") {
      discountAmount = (subtotal * coupon.amount) / 100;
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else if (coupon.type === "FIXED") {
      discountAmount = Math.min(coupon.amount, subtotal);
    }

    return {
      valid: true,
      coupon,
      discountAmount: Math.round(discountAmount),
      freeShipping,
    };
  }

  static async incrementCouponUsage(code: string): Promise<void> {
    await Coupon.updateOne(
      { code: code.toUpperCase() },
      { $inc: { usageCount: 1 } }
    );
  }

  static async decrementCouponUsage(code: string): Promise<void> {
    await Coupon.updateOne(
      { code: code.toUpperCase(), usageCount: { $gt: 0 } },
      { $inc: { usageCount: -1 } }
    );
  }
}
