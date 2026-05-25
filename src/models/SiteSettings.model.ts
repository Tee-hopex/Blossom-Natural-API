import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISiteSettings {
  bankName: string;
  bankAccountName: string;
  bankAccountNumber: string;
  whatsappNumber: string;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  updatedAt: Date;
}

export interface ISiteSettingsDocument extends ISiteSettings, Document {}

const siteSettingsSchema = new Schema<ISiteSettingsDocument>(
  {
    bankName: { type: String, default: '' },
    bankAccountName: { type: String, default: '' },
    bankAccountNumber: { type: String, default: '' },
    whatsappNumber: { type: String, default: '' },
    deliveryFee: { type: Number, default: 1500 },
    freeDeliveryThreshold: { type: Number, default: 15000 },
  },
  { timestamps: true }
);

export const SiteSettings: Model<ISiteSettingsDocument> =
  mongoose.model<ISiteSettingsDocument>('SiteSettings', siteSettingsSchema);
