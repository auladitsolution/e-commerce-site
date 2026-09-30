# Aulad IT Solution — Professional E-Commerce & Management Platform

A modern, high-conversion, production-ready **Bengali-First E-Commerce Storefront + Comprehensive Admin Management System** developed by **Aulad IT Solution**.

Designed specifically for Bangladesh-based commercial enterprises across multiple verticals:
- **Fashion & Apparel** (পোশাক ও ফ্যাশন)
- **Electronics & Gadgets** (ইলেকট্রনিক্স ও গ্যাজেট)
- **Baby & Kids Products** (কিডস ও বেবি আইটেম)
- **Cosmetics & Skincare** (কসমেটিক্স ও স্কিনকেয়ার)
- **Home & Living** (হোম ও লিভিং)
- **Shoes & Accessories** (জুতো ও এক্সেসরিজ)

---

## 📱 Mobile-First & All-Device Responsive Design

The platform is meticulously engineered for fluid responsiveness across **smartphones, tablets, laptops, and ultra-wide desktops** (from 360px up to 4K resolutions):

1. **Touch-Optimized Mobile Navigation**:
   - **Header Mobile Drawer**: Full-screen slide-over menu with category browsing, direct links, and search.
   - **Mobile Bottom Navigation Bar**: Quick persistent access to Home (হোম), Shop (শপ), Wishlist (পছন্দ), Cart (কার্ট), and Account (অ্যাকাউন্ট).
   - **Single Product Sticky Checkout Bar**: On product details pages, the bottom nav seamlessly transitions into a high-converting sticky purchase bar with instant "কার্টে যোগ করুন" and "এখনই কিনুন" (Buy Now) buttons, docked at `bottom-0` with iOS safe area (`env(safe-area-inset-bottom)`) support.
   - **Mobile Catalog Filter Bottom Sheet**: Mobile shoppers can open a bottom sheet filter drawer to easily filter categories, stock availability, and sorting without leaving the viewport.
2. **2-Column Mobile Product Grids**:
   - Ultra-clean card proportioning (`p-2.5 sm:p-4`) on 360px–430px screens preventing text clipping while displaying badges, discounts, ratings, prices, and one-tap quick-add buttons.
3. **Responsive Admin Management Shell**:
   - Complete mobile admin sidebar drawer enabling store owners and staff to manage orders, update inventory, and view live sales KPIs directly from smartphones.

---

## ⚡ Technology Stack & Architecture

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/) with React 19 canary & Turbopack
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with custom `@theme` tokens and Hind Siliguri typography
- **Language**: TypeScript 5 (Strict Mode)
- **Database**: MongoDB with [Mongoose](https://mongoosejs.com/)
- **Authentication**: Role-Based Access Control (RBAC) supporting Customer, Staff, and Admin roles
- **Icons & UI**: [Lucide React](https://lucide.dev/), Sonner toast notifications, Recharts analytics

---

## 🇧🇩 Bangladesh E-Commerce Specifics

- **Currency**: BDT (`৳`) formatted with standard Bengali comma separation (`formatBDT`).
- **Phone Validation**: Bangladeshi 11-digit mobile format (`01XXXXXXXXX`) with operator prefix verification.
- **District & Shipping Zones**: Built-in 64 Bangladesh districts directory with dynamic delivery logic (Inside Dhaka ৳৬০, Outside Dhaka ৳১২০, Free shipping over ৳১,৫০০).
- **Payment Methods**:
  - Cash on Delivery (COD)
  - bKash Manual / Send Money with TrxID validation
  - Nagad Manual / Send Money with TrxID validation
- **Order Lifecycle State Machine**:
  - `pending` ➔ `confirmed` ➔ `processing` ➔ `shipped` ➔ `delivered`
  - Cancellation & atomic inventory rollback protection on `cancelled` or `returned`.

---

## 📂 Project Structure

```
├── src/
│   ├── app/                         # Next.js App Router
│   │   ├── (storefront)             # Homepage, products, cart, checkout, tracking
│   │   ├── account/                 # Customer profile, orders, wishlist
│   │   ├── admin/                   # Admin ERP: Dashboard, products, orders, inventory, reports
│   │   ├── api/                     # REST API endpoints (Admin & Storefront)
│   │   └── layout.tsx & globals.css # Root layout & Tailwind v4 theme
│   ├── components/
│   │   ├── admin/                   # AdminShell, mobile drawer, sidebar, stats cards
│   │   ├── storefront/              # Header, Footer, HeroSlider, ProductCard, MobileBottomNav
│   │   └── products/                # ProductDetailsView, MobileFilterDrawer
│   ├── hooks/                       # useCart, useWishlist, useAuth
│   ├── lib/
│   │   ├── db/                      # MongoDB connection & seed generator
│   │   └── utils/                   # BDT formatters, district lists, validators
│   ├── models/                      # 16 Mongoose Schemas (Product, Order, Customer, etc.)
│   ├── services/                    # InventoryService, OrderService, ProductService, etc.
│   └── types/                       # TypeScript interfaces
├── tests/                           # Commerce lifecycle & inventory safety test suite
├── CLIENT_SETUP.md                  # Client onboarding & deployment instructions
└── .env.example                     # Environment variables template
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js 20+
- MongoDB instance (Local or MongoDB Atlas)

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in your `MONGODB_URI` and store configuration values.

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser. Initial database seeding will execute automatically on first load.

### 5. Run Automated Tests
```bash
node tests/commerce.test.mjs
```

### 6. Production Build
```bash
npm run build
npm start
```

---

## 🛡️ Enterprise Security & Integrity

- **Server-Authoritative Pricing**: Storefront prices are re-verified against the database at checkout to prevent client-side price tampering.
- **Atomic Overselling Protection**: Stock decrement operations use atomic MongoDB `$inc` with negative stock checks (`stock: { $gte: qty }`).
- **Strict Role Gates**: All `/admin` routes and `/api/admin/*` endpoints enforce administrative authentication.

---

## 📞 Support & Client Deployment

For custom deployments, third-party courier integrations (Steadfast, Pathao, RedX), or SSLCommerz payment gateways, refer to [`CLIENT_SETUP.md`](CLIENT_SETUP.md) or contact **Aulad IT Solution**.
