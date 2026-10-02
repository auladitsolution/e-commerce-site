import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { ProductService, ProductFilterQuery } from "@/services/productService";
import { Product } from "@/models/Product";
import { productSchema } from "@/lib/validation/schemas";
import { AuditLog } from "@/models/AuditLog";
import { INITIAL_OWNER_EMAIL } from "@/lib/permissions/rbac";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    const filters: ProductFilterQuery = {
      search: searchParams.get("search") || undefined,
      category: searchParams.get("category") || undefined,
      subcategory: searchParams.get("subcategory") || undefined,
      brand: searchParams.get("brand") || undefined,
      minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
      maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
      inStockOnly: searchParams.get("inStockOnly") === "true",
      featured: searchParams.get("featured") ? searchParams.get("featured") === "true" : undefined,
      newArrival: searchParams.get("newArrival") ? searchParams.get("newArrival") === "true" : undefined,
      bestSeller: searchParams.get("bestSeller") ? searchParams.get("bestSeller") === "true" : undefined,
      sort: (searchParams.get("sort") as ProductFilterQuery["sort"]) || "newest",
      page: searchParams.get("page") ? parseInt(searchParams.get("page")!, 10) : 1,
      limit: searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : 12,
    };

    const result = await ProductService.getProducts(filters);
    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("GET /api/products error:", error);
    return NextResponse.json(
      { error: "পণ্য তালিকা লোড করা যায়নি" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const parsed = productSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "তথ্য সঠিকভাবে পূরণ করুন", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const existing = await Product.findOne({
      $or: [{ sku: parsed.data.sku }, { slug: parsed.data.slug }],
    });

    if (existing) {
      return NextResponse.json(
        { error: "এই SKU বা স্লাগ ইতিমধ্যে বিদ্যমান রয়েছে" },
        { status: 409 }
      );
    }

    const newProduct = await Product.create(parsed.data);

    // Audit log
    await AuditLog.create({
      actor: { email: INITIAL_OWNER_EMAIL, role: "OWNER" },
      action: "PRODUCT_CREATED",
      entityType: "PRODUCT",
      entityId: newProduct._id.toString(),
      afterSummary: `পণ্য তৈরি করা হয়েছে: ${newProduct.nameBn} (${newProduct.sku})`,
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: unknown) {
    console.error("POST /api/products error:", error);
    return NextResponse.json(
      { error: "পণ্য যোগ করা সম্ভব হয়নি" },
      { status: 500 }
    );
  }
}
