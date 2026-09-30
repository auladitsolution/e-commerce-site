import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { ReturnRequest } from "@/models/ReturnRequest";
import { Order } from "@/models/Order";
import { sanitizeString } from "@/lib/validation/schemas";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { orderId, orderNumber, items, reason, description, evidenceImages } = body;

    if (!orderId || !orderNumber || !items?.length || !reason || !description) {
      return NextResponse.json({ error: "সকল তথ্য সঠিকভাবে দিন" }, { status: 400 });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ error: "অর্ডারটি পাওয়া যায়নি" }, { status: 404 });
    }

    if (order.orderStatus !== "DELIVERED") {
      return NextResponse.json(
        { error: "শুধুমাত্র ডেলিভারিকৃত অর্ডারের ক্ষেত্রে রিটার্ন অনুরোধ করা যাবে" },
        { status: 400 }
      );
    }

    const cleanReason = sanitizeString(reason);
    const cleanDesc = sanitizeString(description);

    const returnReq = await ReturnRequest.create({
      order: order._id,
      orderNumber,
      customer: order.customer,
      items,
      reason: cleanReason,
      description: cleanDesc,
      evidenceImages: evidenceImages || [],
      status: "REQUESTED",
    });

    order.orderStatus = "RETURN_REQUESTED";
    order.timeline.push({
      status: "RETURN_REQUESTED",
      title: "রিটার্ন অনুরোধ জমা হয়েছে",
      note: `কারণ: ${cleanReason}`,
      timestamp: new Date(),
      updatedBy: "CUSTOMER",
    });
    await order.save();

    return NextResponse.json(
      {
        success: true,
        message: "আপনার রিটার্ন অনুরোধ সফলভাবে গৃহীত হয়েছে। আমাদের প্রতিনিধি দ্রুত যোগাযোগ করবেন।",
        returnReq,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error("POST /api/returns error:", err);
    return NextResponse.json({ error: "রিটার্ন অনুরোধ সম্পন্ন করা সম্ভব হয়নি" }, { status: 500 });
  }
}
