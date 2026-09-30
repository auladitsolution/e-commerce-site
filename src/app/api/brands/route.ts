import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { Brand } from "@/models/Brand";

export async function GET() {
  try {
    await connectDB();
    const brands = await Brand.find({ active: true }).sort({ name: 1 }).lean();
    return NextResponse.json(brands);
  } catch (err: unknown) {
    console.error("GET /api/brands error:", err);
    return NextResponse.json({ error: "ব্র্যান্ড লোড করা যায়নি" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const brand = await Brand.create(body);
    return NextResponse.json(brand, { status: 201 });
  } catch (err: unknown) {
    console.error("POST /api/brands error:", err);
    return NextResponse.json({ error: "ব্র্যান্ড তৈরি করা সম্ভব হয়নি" }, { status: 500 });
  }
}
