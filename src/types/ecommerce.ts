export type AdminRole = 
  | 'OWNER' 
  | 'ADMIN' 
  | 'ORDER_MANAGER' 
  | 'PRODUCT_MANAGER' 
  | 'CUSTOMER_SUPPORT' 
  | 'ACCOUNTANT';

export type Permission = 
  | 'products.read'
  | 'products.write'
  | 'orders.read'
  | 'orders.update'
  | 'orders.refund'
  | 'customers.read'
  | 'reports.financial'
  | 'settings.manage'
  | 'users.manage'
  | 'inventory.adjust';

export type OrderStatus = 
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'PACKED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURN_REQUESTED'
  | 'RETURNED'
  | 'REFUNDED';

export type PaymentMethod = 
  | 'COD'
  | 'BKASH'
  | 'NAGAD'
  | 'ROCKET'
  | 'BANK_TRANSFER'
  | 'ONLINE_GATEWAY';

export type PaymentStatus = 
  | 'PENDING'
  | 'PENDING_VERIFICATION'
  | 'PAID'
  | 'FAILED'
  | 'REFUNDED'
  | 'CANCELLED';

export type StockMovementType = 
  | 'PURCHASE'
  | 'ORDER_RESERVATION'
  | 'SALE'
  | 'CANCELLATION_RELEASE'
  | 'RETURN'
  | 'ADJUSTMENT_IN'
  | 'ADJUSTMENT_OUT'
  | 'DAMAGE'
  | 'OPENING_STOCK';

export interface ImageAsset {
  url: string;
  publicId?: string;
  alt?: string;
  isPrimary?: boolean;
}

export interface ProductAttributeValue {
  name: string;
  value: string;
}

export interface ProductVariant {
  id: string;
  title: string; // e.g. "Black / M" or "128GB / Blue"
  sku: string;
  barcode?: string;
  attributes: Record<string, string>; // { "Color": "Black", "Size": "M" }
  regularPrice: number;
  salePrice?: number;
  costPrice?: number;
  stock: number;
  image?: string;
  active: boolean;
}

export interface ProductItem {
  _id?: string;
  id?: string;
  productCode: string;
  sku: string;
  barcode?: string;
  nameBn: string;
  nameEn: string;
  slug: string;
  shortDescription?: string;
  description: string;
  category: string; // category slug or name
  subcategory?: string;
  brand?: string;
  tags: string[];
  images: ImageAsset[];
  videoUrl?: string;
  regularPrice: number;
  salePrice?: number;
  costPrice?: number;
  stock: number;
  minimumStock: number;
  trackInventory: boolean;
  hasVariants: boolean;
  variants: ProductVariant[];
  attributes: { name: string; values: string[] }[];
  weight?: number;
  dimensions?: { length?: number; width?: number; height?: number };
  shippingClass?: string;
  featured: boolean;
  newArrival: boolean;
  bestSeller: boolean;
  active: boolean;
  rating: number;
  reviewCount: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface Address {
  _id?: string;
  label: string; // "বাসা" | "অফিস"
  recipientName: string;
  phone: string;
  district: string;
  area: string;
  fullAddress: string;
  isDefault?: boolean;
}

export interface CustomerUser {
  _id?: string;
  firebaseUid: string;
  name: string;
  phone: string;
  email?: string;
  photoUrl?: string;
  addresses: Address[];
  createdAt?: string | Date;
}

export interface CartItem {
  productId: string;
  productName: string;
  slug: string;
  sku: string;
  variantId?: string;
  variantTitle?: string;
  image: string;
  quantity: number;
  unitPrice: number;
  salePrice?: number;
  finalPrice: number;
  maxStock: number;
}

export interface OrderItemSnapshot {
  productId: string;
  productName: string;
  sku: string;
  variantId?: string;
  variantTitle?: string;
  image: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  costSnapshot?: number;
  finalPrice: number;
}

export interface OrderTimelineItem {
  status: OrderStatus;
  title: string;
  note?: string;
  timestamp: string | Date;
  updatedBy?: string;
}

export interface OrderDocument {
  _id?: string;
  orderNumber: string;
  trackingToken?: string;
  customer?: string; // customer ID if logged in
  isGuest: boolean;
  guestCustomerInfo?: {
    name: string;
    phone: string;
    email?: string;
  };
  items: OrderItemSnapshot[];
  shippingAddress: Address;
  subtotal: number;
  productDiscount: number;
  couponDiscount: number;
  shippingCharge: number;
  additionalCharge: number;
  grandTotal: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  couponCode?: string;
  customerNote?: string;
  internalNote?: string;
  courierInfo?: {
    courierName?: string;
    consignmentId?: string;
    trackingUrl?: string;
    shippingDate?: string | Date;
    notes?: string;
  };
  cancellationReason?: string;
  timeline: OrderTimelineItem[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface ShippingZoneConfig {
  _id?: string;
  name: string;
  districts: string[];
  baseCharge: number;
  freeShippingThreshold?: number;
  estimatedDeliveryText: string;
  active: boolean;
}

export interface FeatureFlags {
  guestCheckout: boolean;
  wishlist: boolean;
  reviews: boolean;
  flashSale: boolean;
  coupons: boolean;
  brands: boolean;
  productBundles: boolean;
  recommendations: boolean;
  abandonedCart: boolean;
  expenseManagement: boolean;
  customerSegments: boolean;
  bulkProductManagement: boolean;
  courierIntegration: boolean;
  onlinePayment: boolean;
  bilingualStorefront: boolean;
  customerAccounts: boolean;
}

export interface StoreThemeConfig {
  primaryColor: string;
  primaryHover: string;
  accentColor: string;
  borderRadius: string;
  logoUrl?: string;
  faviconUrl?: string;
  announcementText?: string;
  showAnnouncement: boolean;
}

export interface StoreSettingsConfig {
  storeProfile: {
    nameBn: string;
    nameEn: string;
    logo?: string;
    favicon?: string;
    phone: string;
    email: string;
    address: string;
    facebook?: string;
    instagram?: string;
    whatsapp?: string;
  };
  commerce: {
    currency: string;
    currencySymbol: string;
    codEnabled: boolean;
    guestCheckout: boolean;
    minimumOrderAmount: number;
    defaultShippingZone?: string;
    orderPrefix: string;
  };
  theme: StoreThemeConfig;
  features: FeatureFlags;
}
