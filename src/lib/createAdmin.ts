/**
 * One-time script to create the admin user.
 * Run: npm run create-admin
 *
 * Set ADMIN_USERNAME and ADMIN_PASSWORD in your .env before running.
 */
import 'dotenv/config';
import { connectDB } from './db';
import { AdminUser } from '../models/AdminUser.model';
import mongoose from 'mongoose';

async function main() {
  await connectDB();

  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    console.error('❌ ADMIN_USERNAME and ADMIN_PASSWORD must be set in .env');
    process.exit(1);
  }

  const existing = await AdminUser.findOne({ username: username.toLowerCase() });
  if (existing) {
    console.log(`⚠️  Admin user "${username}" already exists. No changes made.`);
    await mongoose.connection.close();
    return;
  }

  await AdminUser.create({ username, password });
  console.log(`✅ Admin user "${username}" created successfully.`);
  console.log(`   Login at: http://localhost:5173/admin/login`);
  await mongoose.connection.close();
}

main().catch((err) => {
  console.error('Failed to create admin:', err);
  process.exit(1);
});
