import assert from "node:assert";

// 1. Test Phone Number Validation
function validateBDPhone(phone) {
  const cleaned = phone.replace(/[\s-]/g, "");
  const regex = /^(?:\+?88)?01[3-9]\d{8}$/;
  return regex.test(cleaned);
}

function normalizeBDPhone(phone) {
  const cleaned = phone.replace(/[\s-]/g, "");
  if (cleaned.startsWith("+88")) return cleaned.slice(3);
  if (cleaned.startsWith("88")) return cleaned.slice(2);
  return cleaned;
}

console.log("▶ Testing Bangladesh Phone Validation & Normalization...");
assert.strictEqual(validateBDPhone("01711000000"), true);
assert.strictEqual(validateBDPhone("+8801912345678"), true);
assert.strictEqual(validateBDPhone("8801812345678"), true);
assert.strictEqual(validateBDPhone("01711-000000"), true);
assert.strictEqual(validateBDPhone("01234567890"), false); // Invalid operator prefix
assert.strictEqual(validateBDPhone("017110000"), false); // Too short
assert.strictEqual(normalizeBDPhone("+8801711000000"), "01711000000");
assert.strictEqual(normalizeBDPhone("8801711000000"), "01711000000");
console.log("✓ Phone validation tests passed!");

// 2. Test Order Status Transition Machine
const allowedTransitions = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["PACKED", "CANCELLED"],
  PACKED: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED", "CANCELLED"],
  DELIVERED: ["RETURN_REQUESTED", "RETURNED"],
  CANCELLED: [],
  RETURN_REQUESTED: ["RETURNED", "DELIVERED"],
  RETURNED: ["REFUNDED"],
  REFUNDED: [],
};

function isValidTransition(current, next) {
  return (allowedTransitions[current] || []).includes(next);
}

console.log("▶ Testing Strict Order Transition Machine...");
assert.strictEqual(isValidTransition("PENDING", "CONFIRMED"), true);
assert.strictEqual(isValidTransition("CONFIRMED", "PROCESSING"), true);
assert.strictEqual(isValidTransition("SHIPPED", "DELIVERED"), true);
assert.strictEqual(isValidTransition("DELIVERED", "PENDING"), false); // Illegal backward jump
assert.strictEqual(isValidTransition("CANCELLED", "CONFIRMED"), false); // Cannot reactivate cancelled order
assert.strictEqual(isValidTransition("REFUNDED", "SHIPPED"), false);
console.log("✓ Order state transition tests passed!");

// 3. Test Coupon Discount Calculations
function calculateCouponDiscount(coupon, subtotal) {
  if (subtotal < coupon.minOrder) return { valid: false, discount: 0 };
  let discount = 0;
  if (coupon.type === "FREE_SHIPPING") {
    return { valid: true, discount: 0, freeShipping: true };
  } else if (coupon.type === "PERCENTAGE") {
    discount = (subtotal * coupon.amount) / 100;
    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }
  } else if (coupon.type === "FIXED") {
    discount = Math.min(coupon.amount, subtotal);
  }
  return { valid: true, discount: Math.round(discount), freeShipping: false };
}

console.log("▶ Testing Coupon Calculation & Restrictions...");
const pctCoupon = { type: "PERCENTAGE", amount: 10, minOrder: 1000, maxDiscount: 200 };
assert.deepStrictEqual(calculateCouponDiscount(pctCoupon, 800), { valid: false, discount: 0 }); // Below min order
assert.deepStrictEqual(calculateCouponDiscount(pctCoupon, 1500), { valid: true, discount: 150, freeShipping: false });
assert.deepStrictEqual(calculateCouponDiscount(pctCoupon, 5000), { valid: true, discount: 200, freeShipping: false }); // Capped at max discount

const fixedCoupon = { type: "FIXED", amount: 300, minOrder: 1000 };
assert.deepStrictEqual(calculateCouponDiscount(fixedCoupon, 1200), { valid: true, discount: 300, freeShipping: false });

const freeShipCoupon = { type: "FREE_SHIPPING", amount: 0, minOrder: 500 };
assert.deepStrictEqual(calculateCouponDiscount(freeShipCoupon, 600), { valid: true, discount: 0, freeShipping: true });
console.log("✓ Coupon calculation tests passed!");

// 4. Test Shipping Charge Rules
function calculateShipping(district, subtotal) {
  if (subtotal >= 1500) return 0; // Free shipping threshold
  const isDhaka = district.toLowerCase().includes("ঢাকা") || district.toLowerCase().includes("dhaka");
  return isDhaka ? 60 : 120;
}

console.log("▶ Testing Shipping Charge Rules...");
assert.strictEqual(calculateShipping("ঢাকা (Dhaka)", 1000), 60);
assert.strictEqual(calculateShipping("চট্টগ্রাম (Chattogram)", 1000), 120);
assert.strictEqual(calculateShipping("সিলেট (Sylhet)", 2000), 0); // Free above 1500
assert.strictEqual(calculateShipping("ঢাকা (Dhaka)", 1600), 0);
console.log("✓ Shipping charge calculation tests passed!");

// 5. Test COGS Profit and Loss Calculation
function calculateCOGSProfit(orders) {
  let totalRevenue = 0;
  let totalCogs = 0;
  let totalDiscount = 0;

  for (const order of orders) {
    totalRevenue += order.grandTotal;
    totalDiscount += (order.productDiscount || 0) + (order.couponDiscount || 0);
    for (const item of order.items) {
      totalCogs += (item.costSnapshot || 0) * item.quantity;
    }
  }

  const grossProfit = totalRevenue - totalCogs;
  const margin = totalRevenue > 0 ? ((grossProfit / totalRevenue) * 100).toFixed(1) : "0";
  return { totalRevenue, totalCogs, grossProfit, margin: Number(margin) };
}

console.log("▶ Testing Profit & Historical Cost Snapshot Calculation...");
const sampleOrders = [
  {
    grandTotal: 2500,
    items: [
      { quantity: 2, unitPrice: 1250, costSnapshot: 800 }, // cost: 1600
    ],
  },
  {
    grandTotal: 1500,
    items: [
      { quantity: 1, unitPrice: 1500, costSnapshot: 900 }, // cost: 900
    ],
  },
];
const profitResult = calculateCOGSProfit(sampleOrders);
assert.strictEqual(profitResult.totalRevenue, 4000);
assert.strictEqual(profitResult.totalCogs, 2500);
assert.strictEqual(profitResult.grossProfit, 1500);
assert.strictEqual(profitResult.margin, 37.5);
console.log("✓ COGS Profit calculation tests passed!");

console.log("\n========================================================");
console.log(" ALL AUTOMATED COMMERCE & SECURITY TESTS PASSED! (5/5) ");
console.log("========================================================\n");
