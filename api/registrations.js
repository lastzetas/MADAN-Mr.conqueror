import { connectToDatabase } from './lib/mongodb.js';

export default async function handler(req, res) {
  // Set CORS headers
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
    const collection = db.collection('registrations');

    // 1. GET - Fetch all registrations
    if (req.method === 'GET') {
      const registrations = await collection
        .find({})
        .sort({ _id: -1 })
        .toArray();

      // Clean MongoDB _id to standard string or omit
      const formatted = registrations.map(item => {
        const { _id, ...rest } = item;
        return {
          ...rest,
          mongoId: _id.toString()
        };
      });

      return res.status(200).json({
        success: true,
        count: formatted.length,
        registrations: formatted
      });
    }

    // 2. POST - Insert new squad registration or clear all
    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

      if (body.action === 'CLEAR_ALL') {
        await collection.deleteMany({});
        return res.status(200).json({ success: true, message: 'All registrations cleared from MongoDB' });
      }

      const squad = body.squad || body;
      if (!squad || !squad.id) {
        return res.status(400).json({ success: false, error: 'Missing squad registration payload' });
      }

      // Upsert squad to prevent duplicates
      const result = await collection.updateOne(
        { id: squad.id },
        { 
          $set: { 
            ...squad, 
            updatedAt: new Date().toISOString() 
          },
          $setOnInsert: {
            createdAt: new Date().toISOString()
          }
        },
        { upsert: true }
      );

      return res.status(201).json({
        success: true,
        message: 'Squad registered in MongoDB',
        squadId: squad.id,
        result
      });
    }

    // 3. PUT / PATCH - Update Squad Status (VERIFIED, REJECTED, etc.)
    if (req.method === 'PUT' || req.method === 'PATCH') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { id, status, newStatus } = body;
      const targetStatus = status || newStatus;

      if (!id || !targetStatus) {
        return res.status(400).json({ success: false, error: 'Missing id or status to update' });
      }

      const result = await collection.updateOne(
        { id: id },
        {
          $set: {
            status: targetStatus,
            updatedAt: new Date().toISOString()
          }
        }
      );

      return res.status(200).json({
        success: true,
        message: `Status updated to ${targetStatus}`,
        result
      });
    }

    // 4. DELETE - Remove Squad
    if (req.method === 'DELETE') {
      const id = req.query?.id || (req.body && (typeof req.body === 'string' ? JSON.parse(req.body).id : req.body.id));

      if (!id) {
        return res.status(400).json({ success: false, error: 'Missing squad id for deletion' });
      }

      const result = await collection.deleteOne({ id: id });
      return res.status(200).json({
        success: true,
        message: 'Squad registration deleted from MongoDB',
        result
      });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (error) {
    console.error('MongoDB API Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Database error occurred'
    });
  }
}
