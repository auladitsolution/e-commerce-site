import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { Order } from "@/models/Order";
import { Payment } from "@/models/Payment";
import { AuditLog } from "@/models/AuditLog";
import { OrderService } from "@/services/orderService";
import { OrderStatus } from "@/types/ecommerce";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const order = await Order.findById(id).lean();
    if (!order) {
      return NextResponse.json({ error: "অর্ডারটি পাওয়া যায়নি" }, { status: 404 });
    }

    const payment = await Payment.findOne({ orderId: id }).lean();

    return NextResponse.json({ order, payment });
  } catch (err: unknown) {
    console.error("GET /api/orders/[id] error:", err);
    return NextResponse.json({ error: "অর্ডার লোড করা যায়নি" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    const { status, note, courierInfo, paymentVerified } = body;

    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ error: "অর্ডারটি পাওয়া যায়নি" }, { status: 404 });
    }

    // Status update using explicit lifecycle machine
    if (status && status !== order.orderStatus) {
      await OrderService.updateOrderStatus(id, status as OrderStatus, note, "ADMIN");

      await AuditLog.create({
        actor: { email: "admin@auladit.com", role: "ADMIN" },
        action: "ORDER_STATUS_CHANGED",
        entityType: "ORDER",
        entityId: id,
        beforeSummary: `Status: ${order.orderStatus}`,
        afterSummary: `Status: ${status}`,
        reason: note,
      });
    }

    // Courier assignment
    if (courierInfo) {
      order.courierInfo = {
        courierName: courierInfo.courierName,
        consignmentId: courierInfo.consignmentId,
        trackingUrl: courierInfo.trackingUrl,
        shippingDate: new Date(),
        notes: courierInfo.notes,
      };
      await order.save();
    }

    // Manual payment verification
    if (paymentVerified) {
      order.paymentStatus = "PAID";
      await order.save();
      await Payment.updateOne(
        { orderId: id },
        {
          status: "PAID",
          verifiedBy: "ADMIN",
          verifiedAt: new Date(),
        }
      );

      await AuditLog.create({
        actor: { email: "admin@auladit.com", role: "ADMIN" },
        action: "PAYMENT_MANUALLY_VERIFIED",
        entityType: "PAYMENT",
        entityId: id,
        afterSummary: `Payment verified for Order: ${order.orderNumber}`,
      });
    }

    const updatedOrder = await Order.findById(id).lean();
    return NextResponse.json(updatedOrder);
  } catch (err: unknown) {
    console.error("PATCH /api/orders/[id] error:", err);
    const msg = err instanceof Error ? err.message : "অর্ডার আপডেট করা সম্ভব হয়নি";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
