import { connectToDatabase } from './lib/mongodb.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('inquiries');

    if (req.method === 'GET') {
      const inquiries = await collection.find({}).sort({ _id: -1 }).toArray();
      const formatted = inquiries.map(item => {
        const { _id, ...rest } = item;
        return { ...rest, mongoId: _id.toString() };
      });
      return res.status(200).json({ success: true, inquiries: formatted });
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const inquiry = body.inquiry || body;

      if (!inquiry || !inquiry.id) {
        return res.status(400).json({ success: false, error: 'Missing inquiry payload' });
      }

      await collection.updateOne(
        { id: inquiry.id },
        { $set: { ...inquiry, updatedAt: new Date().toISOString() }, $setOnInsert: { createdAt: new Date().toISOString() } },
        { upsert: true }
      );

      return res.status(201).json({ success: true, inquiryId: inquiry.id });
    }

    if (req.method === 'PUT' || req.method === 'PATCH') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { id, status } = body;
      await collection.updateOne({ id }, { $set: { status: status || 'RESOLVED', updatedAt: new Date().toISOString() } });
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (error) {
    console.error('MongoDB Inquiries API Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
