import mongoose from 'mongoose';

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 5000;

export async function connectDB(): Promise<void> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI is not defined in environment variables.');
  }

  let attempt = 0;

  while (attempt < MAX_RETRIES) {
    try {
      await mongoose.connect(uri, {
        dbName: 'blossom_natural',
      });
      console.log('🍃 MongoDB connected successfully.');
      return;
    } catch (error) {
      attempt++;
      console.error(`MongoDB connection failed (attempt ${attempt}/${MAX_RETRIES}):`, error);
      if (attempt < MAX_RETRIES) {
        console.log(`Retrying in ${RETRY_DELAY_MS / 1000}s...`);
        await new Promise((res) => setTimeout(res, RETRY_DELAY_MS));
      }
    }
  }

  throw new Error('Could not connect to MongoDB after multiple retries. Exiting.');
}

// Graceful disconnect on process termination
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed (SIGINT).');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed (SIGTERM).');
  process.exit(0);
});
