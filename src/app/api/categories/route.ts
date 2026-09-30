import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { Category } from "@/models/Category";

export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find({ active: true }).sort({ sortOrder: 1 }).lean();
    return NextResponse.json(categories);
  } catch (err: unknown) {
    console.error("GET /api/categories error:", err);
    return NextResponse.json({ error: "ক্যাটাগরি লোড করা যায়নি" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const category = await Category.create(body);
    return NextResponse.json(category, { status: 201 });
  } catch (err: unknown) {
    console.error("POST /api/categories error:", err);
    return NextResponse.json({ error: "ক্যাটাগরি তৈরি করা সম্ভব হয়নি" }, { status: 500 });
  }
}
