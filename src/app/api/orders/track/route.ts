import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { Order } from "@/models/Order";
import { normalizeBDPhone } from "@/lib/utils/formatters";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { orderNumber, phone, trackingToken } = body;

    if (!orderNumber) {
      return NextResponse.json({ error: "অর্ডার নম্বর দিন" }, { status: 400 });
    }

    const cleanOrderNumber = orderNumber.trim().toUpperCase();

    // Secure search: must match orderNumber AND (phone OR trackingToken)
    let order = null;

    if (trackingToken) {
      order = await Order.findOne({
        orderNumber: cleanOrderNumber,
        trackingToken: trackingToken.trim().toUpperCase(),
      }).lean();
    } else if (phone) {
      const cleanPhone = normalizeBDPhone(phone);
      order = await Order.findOne({
        orderNumber: cleanOrderNumber,
        $or: [
          { "shippingAddress.phone": { $regex: cleanPhone } },
          { "guestCustomerInfo.phone": { $regex: cleanPhone } },
        ],
      }).lean();
    } else {
      return NextResponse.json(
        { error: "অর্ডার ট্র্যাকিং এর জন্য অর্ডারের মোবাইল নম্বর অথবা ট্র্যাকিং টোকেন দিন" },
        { status: 400 }
      );
    }

    if (!order) {
      return NextResponse.json(
        { error: "প্রদত্ত তথ্যের সাথে কোনো অর্ডার মেলেনি। তথ্য যাচাই করে আবার চেষ্টা করুন।" },
        { status: 404 }
      );
    }

    // Return safe tracking view (no internal sensitive notes)
    return NextResponse.json({
      orderNumber: order.orderNumber,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      grandTotal: order.grandTotal,
      items: order.items,
      courierInfo: order.courierInfo,
      timeline: order.timeline,
      createdAt: order.createdAt,
    });
  } catch (err: unknown) {
    console.error("POST /api/orders/track error:", err);
    return NextResponse.json({ error: "অর্ডার ট্র্যাকিং এ সমস্যা হয়েছে" }, { status: 500 });
  }
}
