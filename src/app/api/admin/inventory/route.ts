import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { StockMovement } from "@/models/StockMovement";
import { Product } from "@/models/Product";
import { InventoryService } from "@/services/inventoryService";
import { AuditLog } from "@/models/AuditLog";

export async function GET() {
  try {
    await connectDB();
    const movements = await StockMovement.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const lowStockProducts = await Product.find({
      active: true,
      $expr: { $lte: ["$stock", "$minimumStock"] },
    }).lean();

    return NextResponse.json({ movements, lowStockProducts });
  } catch (err: unknown) {
    console.error("GET /api/admin/inventory error:", err);
    return NextResponse.json({ error: "ইনভেন্টরি তথ্য লোড করা যায়নি" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { productId, variantId, quantity, type, reason } = body;

    if (!productId || typeof quantity !== "number" || !type || !reason) {
      return NextResponse.json({ error: "সকল তথ্য সঠিকভাবে পূরণ করুন" }, { status: 400 });
    }

    const result = await InventoryService.adjustStock({
      productId,
      variantId,
      quantity,
      type,
      reason,
      performedBy: "ADMIN",
    });

    await AuditLog.create({
      actor: { email: "admin@auladit.com", role: "ADMIN" },
      action: "STOCK_MANUALLY_ADJUSTED",
      entityType: "INVENTORY",
      entityId: productId,
      beforeSummary: `Previous stock: ${result.previousStock}`,
      afterSummary: `New stock: ${result.newStock}`,
      reason,
    });

    return NextResponse.json({ success: true, ...result });
  } catch (err: unknown) {
    console.error("POST /api/admin/inventory error:", err);
    const msg = err instanceof Error ? err.message : "স্টক সমন্বয় ব্যর্থ হয়েছে";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
