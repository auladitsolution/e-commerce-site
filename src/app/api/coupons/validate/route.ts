import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { CouponService } from "@/services/couponService";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { code, subtotal, customerId, phone } = body;

    if (!code || typeof subtotal !== "number") {
      return NextResponse.json({ error: "কুপন কোড ও সাবটোটাল আবশ্যক" }, { status: 400 });
    }

    const result = await CouponService.validateCoupon(code, subtotal, customerId, phone);

    if (!result.valid) {
      return NextResponse.json({ valid: false, message: result.message }, { status: 400 });
    }

    return NextResponse.json({
      valid: true,
      code: result.coupon?.code,
      type: result.coupon?.type,
      discountAmount: result.discountAmount,
      freeShipping: result.freeShipping,
      message: "কুপনটি সফলভাবে প্রয়োগ করা হয়েছে!",
    });
  } catch (err: unknown) {
    console.error("POST /api/coupons/validate error:", err);
    return NextResponse.json({ error: "কুপন যাচাই করা সম্ভব হয়নি" }, { status: 500 });
  }
}
