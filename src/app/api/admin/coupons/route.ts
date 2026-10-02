import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { Coupon } from "@/models/Coupon";
import { AuditLog } from "@/models/AuditLog";
import { INITIAL_OWNER_EMAIL } from "@/lib/permissions/rbac";

export async function GET() {
  try {
    await connectDB();
    const coupons = await Coupon.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(coupons);
  } catch (err: unknown) {
    console.error("GET /api/admin/coupons error:", err);
    return NextResponse.json({ error: "কুপন লোড করা যায়নি" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const coupon = await Coupon.create({
      code: body.code.trim().toUpperCase(),
      type: body.type,
      amount: Number(body.amount),
      minOrder: Number(body.minOrder || 0),
      maxDiscount: body.maxDiscount ? Number(body.maxDiscount) : undefined,
      usageLimit: body.usageLimit ? Number(body.usageLimit) : undefined,
      perCustomerLimit: 1,
      startDate: new Date(),
      expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days default
      active: true,
    });

    await AuditLog.create({
      actor: { email: INITIAL_OWNER_EMAIL, role: "OWNER" },
      action: "COUPON_CREATED",
      entityType: "COUPON",
      entityId: coupon._id.toString(),
      afterSummary: `কুপন তৈরি করা হয়েছে: ${coupon.code} (${coupon.type} - ${coupon.amount})`,
    });

    return NextResponse.json(coupon, { status: 201 });
  } catch (err: unknown) {
    console.error("POST /api/admin/coupons error:", err);
    return NextResponse.json({ error: "কুপন তৈরি করা সম্ভব হয়নি" }, { status: 500 });
  }
}
