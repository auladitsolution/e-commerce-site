import { AdminRole, Permission } from "@/types/ecommerce";

export const ROLE_PERMISSIONS: Record<AdminRole, Permission[]> = {
  OWNER: [
    "products.read",
    "products.write",
    "orders.read",
    "orders.update",
    "orders.refund",
    "customers.read",
    "reports.financial",
    "settings.manage",
    "users.manage",
    "inventory.adjust",
  ],
  ADMIN: [
    "products.read",
    "products.write",
    "orders.read",
    "orders.update",
    "orders.refund",
    "customers.read",
    "reports.financial",
    "settings.manage",
    "inventory.adjust",
  ],
  ORDER_MANAGER: [
    "orders.read",
    "orders.update",
    "products.read",
    "inventory.adjust",
  ],
  PRODUCT_MANAGER: [
    "products.read",
    "products.write",
    "inventory.adjust",
  ],
  CUSTOMER_SUPPORT: [
    "orders.read",
    "customers.read",
    "products.read",
  ],
  ACCOUNTANT: [
    "orders.read",
    "reports.financial",
  ],
};

const DEFAULT_OWNER_EMAILS = [
  "auladinfo@gmail.com",
  "auladsoftware@gmail.com",
];

export function getOwnerEmails(): string[] {
  const set = new Set<string>(DEFAULT_OWNER_EMAILS.map((e) => e.toLowerCase().trim()));

  const envValues = [
    process.env.INITIAL_OWNER_EMAIL,
    process.env.NEXT_PUBLIC_INITIAL_OWNER_EMAIL,
  ];

  for (const item of envValues) {
    if (!item) continue;
    const cleaned = item.replace(/['"]/g, "");
    const parts = cleaned.split(/[,;\s]+/);
    for (const p of parts) {
      const trimmed = p.toLowerCase().trim();
      if (trimmed && trimmed.includes("@")) {
        set.add(trimmed);
      }
    }
  }

  return Array.from(set);
}

export const INITIAL_OWNER_EMAIL = "auladinfo@gmail.com";

export const INITIAL_OWNER_NAME = (
  process.env.INITIAL_OWNER_NAME ||
  process.env.NEXT_PUBLIC_INITIAL_OWNER_NAME ||
  "Aulad Admin"
).replace(/['"]/g, "").trim();

export function isOwnerEmail(email?: string | null): boolean {
  if (!email) return false;
  const normalized = email.toLowerCase().replace(/['"]/g, "").trim();
  const owners = getOwnerEmails();
  return owners.includes(normalized);
}

export function hasPermission(role: AdminRole, permission: Permission): boolean {
  if (role === "OWNER") return true;
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
}

