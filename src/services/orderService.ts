import { Order, IOrderDoc } from "@/models/Order";
import { Product } from "@/models/Product";
import { Payment } from "@/models/Payment";
import { Customer } from "@/models/Customer";
import { ShippingZone } from "@/models/ShippingZone";
import { InventoryService } from "@/services/inventoryService";
import { CouponService } from "@/services/couponService";
import { generateOrderNumber, generateTrackingToken } from "@/lib/utils/orderNumber";
import {
  OrderStatus,
  PaymentMethod,
  OrderItemSnapshot,
  Address,
} from "@/types/ecommerce";
import mongoose from "mongoose";

export interface CreateOrderParams {
  customerId?: string;
  isGuest: boolean;
  guestCustomerInfo?: {
    name: string;
    phone: string;
    email?: string;
  };
  items: {
    productId: string;
    variantId?: string;
    quantity: number;
  }[];
  shippingAddress: Address;
  paymentMethod: PaymentMethod;
  manualPaymentDetails?: {
    senderNumber?: string;
    transactionId?: string;
  };
  couponCode?: string;
  customerNote?: string;
}

export class OrderService {
  /**
   * Authoritatively calculates shipping charge from database configuration
   */
  static async calculateShipping(district: string, subtotal: number): Promise<number> {
    const zones = await ShippingZone.find({ active: true });
    
    // Find matching zone for the district
    let matchedZone = zones.find((z) =>
      z.districts.some((d) => d.toLowerCase().includes(district.toLowerCase()) || district.toLowerCase().includes(d.toLowerCase()))
    );

    // Fallback zone if no exact match (e.g. Dhaka vs Outside Dhaka)
    if (!matchedZone) {
      const isDhaka = district.toLowerCase().includes("ঢাকা") || district.toLowerCase().includes("dhaka");
      matchedZone = zones.find((z) =>
        isDhaka
          ? z.name.toLowerCase().includes("dhaka") || z.name.includes("ঢাকা")
          : z.name.toLowerCase().includes("outside") || z.name.includes("বাইরে")
      );
    }

    if (matchedZone) {
      if (
        matchedZone.freeShippingThreshold &&
        subtotal >= matchedZone.freeShippingThreshold
      ) {
        return 0;
      }
      return matchedZone.baseCharge;
    }

    // Default Bangladesh shipping rules: Inside Dhaka ৳60, Outside Dhaka ৳120
    const isDhaka = district.toLowerCase().includes("ঢাকা") || district.toLowerCase().includes("dhaka");
    if (subtotal >= 1500) return 0; // Free shipping threshold default
    return isDhaka ? 60 : 120;
  }

  /**
   * Creates an order with strict server-side validation and atomic stock reservation
   */
  static async createOrder(params: CreateOrderParams): Promise<IOrderDoc> {
    if (!params.items || params.items.length === 0) {
      throw new Error("অর্ডারে কোনো পণ্য পাওয়া যায়নি");
    }

    // 1. Authoritative price & stock verification
    const itemSnapshots: OrderItemSnapshot[] = [];
    let subtotal = 0;

    for (const item of params.items) {
      const product = await Product.findById(item.productId);
      if (!product || !product.active) {
        throw new Error("পণ্যটি পাওয়া যায়নি বা নিষ্ক্রিয় রয়েছে");
      }

      let unitPrice = product.regularPrice;
      let costSnapshot = product.costPrice || 0;
      let sku = product.sku;
      let variantTitle: string | undefined;
      let image = product.images?.[0]?.url || "/placeholder-product.jpg";

      if (item.variantId) {
        const variant = product.variants.find((v) => v.id === item.variantId);
        if (!variant || !variant.active) {
          throw new Error("নির্বাচিত ভ্যারিয়েন্টটি স্টকে নেই");
        }
        if (variant.stock < item.quantity) {
          throw new Error(`ভ্যারিয়েন্ট "${variant.title}" এর পর্যাপ্ত স্টক নেই (বর্তমান স্টক: ${variant.stock})`);
        }
        unitPrice = variant.salePrice && variant.salePrice < variant.regularPrice
          ? variant.salePrice
          : variant.regularPrice;
        costSnapshot = variant.costPrice || product.costPrice || 0;
        sku = variant.sku;
        variantTitle = variant.title;
        if (variant.image) image = variant.image;
      } else {
        if (product.stock < item.quantity) {
          throw new Error(`"${product.nameBn}" এর পর্যাপ্ত স্টক নেই (বর্তমান স্টক: ${product.stock})`);
        }
        unitPrice = product.salePrice && product.salePrice < product.regularPrice
          ? product.salePrice
          : product.regularPrice;
      }

      const itemTotal = unitPrice * item.quantity;
      subtotal += itemTotal;

      itemSnapshots.push({
        productId: product._id.toString(),
        productName: product.nameBn,
        sku,
        variantId: item.variantId,
        variantTitle,
        image,
        quantity: item.quantity,
        unitPrice,
        discount: 0,
        costSnapshot,
        finalPrice: itemTotal,
      });
    }

    // 2. Shipping calculation
    let shippingCharge = await this.calculateShipping(
      params.shippingAddress.district,
      subtotal
    );

    // 3. Coupon validation
    let couponDiscount = 0;
    if (params.couponCode) {
      const customerPhone = params.isGuest
        ? params.guestCustomerInfo?.phone
        : params.shippingAddress.phone;
      const couponCheck = await CouponService.validateCoupon(
        params.couponCode,
        subtotal,
        params.customerId,
        customerPhone
      );
      if (couponCheck.valid) {
        couponDiscount = couponCheck.discountAmount;
        if (couponCheck.freeShipping) {
          shippingCharge = 0;
        }
      }
    }

    const grandTotal = Math.max(0, subtotal - couponDiscount + shippingCharge);

    // 4. Collision-safe Order Number & Tracking Token
    const orderNumber = await generateOrderNumber("ORD");
    const trackingToken = generateTrackingToken();

    // 5. Deduct stock atomically with rollback guarantee
    await InventoryService.deductStockForOrder(
      params.items,
      orderNumber,
      params.customerId || "GUEST"
    );

    try {
      // 6. Create Order document
      const order = await Order.create({
        orderNumber,
        trackingToken,
        customer: params.customerId ? new mongoose.Types.ObjectId(params.customerId) : undefined,
        isGuest: params.isGuest,
        guestCustomerInfo: params.guestCustomerInfo,
        items: itemSnapshots,
        shippingAddress: params.shippingAddress,
        subtotal,
        productDiscount: 0,
        couponDiscount,
        shippingCharge,
        additionalCharge: 0,
        grandTotal,
        paymentMethod: params.paymentMethod,
        paymentStatus: params.paymentMethod === "COD" ? "PENDING" : "PENDING_VERIFICATION",
        orderStatus: "PENDING",
        couponCode: params.couponCode?.toUpperCase(),
        customerNote: params.customerNote,
        timeline: [
          {
            status: "PENDING",
            title: "অর্ডার গ্রহণ করা হয়েছে",
            note: "গ্রাহক সফলভাবে অর্ডারটি সাবমিট করেছেন।",
            timestamp: new Date(),
            updatedBy: params.customerId ? "CUSTOMER" : "GUEST",
          },
        ],
      });

      // 7. Create Payment Record
      await Payment.create({
        orderId: order._id,
        orderNumber: order.orderNumber,
        provider: params.paymentMethod === "COD" ? "COD" : `MANUAL_${params.paymentMethod}`,
        method: params.paymentMethod,
        amount: grandTotal,
        currency: "BDT",
        status: params.paymentMethod === "COD" ? "PENDING" : "PENDING_VERIFICATION",
        senderNumber: params.manualPaymentDetails?.senderNumber,
        transactionId: params.manualPaymentDetails?.transactionId,
      });

      // 8. Increment coupon usage
      if (params.couponCode) {
        await CouponService.incrementCouponUsage(params.couponCode);
      }

      // 9. Update Customer metrics if authenticated
      if (params.customerId) {
        await Customer.findByIdAndUpdate(params.customerId, {
          $inc: { totalOrders: 1, totalSpent: grandTotal },
        });
      }

      return order;
    } catch (orderCreateError) {
      // If order persistence failed after stock deduction, restore stock
      await InventoryService.restoreStockForOrder(
        params.items,
        orderNumber,
        "অর্ডার তৈরিতে ত্রুটির কারণে স্টক পুনরুদ্ধার",
        "CANCELLATION_RELEASE",
        "SYSTEM_ROLLBACK"
      );
      throw orderCreateError;
    }
  }

  /**
   * Order status transition enforcement matrix
   */
  static async updateOrderStatus(
    orderId: string,
    newStatus: OrderStatus,
    note?: string,
    updatedBy: string = "ADMIN"
  ): Promise<IOrderDoc> {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error("অর্ডারটি পাওয়া যায়নি");
    }

    const currentStatus = order.orderStatus;

    // Strict state transitions
    const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
      PENDING: ["CONFIRMED", "CANCELLED"],
      CONFIRMED: ["PROCESSING", "CANCELLED"],
      PROCESSING: ["PACKED", "CANCELLED"],
      PACKED: ["SHIPPED", "CANCELLED"],
      SHIPPED: ["DELIVERED", "RETURN_REQUESTED", "CANCELLED"],
      DELIVERED: ["RETURN_REQUESTED", "RETURNED"],
      CANCELLED: [], // terminal
      RETURN_REQUESTED: ["RETURNED", "DELIVERED"],
      RETURNED: ["REFUNDED"],
      REFUNDED: [], // terminal
    };

    const allowed = allowedTransitions[currentStatus] || [];
    if (!allowed.includes(newStatus)) {
      throw new Error(`অবস্থা '${currentStatus}' থেকে '${newStatus}'-এ পরিবর্তন অনুমোদিত নয়`);
    }

    // Handle cancellation stock restoration
    if (newStatus === "CANCELLED" && currentStatus !== "CANCELLED") {
      await InventoryService.restoreStockForOrder(
        order.items.map((i) => ({
          productId: i.productId,
          variantId: i.variantId,
          quantity: i.quantity,
        })),
        order.orderNumber,
        note || "অর্ডার বাতিলকরণ",
        "CANCELLATION_RELEASE",
        updatedBy
      );

      // Decrement coupon usage if used
      if (order.couponCode) {
        await CouponService.decrementCouponUsage(order.couponCode);
      }
    }

    const statusTitleBn: Record<OrderStatus, string> = {
      PENDING: "অর্ডার অপেক্ষমাণ",
      CONFIRMED: "অর্ডার কনফার্ম করা হয়েছে",
      PROCESSING: "প্রসেসিং শুরু হয়েছে",
      PACKED: "প্যাকেজিং সম্পন্ন",
      SHIPPED: "কুরিয়ারে হস্তান্তর করা হয়েছে",
      DELIVERED: "ডেলিভারি সম্পন্ন",
      CANCELLED: "অর্ডার বাতিল করা হয়েছে",
      RETURN_REQUESTED: "রিটার্ন অনুরোধ জমা হয়েছে",
      RETURNED: "পণ্য ফেরত এসেছে",
      REFUNDED: "টাকা রিফান্ড করা হয়েছে",
    };

    order.orderStatus = newStatus;
    if (newStatus === "CANCELLED") {
      order.cancellationReason = note;
    }
    if (newStatus === "DELIVERED" && order.paymentMethod === "COD") {
      order.paymentStatus = "PAID";
      await Payment.updateOne({ orderId: order._id }, { status: "PAID" });
    }

    order.timeline.push({
      status: newStatus,
      title: statusTitleBn[newStatus] || newStatus,
      note,
      timestamp: new Date(),
      updatedBy,
    });

    await order.save();
    return order;
  }
}
