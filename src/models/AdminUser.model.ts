import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IAdminUser {
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAdminUserDocument extends IAdminUser, Document {
  comparePassword(candidate: string): Promise<boolean>;
}

const adminUserSchema = new Schema<IAdminUserDocument>(
  {
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 8 },
  },
  { timestamps: true }
);

// Hash password before saving
adminUserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

adminUserSchema.methods.comparePassword = async function (
  candidate: string
): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

export const AdminUser: Model<IAdminUserDocument> =
  mongoose.model<IAdminUserDocument>('AdminUser', adminUserSchema);
