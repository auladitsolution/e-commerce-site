import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { Product } from "@/models/Product";
import { AuditLog } from "@/models/AuditLog";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const product = await Product.findById(id).lean();

    if (!product) {
      return NextResponse.json({ error: "পণ্যটি পাওয়া যায়নি" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (err: unknown) {
    console.error("GET /api/products/[id] error:", err);
    return NextResponse.json({ error: "সার্ভার সমস্যা হয়েছে" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    const existing = await Product.findById(id);
    if (!existing) {
      return NextResponse.json({ error: "পণ্যটি পাওয়া যায়নি" }, { status: 404 });
    }

    const priceChanged = existing.regularPrice !== body.regularPrice || existing.salePrice !== body.salePrice;

    const updated = await Product.findByIdAndUpdate(id, body, { new: true });

    if (priceChanged) {
      await AuditLog.create({
        actor: { email: "admin@auladit.com", role: "ADMIN" },
        action: "PRODUCT_PRICE_CHANGED",
        entityType: "PRODUCT",
        entityId: id,
        beforeSummary: `Regular: ${existing.regularPrice}, Sale: ${existing.salePrice}`,
        afterSummary: `Regular: ${body.regularPrice}, Sale: ${body.salePrice}`,
      });
    }

    return NextResponse.json(updated);
  } catch (err: unknown) {
    console.error("PUT /api/products/[id] error:", err);
    return NextResponse.json({ error: "পণ্য আপডেট করা সম্ভব হয়নি" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    // Never permanently delete products to protect historical order integrity: Soft deactivate!
    const product = await Product.findByIdAndUpdate(
      id,
      { active: false },
      { new: true }
    );

    if (!product) {
      return NextResponse.json({ error: "পণ্য পাওয়া যায়নি" }, { status: 404 });
    }

    await AuditLog.create({
      actor: { email: "admin@auladit.com", role: "ADMIN" },
      action: "PRODUCT_DEACTIVATED",
      entityType: "PRODUCT",
      entityId: id,
      afterSummary: `পণ্য নিষ্ক্রিয় করা হয়েছে: ${product.nameBn}`,
    });

    return NextResponse.json({ message: "পণ্য সফলভাবে নিষ্ক্রিয় করা হয়েছে" });
  } catch (err: unknown) {
    console.error("DELETE /api/products/[id] error:", err);
    return NextResponse.json({ error: "সার্ভার সমস্যা হয়েছে" }, { status: 500 });
  }
}
