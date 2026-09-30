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

export function hasPermission(role: AdminRole, permission: Permission): boolean {
  if (role === "OWNER") return true;
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
}
