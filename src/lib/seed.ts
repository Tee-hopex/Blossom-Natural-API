/**
 * Database seed — run with: npm run seed
 * Creates sample categories and products for development.
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from './db';
import { Category, Product } from '../models';

async function seed() {
  await connectDB();

  console.log('🌱 Seeding database...');

  // Clear existing data
  await Promise.all([Category.deleteMany({}), Product.deleteMany({})]);

  // ── Categories ──────────────────────────────────────────────
  const categories = await Category.insertMany([
    {
      name: 'Hair Growth',
      slug: 'hair-growth',
      description: 'Products formulated to stimulate healthy hair growth.',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400',
    },
    {
      name: 'Deep Conditioners',
      slug: 'deep-conditioners',
      description: 'Intensive moisture treatments for textured and curly hair.',
      image: 'https://images.unsplash.com/photo-1607006344380-b6775a0824a7?w=400',
    },
    {
      name: 'Scalp Care',
      slug: 'scalp-care',
      description: 'Nourish your scalp for a healthy foundation.',
      image: 'https://images.unsplash.com/photo-1559181567-c3190ca9be5b?w=400',
    },
    {
      name: 'Leave-In Treatments',
      slug: 'leave-in-treatments',
      description: 'Lightweight daily moisture and detangling.',
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400',
    },
  ]);

  const [hairGrowth, deepCond, scalpCare, leaveIn] = categories;

  // ── Products ─────────────────────────────────────────────────
  await Product.insertMany([
    {
      name: 'Blossom Growth Serum',
      slug: 'blossom-growth-serum',
      price: 8500,
      salePrice: null,
      description:
        'Our bestselling hair growth serum infused with castor oil, rosemary, and biotin. Stimulates dormant follicles and promotes thick, healthy hair growth in as little as 4 weeks.',
      benefits: [
        'Stimulates hair follicles for faster growth',
        'Reduces hair breakage and shedding',
        'Strengthens hair from root to tip',
        'Suitable for all curl types',
      ],
      ingredients: [
        'Jamaican Black Castor Oil',
        'Rosemary Essential Oil',
        'Biotin',
        'Peppermint Oil',
        'Vitamin E',
        'Aloe Vera Extract',
      ],
      usage:
        'Apply 3–5 drops directly to scalp sections. Massage in circular motions for 2 minutes. Use 3x per week for best results.',
      images: [
        'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600',
        'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600',
      ],
      stock: 45,
      isFeatured: true,
      isNewArrival: false,
      isBestSeller: true,
      rating: 4.8,
      reviewCount: 127,
      category: hairGrowth._id,
    },
    {
      name: 'Shea & Honey Deep Mask',
      slug: 'shea-honey-deep-mask',
      price: 6500,
      salePrice: 5800,
      description:
        'A rich, protein-free deep conditioning mask made with raw shea butter, raw honey, and avocado oil. Restores moisture, elasticity, and shine to dry, brittle, or colour-treated hair.',
      benefits: [
        'Intense 48-hour moisture retention',
        'Restores elasticity to brittle strands',
        'Adds brilliant shine without weighing hair down',
        'Safe for colour-treated and chemically relaxed hair',
      ],
      ingredients: [
        'Raw Shea Butter',
        'Raw Honey',
        'Avocado Oil',
        'Argan Oil',
        'Marshmallow Root Extract',
        'Glycerin',
        'Cetyl Alcohol',
      ],
      usage:
        'After shampooing, apply generously from mid-shaft to ends. Cover with a processing cap and leave for 20–30 minutes (or overnight for maximum results). Rinse thoroughly with cool water.',
      images: [
        'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=600',
        'https://images.unsplash.com/photo-1571160035967-4f4dba6a4736?w=600',
      ],
      stock: 30,
      isFeatured: true,
      isNewArrival: false,
      isBestSeller: true,
      rating: 4.9,
      reviewCount: 89,
      category: deepCond._id,
    },
    {
      name: 'Peppermint Scalp Oil',
      slug: 'peppermint-scalp-oil',
      price: 5500,
      salePrice: null,
      description:
        'A lightweight, non-greasy scalp oil that calms irritation, reduces dandruff, and promotes a healthy scalp environment. The cooling sensation of peppermint brings instant relief.',
      benefits: [
        'Soothes dry, itchy, and flaky scalp',
        'Reduces dandruff and product buildup',
        'Improves blood circulation to scalp',
        'Non-greasy and absorbs quickly',
      ],
      ingredients: [
        'Peppermint Essential Oil',
        'Tea Tree Oil',
        'Jojoba Oil',
        'Grapeseed Oil',
        'Lavender Essential Oil',
        'Vitamin E',
      ],
      usage:
        'Part hair into sections and apply 3–4 drops directly onto scalp. Massage for 2–3 minutes. Can be used daily or as needed.',
      images: [
        'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600',
      ],
      stock: 60,
      isFeatured: false,
      isNewArrival: true,
      isBestSeller: false,
      rating: 4.6,
      reviewCount: 41,
      category: scalpCare._id,
    },
    {
      name: 'Aloe & Flaxseed Leave-In',
      slug: 'aloe-flaxseed-leave-in',
      price: 4500,
      salePrice: null,
      description:
        'A light, water-based leave-in conditioner that detangles, defines curls, and seals in moisture without the crunch. Made with aloe vera juice and flaxseed gel.',
      benefits: [
        'Effortless detangling for 4C hair',
        'Defines curls and coils naturally',
        'No white residue, no flaking',
        'Refreshes second and third-day styles',
      ],
      ingredients: [
        'Aloe Vera Juice',
        'Flaxseed Gel',
        'Slippery Elm',
        'Panthenol (Pro-Vitamin B5)',
        'Vegetable Glycerin',
        'Lavender Hydrosol',
      ],
      usage:
        'Apply to freshly washed, damp hair section by section. Smooth from roots to ends. Style as desired. Do not rinse out.',
      images: [
        'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600',
      ],
      stock: 75,
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: false,
      rating: 4.7,
      reviewCount: 33,
      category: leaveIn._id,
    },
  ]);

  console.log(`✅ Seeded ${categories.length} categories and 4 products.`);
  await mongoose.connection.close();
  console.log('👋 Connection closed. Done.');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
