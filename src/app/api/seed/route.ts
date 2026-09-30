import { NextResponse } from "next/server";
import { seedInitialData } from "@/lib/db/seed";

export async function GET() {
  try {
    await seedInitialData();
    return NextResponse.json({ success: true, message: "ডেটাবেস সফলভাবে ইনিশিয়ালাইজ ও সিড করা হয়েছে!" });
  } catch (err: unknown) {
    console.error("Seed error:", err);
    return NextResponse.json({ error: "সিড সম্পন্ন করা যায়নি" }, { status: 500 });
  }
}
