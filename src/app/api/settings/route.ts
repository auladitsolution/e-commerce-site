import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { getStoreSettings } from "@/models/StoreSettings";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const settings = await getStoreSettings();
    return NextResponse.json(settings);
  } catch (err: unknown) {
    console.error("GET /api/settings error:", err);
    return NextResponse.json({ error: "স্টোর কনফিগারেশন লোড করা সম্ভব হয়নি" }, { status: 500 });
  }
}
