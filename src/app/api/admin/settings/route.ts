import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { StoreSettings, getStoreSettings } from "@/models/StoreSettings";
import { AuditLog } from "@/models/AuditLog";
import { INITIAL_OWNER_EMAIL } from "@/lib/permissions/rbac";

export async function GET() {
  try {
    await connectDB();
    const settings = await getStoreSettings();
    return NextResponse.json(settings);
  } catch (err: unknown) {
    console.error("GET /api/admin/settings error:", err);
    return NextResponse.json({ error: "সেটিংস লোড করা যায়নি" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    await StoreSettings.findOneAndUpdate(
      { key: "global_store_settings" },
      { $set: body },
      { new: true, upsert: true }
    );

    await AuditLog.create({
      actor: { email: INITIAL_OWNER_EMAIL, role: "OWNER" },
      action: "SETTINGS_UPDATED",
      entityType: "SETTINGS",
      afterSummary: "স্টোর সেটিংস এবং থিম আপডেট করা হয়েছে",
    });

    const refreshed = await getStoreSettings();
    return NextResponse.json(refreshed);
  } catch (err: unknown) {
    console.error("PUT /api/admin/settings error:", err);
    return NextResponse.json({ error: "সেটিংস সংরক্ষণ করা সম্ভব হয়নি" }, { status: 500 });
  }
}
