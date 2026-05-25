import mongoose, { Schema, Document, Model } from 'mongoose';

// ── Order Item (embedded subdocument) ──────────────────────────────────────
export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  name: string;       // snapshot at order time
  image: string;      // snapshot at order time
  price: number;      // snapshot at order time
  quantity: number;
}

const orderItemSchema = new Schema<IOrderItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false } // no separate _id for subdocuments
);

// ── Order Status Enum ────────────────────────────────────────────────────
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

// ── Order ────────────────────────────────────────────────────────────────
export interface IOrder {
  orderNumber: string;
  // Customer
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  // Shipping
  address: string;
  city: string;
  state: string;
  // Items
  items: IOrderItem[];
  // Totals
  subtotal: number;
  deliveryFee: number;
  total: number;
  // Payment
  paymentMethod: string;
  paymentProof?: string;
  // Meta
  status: OrderStatus;
  notes?: string;
  consultationRequest: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderDocument extends IOrder, Document {}

const orderSchema = new Schema<IOrderDocument>(
  {
    orderNumber: { type: String, required: true, unique: true },
    customerName: { type: String, required: true, trim: true },
    customerEmail: { type: String, required: true, lowercase: true, trim: true },
    customerPhone: { type: String, required: true, trim: true },
    address: { type: String, required: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    items: { type: [orderItemSchema], required: true },
    subtotal: { type: Number, required: true, min: 0 },
    deliveryFee: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    paymentMethod: { type: String, default: 'bank_transfer' },
    paymentProof: { type: String },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    notes: { type: String },
    consultationRequest: { type: Boolean, default: false },
  },
  { timestamps: true }
);

orderSchema.index({ orderNumber: 1 });
orderSchema.index({ customerEmail: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

export const Order: Model<IOrderDocument> =
  mongoose.model<IOrderDocument>('Order', orderSchema);
