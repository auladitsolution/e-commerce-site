import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { ReportService } from "@/services/reportService";

export async function GET() {
  try {
    await connectDB();
    const metrics = await ReportService.getDashboardMetrics();
    const profit = await ReportService.getProfitReport();

    return NextResponse.json({ ...metrics, profit });
  } catch (err: unknown) {
    console.error("GET /api/admin/dashboard error:", err);
    return NextResponse.json({ error: "ড্যাশবোর্ড তথ্য লোড করা যায়নি" }, { status: 500 });
  }
}
