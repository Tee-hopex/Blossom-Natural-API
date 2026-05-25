import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICategory {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICategoryDocument extends ICategory, Document {}

const categorySchema = new Schema<ICategoryDocument>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, trim: true },
    image: { type: String },
  },
  { timestamps: true }
);

categorySchema.index({ slug: 1 });

export const Category: Model<ICategoryDocument> =
  mongoose.model<ICategoryDocument>('Category', categorySchema);
