import { Request, Response, NextFunction } from 'express';
import { Category } from '../models';
import { createCategorySchema } from '../validators/category.validator';

// GET /api/categories
export async function getCategories(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const categories = await Category.find().sort({ name: 1 }).lean();
    res.json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
}

// GET /api/categories/:slug
export async function getCategoryBySlug(
  req: Request<{ slug: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const category = await Category.findOne({ slug: req.params.slug }).lean();

    if (!category) {
      res.status(404).json({ success: false, error: 'Category not found.' });
      return;
    }

    res.json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
}

// POST /api/categories (admin)
export async function createCategory(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const parsed = createCategorySchema.parse(req.body);
    const category = await Category.create(parsed);
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
}

// PUT /api/categories/:id (admin)
export async function updateCategory(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { updateCategorySchema } = await import('../validators/category.validator');
    const parsed = updateCategorySchema.parse(req.body);
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { $set: parsed },
      { new: true, runValidators: true }
    );
    if (!category) {
      res.status(404).json({ success: false, error: 'Category not found.' });
      return;
    }
    res.json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
}

// DELETE /api/categories/:id (admin)
export async function deleteCategory(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      res.status(404).json({ success: false, error: 'Category not found.' });
      return;
    }
    res.json({ success: true, message: 'Category deleted.' });
  } catch (error) {
    next(error);
  }
}
