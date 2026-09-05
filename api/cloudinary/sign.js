import crypto from 'crypto';

/**
 * Vercel Serverless Function: Generates secure Cloudinary upload signature
 * Protects CLOUDINARY_API_SECRET from ever being exposed to the browser.
 */
export default async function handler(req, res) {
  // CORS Headers
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

    if (!cloudName || !apiKey || !apiSecret) {
      return res.status(500).json({
        error: 'Cloudinary server environment variables not configured on server.',
        missing: {
          cloudName: !cloudName,
          apiKey: !apiKey,
          apiSecret: !apiSecret
        }
      });
    }

    const { folder, public_id, tags } = req.body || {};
    const timestamp = Math.round(Date.now() / 1000);

    // Build parameters to sign according to Cloudinary documentation
    // Parameters must be sorted alphabetically by key name
    const paramsToSign = {};
    if (folder) paramsToSign.folder = folder;
    if (public_id) paramsToSign.public_id = public_id;
    if (tags) {
      paramsToSign.tags = Array.isArray(tags) ? tags.join(',') : tags;
    }
    paramsToSign.timestamp = timestamp;

    const sortedKeys = Object.keys(paramsToSign).sort();
    const serializedParams = sortedKeys
      .map((key) => `${key}=${paramsToSign[key]}`)
      .join('&');

    const signature = crypto
      .createHash('sha1')
      .update(serializedParams + apiSecret)
      .digest('hex');

    return res.status(200).json({
      signature,
      timestamp,
      apiKey,
      cloudName,
      folder: paramsToSign.folder,
      public_id: paramsToSign.public_id
    });
  } catch (err) {
    console.error('Failed to generate Cloudinary signature:', err);
    return res.status(500).json({ error: 'Internal server error while generating signature.' });
  }
}
