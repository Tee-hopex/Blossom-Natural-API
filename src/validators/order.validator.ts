import { z } from 'zod';

const orderItemSchema = z.object({
  product: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
});

export const createOrderSchema = z.object({
  // Customer
  customerName: z.string().min(2, 'Full name is required').trim(),
  customerEmail: z.string().email('Enter a valid email address').toLowerCase().trim(),
  customerPhone: z
    .string()
    .min(10, 'Enter a valid phone number')
    .regex(/^[0-9+\s()-]+$/, 'Invalid phone number format')
    .trim(),
  // Shipping
  address: z.string().min(5, 'Enter your full address').trim(),
  city: z.string().min(2, 'City is required').trim(),
  state: z.string().min(2, 'State is required').trim(),
  // Items
  items: z
    .array(orderItemSchema)
    .min(1, 'Your cart is empty'),
  // Meta
  notes: z.string().trim().optional(),
  consultationRequest: z.boolean().default(false),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
