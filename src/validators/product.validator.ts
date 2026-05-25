import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters').trim(),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens only')
    .trim(),
  price: z.number().positive('Price must be greater than 0'),
  salePrice: z.number().positive().optional().nullable(),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  benefits: z.array(z.string().trim()).min(1, 'Provide at least one benefit'),
  ingredients: z.array(z.string().trim()).min(1, 'Provide at least one ingredient'),
  usage: z.string().trim().optional(),
  images: z.array(z.string().url('Each image must be a valid URL')).min(1, 'At least one image is required'),
  stock: z.number().int().min(0).default(0),
  isFeatured: z.boolean().default(false),
  isNewArrival: z.boolean().default(true),
  isBestSeller: z.boolean().default(false),
  category: z.string().min(1, 'Category is required'), // MongoDB ObjectId string
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
