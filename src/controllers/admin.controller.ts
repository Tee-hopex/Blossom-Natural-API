import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { Order } from '../models/Order.model';
import { Product } from '../models/Product.model';
import { Subscriber } from '../models/Subscriber.model';
import { SiteSettings } from '../models/SiteSettings.model';
import { AuthRequest } from '../middleware/auth';

// ── Dashboard Stats ──────────────────────────────────────────────────────
// GET /api/admin/dashboard
export async function getDashboardStats(
  _req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [
      orderStats,
      revenueToday,
      revenueMonth,
      revenueLastMonth,
      revenueTotal,
      lowStock,
      recentOrders,
      subscriberCount,
      totalProducts,
    ] = await Promise.all([
      Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Order.aggregate([
        { $match: { createdAt: { $gte: startOfToday }, status: { $nin: ['cancelled'] } } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: startOfMonth }, status: { $nin: ['cancelled'] } } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: startOfLastMonth, $lt: startOfMonth }, status: { $nin: ['cancelled'] } } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      Order.aggregate([
        { $match: { status: { $nin: ['cancelled'] } } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      Product.find({ stock: { $gt: 0, $lte: 5 } })
        .select('name stock images slug')
        .limit(10)
        .lean(),
      Order.find()
        .sort({ createdAt: -1 })
        .limit(8)
        .select('orderNumber customerName total status createdAt items')
        .lean(),
      Subscriber.countDocuments(),
      Product.countDocuments(),
    ]);

    const statusMap: Record<string, number> = {};
    orderStats.forEach((s: { _id: string; count: number }) => {
      statusMap[s._id] = s.count;
    });

    const thisMonth = revenueMonth[0]?.total ?? 0;
    const lastMonth = revenueLastMonth[0]?.total ?? 0;
    const monthGrowth =
      lastMonth > 0 ? Math.round(((thisMonth - lastMonth) / lastMonth) * 100) : 0;

    res.json({
      success: true,
      data: {
        orders: {
          total: Object.values(statusMap).reduce((a: number, b) => a + b, 0),
          pending: statusMap['pending'] ?? 0,
          confirmed: statusMap['confirmed'] ?? 0,
          processing: statusMap['processing'] ?? 0,
          shipped: statusMap['shipped'] ?? 0,
          delivered: statusMap['delivered'] ?? 0,
          cancelled: statusMap['cancelled'] ?? 0,
        },
        revenue: {
          today: revenueToday[0]?.total ?? 0,
          thisMonth,
          lastMonth,
          total: revenueTotal[0]?.total ?? 0,
          monthGrowth,
        },
        lowStock,
        recentOrders,
        subscriberCount,
        totalProducts,
      },
    });
  } catch (error) {
    next(error);
  }
}

// ── Site Settings ────────────────────────────────────────────────────────
const settingsSchema = z.object({
  bankName: z.string().trim().optional(),
  bankAccountName: z.string().trim().optional(),
  bankAccountNumber: z.string().trim().optional(),
  whatsappNumber: z.string().trim().optional(),
  deliveryFee: z.number().min(0).optional(),
  freeDeliveryThreshold: z.number().min(0).optional(),
});

// GET /api/admin/settings  &  GET /api/settings (public)
export async function getSettings(
  _req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    let settings = await SiteSettings.findOne().lean();
    if (!settings) {
      settings = await SiteSettings.create({
        bankName: process.env.BANK_NAME ?? '',
        bankAccountName: process.env.BANK_ACCOUNT_NAME ?? '',
        bankAccountNumber: process.env.BANK_ACCOUNT_NUMBER ?? '',
        whatsappNumber: process.env.WHATSAPP_NUMBER ?? '',
        deliveryFee: 1500,
        freeDeliveryThreshold: 15000,
      });
    }
    res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
}

// PATCH /api/admin/settings
export async function updateSettings(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const parsed = settingsSchema.parse(req.body);
    const settings = await SiteSettings.findOneAndUpdate(
      {},
      { $set: parsed },
      { new: true, upsert: true }
    );
    res.json({ success: true, data: settings, message: 'Settings updated successfully.' });
  } catch (error) {
    next(error);
  }
}
