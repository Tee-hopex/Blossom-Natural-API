import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct {
  name: string;
  slug: string;
  price: number;
  salePrice?: number;
  description: string;
  benefits: string[];
  ingredients: string[];
  usage?: string;
  images: string[];
  stock: number;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  rating: number;
  reviewCount: number;
  category: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProductDocument extends IProduct, Document {}

const productSchema = new Schema<IProductDocument>(
  {
    name: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    price: { type: Number, required: true, min: 0 },
    salePrice: { type: Number, min: 0, default: null },
    description: { type: String, required: true },
    benefits: [{ type: String }],
    ingredients: [{ type: String }],
    usage: { type: String },
    images: [{ type: String }],
    stock: { type: Number, default: 0, min: 0 },
    isFeatured: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: true },
    isBestSeller: { type: Boolean, default: false },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
  },
  { timestamps: true }
);

productSchema.index({ slug: 1 });
productSchema.index({ category: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ isNewArrival: 1 });
productSchema.index({ isBestSeller: 1 });
productSchema.index({ price: 1 });
productSchema.index({ name: 'text', description: 'text' }); // full-text search

export const Product: Model<IProductDocument> =
  mongoose.model<IProductDocument>('Product', productSchema);
