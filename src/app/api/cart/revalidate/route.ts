import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { Product } from "@/models/Product";

interface CartItemInput {
  productId: string;
  variantId?: string;
  quantity: number;
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const items: CartItemInput[] = body.items || [];

    if (!items.length) {
      return NextResponse.json({ items: [], subtotal: 0, isValid: true });
    }

    const revalidatedItems = [];
    let subtotal = 0;
    let anyOutOfStock = false;
    let anyPriceChanged = false;

    for (const item of items) {
      const product = await Product.findById(item.productId).lean();
      if (!product || !product.active) {
        anyOutOfStock = true;
        continue;
      }

      let price = product.regularPrice;
      let availableStock = product.stock;
      let sku = product.sku;
      let variantTitle = undefined;
      let image = product.images?.[0]?.url || "";

      if (item.variantId) {
        const variant = product.variants?.find((v) => v.id === item.variantId);
        if (!variant || !variant.active) {
          anyOutOfStock = true;
          continue;
        }
        price = variant.salePrice && variant.salePrice < variant.regularPrice ? variant.salePrice : variant.regularPrice;
        availableStock = variant.stock;
        sku = variant.sku;
        variantTitle = variant.title;
        if (variant.image) image = variant.image;
      } else {
        price = product.salePrice && product.salePrice < product.regularPrice ? product.salePrice : product.regularPrice;
      }

      const validatedQuantity = Math.min(item.quantity, Math.max(0, availableStock));
      if (validatedQuantity < item.quantity) {
        anyOutOfStock = true;
      }

      const itemTotal = price * validatedQuantity;
      subtotal += itemTotal;

      revalidatedItems.push({
        productId: product._id.toString(),
        productName: product.nameBn,
        slug: product.slug,
        sku,
        variantId: item.variantId,
        variantTitle,
        image,
        quantity: validatedQuantity,
        unitPrice: price,
        finalPrice: itemTotal,
        maxStock: availableStock,
        isOutOfStock: availableStock <= 0,
      });
    }

    return NextResponse.json({
      items: revalidatedItems,
      subtotal,
      isValid: !anyOutOfStock && !anyPriceChanged,
      anyOutOfStock,
    });
  } catch (err: unknown) {
    console.error("POST /api/cart/revalidate error:", err);
    return NextResponse.json({ error: "কার্ট যাচাই করা সম্ভব হয়নি" }, { status: 500 });
  }
}
