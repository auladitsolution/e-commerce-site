import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { Review } from "@/models/Review";
import { Product } from "@/models/Product";
import { reviewSchema, sanitizeString } from "@/lib/validation/schemas";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json({ error: "পণ্য আইডি আবশ্যক" }, { status: 400 });
    }

    const reviews = await Review.find({
      product: new mongoose.Types.ObjectId(productId),
      status: "APPROVED",
    })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(reviews);
  } catch (err: unknown) {
    console.error("GET /api/reviews error:", err);
    return NextResponse.json({ error: "রিভিউ লোড করা যায়নি" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const parsed = reviewSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "রিভিউ সঠিকভাবে পূরণ করুন", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const cleanTitle = sanitizeString(parsed.data.title);
    const cleanComment = sanitizeString(parsed.data.comment);

    const review = await Review.create({
      product: new mongoose.Types.ObjectId(parsed.data.productId),
      customerName: body.customerName || "সন্তুষ্ট ক্রেতা",
      rating: parsed.data.rating,
      title: cleanTitle,
      comment: cleanComment,
      verifiedPurchase: true,
      status: "APPROVED", // Auto-approved or moderation status
    });

    // Update product average rating
    const allReviews = await Review.find({
      product: review.product,
      status: "APPROVED",
    });

    const totalScore = allReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = allReviews.length > 0 ? totalScore / allReviews.length : 5;

    await Product.findByIdAndUpdate(review.product, {
      rating: Number(avgRating.toFixed(1)),
      reviewCount: allReviews.length,
    });

    return NextResponse.json(
      { success: true, message: "আপনার মতামত সফলভাবে জমা হয়েছে!", review },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error("POST /api/reviews error:", err);
    return NextResponse.json({ error: "রিভিউ জমা দেওয়া সম্ভব হয়নি" }, { status: 500 });
  }
}
