import crypto from 'crypto';

/**
 * Vercel Serverless Function: Deletes Cloudinary media asset safely
 * Protects CLOUDINARY_API_SECRET on server-side.
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. POST required.' });
  }

  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    const { public_id } = req.body || {};
    if (!public_id) {
      return res.status(400).json({ error: 'Missing public_id in request body.' });
    }

    if (!cloudName || !apiKey || !apiSecret) {
      return res.status(200).json({
        result: 'ok',
        note: 'Server environment variables not provided, bypassed remote deletion in dev.'
      });
    }

    const timestamp = Math.round(Date.now() / 1000);
    const serializedParams = `public_id=${public_id}&timestamp=${timestamp}`;
    const signature = crypto
      .createHash('sha1')
      .update(serializedParams + apiSecret)
      .digest('hex');

    const formData = new URLSearchParams();
    formData.append('public_id', public_id);
    formData.append('timestamp', timestamp.toString());
    formData.append('api_key', apiKey);
    formData.append('signature', signature);

    const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
      method: 'POST',
      body: formData
    });

    const cloudData = await cloudRes.json();
    return res.status(cloudRes.ok ? 200 : 400).json(cloudData);
  } catch (err) {
    console.error('Failed to delete Cloudinary asset:', err);
    return res.status(500).json({ error: 'Internal server error while deleting asset.' });
  }
}
