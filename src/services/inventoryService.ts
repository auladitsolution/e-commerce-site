import { Product, IProductDoc } from "@/models/Product";
import { StockMovement } from "@/models/StockMovement";
import { StockMovementType } from "@/types/ecommerce";
import mongoose from "mongoose";

export interface DeductStockItem {
  productId: string;
  variantId?: string;
  quantity: number;
}

export class InventoryService {
  /**
   * Atomically verifies and deducts stock for order placement.
   * If any item lacks sufficient stock, rolls back deductions and throws an error.
   */
  static async deductStockForOrder(
    items: DeductStockItem[],
    orderNumber: string,
    performedBy: string = "SYSTEM"
  ): Promise<void> {
    const executedDeductions: {
      productId: string;
      variantId?: string;
      quantity: number;
      productName: string;
      sku: string;
      previousStock: number;
      newStock: number;
    }[] = [];

    try {
      for (const item of items) {
        if (item.variantId) {
          // Variant stock deduction
          const product = await Product.findOne({
            _id: item.productId,
            active: true,
            "variants.id": item.variantId,
            "variants.stock": { $gte: item.quantity },
          });

          if (!product) {
            throw new Error(`পণ্যটির ভ্যারিয়েন্ট স্টকে পর্যাপ্ত নেই বা অনুপলব্ধ`);
          }

          const variant = product.variants.find((v) => v.id === item.variantId)!;
          const previousStock = variant.stock;

          const updated = await Product.findOneAndUpdate(
            {
              _id: item.productId,
              "variants.id": item.variantId,
              "variants.stock": { $gte: item.quantity },
            },
            {
              $inc: {
                "variants.$.stock": -item.quantity,
                stock: -item.quantity, // Keep total aggregate stock in sync
              },
            },
            { new: true }
          );

          if (!updated) {
            throw new Error(`স্টক আপডেট করার সময় কনকারেন্সি সমস্যা হয়েছে। আবার চেষ্টা করুন।`);
          }

          const updatedVariant = updated.variants.find((v) => v.id === item.variantId)!;

          executedDeductions.push({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            productName: updated.nameBn,
            sku: variant.sku,
            previousStock,
            newStock: updatedVariant.stock,
          });
        } else {
          // Simple product stock deduction
          const product = await Product.findOne({
            _id: item.productId,
            active: true,
            stock: { $gte: item.quantity },
          });

          if (!product) {
            throw new Error(`পণ্যটি পর্যাপ্ত স্টকে নেই`);
          }

          const previousStock = product.stock;

          const updated = await Product.findOneAndUpdate(
            {
              _id: item.productId,
              stock: { $gte: item.quantity },
            },
            { $inc: { stock: -item.quantity } },
            { new: true }
          );

          if (!updated) {
            throw new Error(`স্টক ঘাটতি বা কনকারেন্সি সংঘর্ষ হয়েছে।`);
          }

          executedDeductions.push({
            productId: item.productId,
            quantity: item.quantity,
            productName: updated.nameBn,
            sku: updated.sku,
            previousStock,
            newStock: updated.stock,
          });
        }
      }

      // Record immutable stock movements for audit
      for (const ded of executedDeductions) {
        await StockMovement.create({
          product: new mongoose.Types.ObjectId(ded.productId),
          productName: ded.productName,
          sku: ded.sku,
          variantId: ded.variantId,
          type: "SALE",
          quantity: -ded.quantity,
          previousStock: ded.previousStock,
          newStock: ded.newStock,
          referenceType: "ORDER",
          referenceId: orderNumber,
          reason: `অর্ডার সম্পন্ন: ${orderNumber}`,
          createdBy: performedBy,
        });
      }
    } catch (err) {
      // Rollback any items that were already deducted
      for (const d of executedDeductions) {
        if (d.variantId) {
          await Product.updateOne(
            { _id: d.productId, "variants.id": d.variantId },
            {
              $inc: {
                "variants.$.stock": d.quantity,
                stock: d.quantity,
              },
            }
          );
        } else {
          await Product.updateOne(
            { _id: d.productId },
            { $inc: { stock: d.quantity } }
          );
        }
      }
      throw err;
    }
  }

  /**
   * Restores stock upon order cancellation or return.
   */
  static async restoreStockForOrder(
    items: { productId: string; variantId?: string; quantity: number }[],
    orderNumber: string,
    reason: string,
    type: StockMovementType = "CANCELLATION_RELEASE",
    performedBy: string = "SYSTEM"
  ): Promise<void> {
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) continue;

      if (item.variantId) {
        const variant = product.variants.find((v) => v.id === item.variantId);
        if (variant) {
          const previousStock = variant.stock;
          const updated = await Product.findOneAndUpdate(
            { _id: item.productId, "variants.id": item.variantId },
            {
              $inc: {
                "variants.$.stock": item.quantity,
                stock: item.quantity,
              },
            },
            { new: true }
          );

          if (updated) {
            const updatedVariant = updated.variants.find((v) => v.id === item.variantId)!;
            await StockMovement.create({
              product: product._id,
              productName: product.nameBn,
              sku: variant.sku,
              variantId: item.variantId,
              type,
              quantity: item.quantity,
              previousStock,
              newStock: updatedVariant.stock,
              referenceType: "ORDER",
              referenceId: orderNumber,
              reason,
              createdBy: performedBy,
            });
          }
        }
      } else {
        const previousStock = product.stock;
        const updated = await Product.findByIdAndUpdate(
          item.productId,
          { $inc: { stock: item.quantity } },
          { new: true }
        );

        if (updated) {
          await StockMovement.create({
            product: product._id,
            productName: product.nameBn,
            sku: product.sku,
            type,
            quantity: item.quantity,
            previousStock,
            newStock: updated.stock,
            referenceType: "ORDER",
            referenceId: orderNumber,
            reason,
            createdBy: performedBy,
          });
        }
      }
    }
  }

  /**
   * Manual Stock Adjustment with audit trail.
   */
  static async adjustStock(params: {
    productId: string;
    variantId?: string;
    quantity: number; // positive to add, negative to remove
    type: StockMovementType;
    reason: string;
    performedBy: string;
  }): Promise<{ previousStock: number; newStock: number }> {
    const product = await Product.findById(params.productId);
    if (!product) {
      throw new Error("পণ্যটি পাওয়া যায়নি");
    }

    if (params.variantId) {
      const variant = product.variants.find((v) => v.id === params.variantId);
      if (!variant) throw new Error("ভ্যারিয়েন্ট পাওয়া যায়নি");

      const previousStock = variant.stock;
      const newStock = previousStock + params.quantity;
      if (newStock < 0) {
        throw new Error("স্টক শূন্যের নিচে নামানো সম্ভব নয়");
      }

      const updated = await Product.findOneAndUpdate(
        { _id: params.productId, "variants.id": params.variantId },
        {
          $inc: {
            "variants.$.stock": params.quantity,
            stock: params.quantity,
          },
        },
        { new: true }
      );

      if (!updated) throw new Error("স্টক সমন্বয় ব্যর্থ হয়েছে");
      const updatedVariant = updated.variants.find((v) => v.id === params.variantId)!;

      await StockMovement.create({
        product: product._id,
        productName: product.nameBn,
        sku: variant.sku,
        variantId: params.variantId,
        type: params.type,
        quantity: params.quantity,
        previousStock,
        newStock: updatedVariant.stock,
        referenceType: "ADJUSTMENT",
        reason: params.reason,
        createdBy: params.performedBy,
      });

      return { previousStock, newStock: updatedVariant.stock };
    } else {
      const previousStock = product.stock;
      const newStock = previousStock + params.quantity;
      if (newStock < 0) {
        throw new Error("স্টক শূন্যের নিচে নামানো সম্ভব নয়");
      }

      const updated = await Product.findByIdAndUpdate(
        params.productId,
        { $inc: { stock: params.quantity } },
        { new: true }
      );

      if (!updated) throw new Error("স্টক সমন্বয় ব্যর্থ হয়েছে");

      await StockMovement.create({
        product: product._id,
        productName: product.nameBn,
        sku: product.sku,
        type: params.type,
        quantity: params.quantity,
        previousStock,
        newStock: updated.stock,
        referenceType: "ADJUSTMENT",
        reason: params.reason,
        createdBy: params.performedBy,
      });

      return { previousStock, newStock: updated.stock };
    }
  }
}
