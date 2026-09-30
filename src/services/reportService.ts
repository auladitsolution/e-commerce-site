import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import { Customer } from "@/models/Customer";
import { ReturnRequest } from "@/models/ReturnRequest";
import { startOfDay, endOfDay, subDays, format } from "date-fns";

export class ReportService {
  static async getDashboardMetrics() {
    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    const [
      todayOrders,
      todayRevenueAgg,
      pendingOrders,
      processingOrders,
      deliveredOrders,
      cancelledOrders,
      totalCustomers,
      lowStockCount,
      pendingReturns,
    ] = await Promise.all([
      Order.countDocuments({ createdAt: { $gte: todayStart, $lte: todayEnd } }),
      Order.aggregate([
        { $match: { createdAt: { $gte: todayStart, $lte: todayEnd }, orderStatus: { $ne: "CANCELLED" } } },
        { $group: { _id: null, total: { $sum: "$grandTotal" } } },
      ]),
      Order.countDocuments({ orderStatus: "PENDING" }),
      Order.countDocuments({ orderStatus: "PROCESSING" }),
      Order.countDocuments({ orderStatus: "DELIVERED" }),
      Order.countDocuments({ orderStatus: "CANCELLED" }),
      Customer.countDocuments({ active: true }),
      Product.countDocuments({
        active: true,
        $expr: { $lte: ["$stock", "$minimumStock"] },
      }),
      ReturnRequest.countDocuments({ status: "REQUESTED" }),
    ]);

    const todayRevenue = todayRevenueAgg?.[0]?.total || 0;

    // Last 7 days revenue trend
    const last7Days: { date: string; revenue: number; orders: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = subDays(new Date(), i);
      const dayStart = startOfDay(d);
      const dayEnd = endOfDay(d);

      const [ordersCount, revAgg] = await Promise.all([
        Order.countDocuments({ createdAt: { $gte: dayStart, $lte: dayEnd }, orderStatus: { $ne: "CANCELLED" } }),
        Order.aggregate([
          { $match: { createdAt: { $gte: dayStart, $lte: dayEnd }, orderStatus: { $ne: "CANCELLED" } } },
          { $group: { _id: null, total: { $sum: "$grandTotal" } } },
        ]),
      ]);

      last7Days.push({
        date: format(d, "dd MMM"),
        revenue: revAgg?.[0]?.total || 0,
        orders: ordersCount,
      });
    }

    return {
      todayOrders,
      todayRevenue,
      pendingOrders,
      processingOrders,
      deliveredOrders,
      cancelledOrders,
      totalCustomers,
      lowStockCount,
      pendingReturns,
      revenueTrend: last7Days,
    };
  }

  /**
   * Profit Summary Calculation using historical cost snapshots stored in order items
   */
  static async getProfitReport() {
    const orders = await Order.find({ orderStatus: { $in: ["CONFIRMED", "PROCESSING", "PACKED", "SHIPPED", "DELIVERED"] } }).lean();

    let totalRevenue = 0;
    let totalCogs = 0;
    let totalDiscount = 0;

    for (const order of orders) {
      totalRevenue += order.grandTotal;
      totalDiscount += (order.productDiscount || 0) + (order.couponDiscount || 0);

      for (const item of order.items) {
        const itemCost = (item.costSnapshot || 0) * item.quantity;
        totalCogs += itemCost;
      }
    }

    const grossProfit = totalRevenue - totalCogs;
    const profitMargin = totalRevenue > 0 ? ((grossProfit / totalRevenue) * 100).toFixed(1) : 0;

    return {
      totalRevenue,
      totalCogs,
      totalDiscount,
      grossProfit,
      profitMargin: Number(profitMargin),
      totalOrders: orders.length,
    };
  }
}
