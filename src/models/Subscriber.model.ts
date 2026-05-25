import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISubscriber {
  email: string;
  createdAt: Date;
}

export interface ISubscriberDocument extends ISubscriber, Document {}

const subscriberSchema = new Schema<ISubscriberDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  { timestamps: true }
);

subscriberSchema.index({ email: 1 });

export const Subscriber: Model<ISubscriberDocument> =
  mongoose.model<ISubscriberDocument>('Subscriber', subscriberSchema);
