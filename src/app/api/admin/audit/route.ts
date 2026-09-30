import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { AuditLog } from "@/models/AuditLog";

export async function GET() {
  try {
    await connectDB();
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(100).lean();
    return NextResponse.json(logs);
  } catch (err: unknown) {
    console.error("GET /api/admin/audit error:", err);
    return NextResponse.json({ error: "অডিট লগ লোড করা যায়নি" }, { status: 500 });
  }
}
