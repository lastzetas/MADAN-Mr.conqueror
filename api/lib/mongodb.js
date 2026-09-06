import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://lastzetas_db_user:0GiCoD9DNehZYhZj@cluster0.x5vmife.mongodb.net/madan_conqueror?retryWrites=true&w=majority';
const MONGODB_DB = process.env.MONGODB_DB || 'madan_conqueror';

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(MONGODB_URI, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
  });

  await client.connect();
  const db = client.db(MONGODB_DB);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

export default connectToDatabase;
