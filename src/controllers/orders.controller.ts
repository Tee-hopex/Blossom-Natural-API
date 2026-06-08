import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Order, Product } from '../models';
import { SiteSettings } from '../models/SiteSettings.model';
import { createOrderSchema } from '../validators/order.validator';

// Generate a unique, human-readable order number
function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `BN-${timestamp}-${random}`;
}

// POST /api/orders
export async function placeOrder(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const parsed = createOrderSchema.parse(req.body);

    // Resolve products and check stock
    const productIds = parsed.items.map((item) => item.product);
    const products = await Product.find({ _id: { $in: productIds } })
      .select('_id name price salePrice images stock')
      .session(session);

    const productMap = new Map(products.map((p) => [p._id.toString(), p]));

    // Validate all products exist and are in stock
    for (const item of parsed.items) {
      const product = productMap.get(item.product);
      if (!product) {
        await session.abortTransaction();
        res.status(404).json({
          success: false,
          error: `Product not found: ${item.product}`,
        });
        return;
      }
      if (product.stock < item.quantity) {
        await session.abortTransaction();
        res.status(400).json({
          success: false,
          error: `"${product.name}" only has ${product.stock} units in stock.`,
        });
        return;
      }
    }

    // Build order items (snapshot prices at order time)
    const orderItems = parsed.items.map((item) => {
      const product = productMap.get(item.product)!;
      const price = product.salePrice ?? product.price;
      return {
        product: product._id,
        name: product.name,
        image: product.images[0] ?? '',
        price,
        quantity: item.quantity,
      };
    });

    // Calculate totals
    const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = subtotal >= 15000 ? 0 : 1500; // Free delivery above ₦15,000
    const total = subtotal + deliveryFee;

    // Create order
    const [order] = await Order.create(
      [
        {
          orderNumber: generateOrderNumber(),
          customerName: parsed.customerName,
          customerEmail: parsed.customerEmail,
          customerPhone: parsed.customerPhone,
          address: parsed.address,
          city: parsed.city,
          state: parsed.state,
          items: orderItems,
          subtotal,
          deliveryFee,
          total,
          paymentMethod: 'bank_transfer',
          status: 'pending',
          notes: parsed.notes,
          consultationRequest: parsed.consultationRequest,
        },
      ],
      { session }
    );

    // Decrement stock for each product
    await Promise.all(
      parsed.items.map((item) =>
        Product.findByIdAndUpdate(
          item.product,
          { $inc: { stock: -item.quantity } },
          { session }
        )
      )
    );

    await session.commitTransaction();

    const siteSettings = await SiteSettings.findOne().lean();

    res.status(201).json({
      success: true,
      data: {
        orderNumber: order.orderNumber,
        total: order.total,
        deliveryFee: order.deliveryFee,
        subtotal: order.subtotal,
        status: order.status,
        paymentInstructions: {
          bankName: siteSettings?.bankName ?? process.env.BANK_NAME,
          accountName: siteSettings?.bankAccountName ?? process.env.BANK_ACCOUNT_NAME,
          accountNumber: siteSettings?.bankAccountNumber ?? process.env.BANK_ACCOUNT_NUMBER,
          amount: order.total,
          reference: order.orderNumber,
        },
      },
      message:
        'Order placed successfully! Please complete your bank transfer using the details above.',
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
}

// GET /api/orders/track/:orderNumber (customer order tracking)
export async function getOrderByNumber(
  req: Request<{ orderNumber: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber })
      .select('-__v')
      .lean();

    if (!order) {
      res.status(404).json({ success: false, error: 'Order not found.' });
      return;
    }

    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
}

// GET /api/orders (admin only — add auth guard later)
export async function getOrders(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const page = Math.max(1, parseInt((req.query.page as string) || '1'));
    const limit = Math.min(50, parseInt((req.query.limit as string) || '20'));
    const status = req.query.status as string | undefined;

    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Order.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: orders,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
}

// PATCH /api/orders/:id/status  (admin)
export async function updateOrderStatus(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    const { status } = req.body as { status: string };
    if (!validStatuses.includes(status)) {
      res.status(400).json({ success: false, error: 'Invalid order status.' });
      return;
    }
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) { res.status(404).json({ success: false, error: 'Order not found.' }); return; }
    res.json({ success: true, data: order, message: `Status updated to "${status}".` });
  } catch (error) { next(error); }
}

// PATCH /api/orders/:id/payment  (admin)
export async function markOrderPaid(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { paymentProof } = req.body as { paymentProof?: string };
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: 'confirmed', ...(paymentProof ? { paymentProof } : {}) },
      { new: true }
    );
    if (!order) { res.status(404).json({ success: false, error: 'Order not found.' }); return; }
    res.json({ success: true, data: order, message: 'Payment confirmed. Order set to Confirmed.' });
  } catch (error) { next(error); }
}
