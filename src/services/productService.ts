import { Product, IProductDoc } from "@/models/Product";

export interface ProductFilterQuery {
  search?: string;
  category?: string;
  subcategory?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  featured?: boolean;
  newArrival?: boolean;
  bestSeller?: boolean;
  sort?: "newest" | "price_asc" | "price_desc" | "best_seller" | "rating";
  page?: number;
  limit?: number;
}

export class ProductService {
  static async getProducts(filters: ProductFilterQuery = {}) {
    const page = Math.max(1, filters.page || 1);
    const limit = Math.min(50, Math.max(1, filters.limit || 12));
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = { active: true };

    if (filters.search && filters.search.trim()) {
      const searchTerm = filters.search.trim();
      query.$or = [
        { nameBn: { $regex: searchTerm, $options: "i" } },
        { nameEn: { $regex: searchTerm, $options: "i" } },
        { sku: { $regex: searchTerm, $options: "i" } },
        { tags: { $in: [new RegExp(searchTerm, "i")] } },
      ];
    }

    if (filters.category) {
      query.category = filters.category;
    }

    if (filters.subcategory) {
      query.subcategory = filters.subcategory;
    }

    if (filters.brand) {
      query.brand = filters.brand;
    }

    if (filters.inStockOnly) {
      query.stock = { $gt: 0 };
    }

    if (filters.featured !== undefined) {
      query.featured = filters.featured;
    }

    if (filters.newArrival !== undefined) {
      query.newArrival = filters.newArrival;
    }

    if (filters.bestSeller !== undefined) {
      query.bestSeller = filters.bestSeller;
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      const priceFilter: Record<string, number> = {};
      if (filters.minPrice !== undefined) priceFilter.$gte = filters.minPrice;
      if (filters.maxPrice !== undefined) priceFilter.$lte = filters.maxPrice;
      query.$or = [
        { salePrice: { $exists: true, ...priceFilter } },
        { regularPrice: priceFilter },
      ];
    }

    let sortOptions: Record<string, 1 | -1> = { createdAt: -1 };

    switch (filters.sort) {
      case "price_asc":
        sortOptions = { regularPrice: 1 };
        break;
      case "price_desc":
        sortOptions = { regularPrice: -1 };
        break;
      case "best_seller":
        sortOptions = { bestSeller: -1, reviewCount: -1 };
        break;
      case "rating":
        sortOptions = { rating: -1 };
        break;
      case "newest":
      default:
        sortOptions = { createdAt: -1 };
        break;
    }

    const [products, total] = await Promise.all([
      Product.find(query).sort(sortOptions).skip(skip).limit(limit).lean(),
      Product.countDocuments(query),
    ]);

    return {
      products: products as unknown as IProductDoc[],
      total,
      page,
      totalPages: Math.ceil(total / limit),
      hasMore: skip + products.length < total,
    };
  }

  static async getProductBySlug(slug: string): Promise<IProductDoc | null> {
    const product = await Product.findOne({ slug, active: true }).lean();
    return product as unknown as IProductDoc | null;
  }

  static async getRelatedProducts(category: string, currentId?: string, limit = 4) {
    const query: Record<string, unknown> = {
      category,
      active: true,
    };
    if (currentId) {
      query._id = { $ne: currentId };
    }
    const related = await Product.find(query).limit(limit).lean();
    return related as unknown as IProductDoc[];
  }
}
