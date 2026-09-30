import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { OrderService } from "@/services/orderService";
import { checkoutSchema } from "@/lib/validation/schemas";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const parsed = checkoutSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "তথ্য অসম্পূর্ণ বা ভুল", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const {
      isGuest,
      customerInfo,
      shippingAddress,
      items,
      paymentMethod,
      manualPaymentDetails,
      couponCode,
      customerNote,
    } = parsed.data;

    // Execute order creation with authoritative server recalculation & stock safety
    const order = await OrderService.createOrder({
      isGuest,
      guestCustomerInfo: isGuest ? customerInfo : undefined,
      items,
      shippingAddress,
      paymentMethod,
      manualPaymentDetails,
      couponCode,
      customerNote,
    });

    return NextResponse.json(
      {
        success: true,
        orderNumber: order.orderNumber,
        trackingToken: order.trackingToken,
        grandTotal: order.grandTotal,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        message: "আপনার অর্ডার সফলভাবে সম্পন্ন হয়েছে!",
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("POST /api/checkout error:", error);
    const message = error instanceof Error ? error.message : "অর্ডার সম্পন্ন করা যায়নি। আবার চেষ্টা করুন।";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
