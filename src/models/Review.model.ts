import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReview {
  product: mongoose.Types.ObjectId;
  author: string;
  email: string;
  rating: number;
  title?: string;
  body: string;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IReviewDocument extends IReview, Document {}

const reviewSchema = new Schema<IReviewDocument>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    author: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, trim: true },
    body: { type: String, required: true },
    isApproved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

reviewSchema.index({ product: 1 });
reviewSchema.index({ isApproved: 1 });
reviewSchema.index({ product: 1, isApproved: 1 });

export const Review: Model<IReviewDocument> =
  mongoose.model<IReviewDocument>('Review', reviewSchema);
