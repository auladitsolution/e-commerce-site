# AULAD IT SOLUTION — SINGLE-TENANT CLIENT SETUP MANUAL

This guide documents the step-by-step deployment procedure for launching an independent, single-tenant online store using the **Aulad IT Solution E-Commerce Master Codebase**.

---

## 1. Client Architecture Overview

Each client receives:
- **Independent MongoDB Atlas Database**: Isolated collections, data, and indexes.
- **Dedicated Firebase Project**: Isolated customer & staff authentication.
- **Dedicated Cloudinary Storage**: Client-specific image/media bucket.
- **Independent Vercel Deployment**: Custom environment variables and domain.
- **Independent Store Configuration**: Branding, colors, feature flags, and policies.

Data is NEVER mixed between clients.

---

## 2. Step-by-Step Client Deployment Checklist

### Step 1: MongoDB Atlas Database Setup
1. Log in to [MongoDB Atlas](https://cloud.mongodb.com).
2. Create a new cluster under the client's organization or project.
3. In **Database Access**, create a user `ecommerce_app` with a secure 32-character random password.
4. In **Network Access**, whitelist Vercel IPs or allow `0.0.0.0/0` with strong authentication.
5. Copy the connection string format:
   ```env
   MONGODB_URI=mongodb+srv://ecommerce_app:<password>@cluster0.client.mongodb.net/ecommerce_db?retryWrites=true&w=majority
   MONGODB_DB_NAME=ecommerce_db
   ```

### Step 2: Firebase Client & Admin Authentication
1. Go to [Firebase Console](https://console.firebase.google.com) and create project `client-ecommerce`.
2. Under **Build > Authentication**, enable:
   - Google Sign-In
   - Email/Password (if needed)
3. Under **Authorized Domains**, add the client's custom domain (e.g. `clientstore.com`) and Vercel domains.
4. Copy Web App Config:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
5. Go to **Project Settings > Service Accounts**, click **Generate new private key** for Firebase Admin SDK:
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_CLIENT_EMAIL`
   - `FIREBASE_PRIVATE_KEY`

### Step 3: Cloudinary Media Storage
1. Log in to [Cloudinary](https://cloudinary.com) and create a dedicated cloud account or sub-account.
2. Note credentials:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`

### Step 4: Environment Variables Setup
Populate the deployment environment variables (Vercel Project Settings > Environment Variables):
```env
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://clientstore.com
NEXT_PUBLIC_APP_NAME="ক্লায়েন্ট স্টোর"

MONGODB_URI=...
MONGODB_DB_NAME=...

NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...

FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY="..."

CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

INITIAL_OWNER_EMAIL=clientadmin@clientstore.com
INITIAL_OWNER_NAME="Client Admin"
```

### Step 5: Database Seeding & Initial Launch
1. Trigger initial seed by accessing:
   ```
   https://clientstore.com/api/seed
   ```
   This creates default categories, initial admin user, default shipping zones (Inside Dhaka ৳60 / Outside Dhaka ৳120), and global store settings.

### Step 6: Store Branding & Settings Configuration
1. Log in to the management dashboard: `https://clientstore.com/admin/settings`.
2. Update **Store Profile**:
   - Store Name (Bangla & English)
   - Helpline phone number & Email
   - Office / Warehouse address
   - Social links (Facebook, WhatsApp)
3. Update **Theme & Colors**:
   - Primary Brand Color (HEX)
   - Accent Color (HEX)
   - Announcement banner text
4. Configure **Feature Flags**:
   - Toggle Guest Checkout, Wishlist, Flash Sale, Reviews, Bulk Management.

### Step 7: Adding Products & Catalog
1. Go to `https://clientstore.com/admin/products/new`.
2. Add initial products, variants (Size, Color, etc.), upload real images via Cloudinary.
3. Set accurate Regular Price, Sale Price, and Cost of Goods Sold (COGS).

### Step 8: Pre-Launch QA Verification
Verify the following 10 items before turning domain live:
- [ ] Mobile storefront responsiveness at 360px, 390px, 768px.
- [ ] Add to Cart and Buy Now flows.
- [ ] Guest checkout and Bangladeshi 11-digit phone number validation.
- [ ] Shipping charges calculate correctly for Dhaka and outside Dhaka.
- [ ] Order placement generates sequential collision-safe order number.
- [ ] Stock deducts atomically and prevents overselling.
- [ ] Status transition state-machine works in `/admin/orders/[id]`.
- [ ] Order cancellation restores stock correctly.
- [ ] Order tracking works by Order Number + Phone.
- [ ] Profit and Loss statement shows accurate figures with historical cost snapshots.

---

## 3. Maintenance & Backup Routine
- **MongoDB Atlas**: Enable automated daily backups in Atlas cluster settings.
- **Admin Access**: Always assign granular roles (e.g. `ORDER_MANAGER`, `PRODUCT_MANAGER`) to staff rather than sharing `OWNER` credentials.
- **Auditing**: Review `/admin/audit-logs` periodically for any sensitive price adjustments or order status overrides.
