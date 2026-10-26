import mongoose from 'mongoose';

let isMongoConnected = false;

// ── In-Memory fallback (used only if MongoDB is unavailable) ──────────
export const inMemoryDb = {
  users: [],
  conversations: [],
  documents: [],
  legalKnowledge: []
};

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  // No URI configured — use in-memory store
  if (!uri || uri.trim() === '' || uri.includes('username:password')) {
    console.log('ℹ️  No MONGODB_URI set. Running with In-Memory Datastore.');
    return false;
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 6000,
      connectTimeoutMS: 6000,
    });

    isMongoConnected = true;
    const dbName = mongoose.connection.db.databaseName;
    console.log(`✅ MongoDB connected — database: "${dbName}"`);
    console.log(`🔗 URI: ${uri.replace(/:\/\/.*@/, '://<credentials>@')}`);
    return true;

  } catch (err) {
    console.warn('⚠️  MongoDB connection failed:', err.message);
    console.log('ℹ️  Switching to In-Memory Datastore.');
    isMongoConnected = false;
    return false;
  }
}

export function isConnected() {
  return isMongoConnected && mongoose.connection.readyState === 1;
}
