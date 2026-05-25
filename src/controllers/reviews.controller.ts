import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { Review } from '../models/Review.model';
import { Product } from '../models/Product.model';
import { AuthRequest } from '../middleware/auth';

// Recalculate product rating from all approved reviews
async function syncProductRating(productId: string): Promise<void> {
  const approved = await Review.find({ product: productId, isApproved: true });
  const count = approved.length;
  const avg =
    count > 0 ? approved.reduce((sum, r) => sum + r.rating, 0) / count : 0;
  await Product.findByIdAndUpdate(productId, {
    rating: Math.round(avg * 10) / 10,
    reviewCount: count,
  });
}

const createReviewSchema = z.object({
  author: z.string().min(2).trim(),
  email: z.string().email().toLowerCase().trim(),
  rating: z.number().int().min(1).max(5),
  title: z.string().trim().optional(),
  body: z.string().min(10).trim(),
});

// POST /api/reviews/:productId  (public)
export async function submitReview(
  req: Request<{ productId: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const parsed = createReviewSchema.parse(req.body);
    const product = await Product.findById(req.params.productId);
    if (!product) {
      res.status(404).json({ success: false, error: 'Product not found.' });
      return;
    }
    const review = await Review.create({ ...parsed, product: product._id });
    res.status(201).json({
      success: true,
      data: review,
      message: 'Thank you! Your review is pending approval.',
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/reviews/:productId  (public — approved only)
export async function getProductReviews(
  req: Request<{ productId: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const reviews = await Review.find({
      product: req.params.productId,
      isApproved: true,
    })
      .sort({ createdAt: -1 })
      .lean();
    res.json({ success: true, data: reviews });
  } catch (error) {
    next(error);
  }
}

// GET /api/admin/reviews  (admin)
export async function adminGetReviews(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const isApproved = req.query.isApproved === 'true'
      ? true
      : req.query.isApproved === 'false'
      ? false
      : undefined;

    const filter: Record<string, unknown> = {};
    if (isApproved !== undefined) filter.isApproved = isApproved;

    const reviews = await Review.find(filter)
      .populate('product', 'name slug images')
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, data: reviews });
  } catch (error) {
    next(error);
  }
}

// PATCH /api/admin/reviews/:id  (approve / reject)
export async function adminUpdateReview(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { isApproved } = z
      .object({ isApproved: z.boolean() })
      .parse(req.body);

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isApproved },
      { new: true }
    );
    if (!review) {
      res.status(404).json({ success: false, error: 'Review not found.' });
      return;
    }

    await syncProductRating(review.product.toString());

    res.json({
      success: true,
      data: review,
      message: isApproved ? 'Review approved.' : 'Review rejected.',
    });
  } catch (error) {
    next(error);
  }
}

// DELETE /api/admin/reviews/:id
export async function adminDeleteReview(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      res.status(404).json({ success: false, error: 'Review not found.' });
      return;
    }
    await syncProductRating(review.product.toString());
    res.json({ success: true, message: 'Review deleted.' });
  } catch (error) {
    next(error);
  }
}
