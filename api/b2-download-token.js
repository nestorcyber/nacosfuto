/**
 * @file api/b2-download-token.js
 * Vercel Serverless Function: Generates and caches 24-hour download authorization tokens
 * for secure, authenticated access to private Backblaze B2 buckets without CORS issues.
 */

let cachedToken = null;
let cachedExpiresAt = 0;

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Return cached token if valid (with 5 min safety buffer)
  if (cachedToken && cachedExpiresAt > Date.now() + 300000) {
    return res.status(200).json(cachedToken);
  }

  const keyId = process.env.VITE_B2_KEY_ID || process.env.B2_KEY_ID || '00504e4d4912f750000000001';
  const appKey = process.env.VITE_B2_APPLICATION_KEY || process.env.B2_APPLICATION_KEY || 'K005IgcedfJWsbGIXMn6tQlFhUchfNo';
  const bucketId = process.env.VITE_B2_BUCKET_ID || process.env.B2_BUCKET_ID || '50149e04ad14c911a20f0715';
  const bucketName = process.env.VITE_B2_BUCKET_NAME || process.env.B2_BUCKET_NAME || 'nacos-resources';

  if (!keyId || !appKey) {
    return res.status(500).json({ error: 'B2 credentials missing in environment.' });
  }

  try {
    const rawCreds = `${keyId}:${appKey}`;
    const creds = Buffer.from(rawCreds).toString('base64');

    // 1. Authorize B2 account
    const authRes = await fetch('https://api.backblazeb2.com/b2api/v3/b2_authorize_account', {
      headers: { Authorization: `Basic ${creds}` }
    });

    if (!authRes.ok) {
      const errText = await authRes.text();
      console.error('B2 authorize error:', errText);
      return res.status(500).json({ error: 'Failed to authorize with storage provider.' });
    }

    const auth = await authRes.json();
    const apiUrl = auth.apiInfo?.storageApi?.apiUrl || 'https://api005.backblazeb2.com';
    const downloadUrl = auth.apiInfo?.storageApi?.downloadUrl || 'https://f005.backblazeb2.com';

    // 2. Obtain 24-hour download authorization token
    const dlAuthRes = await fetch(`${apiUrl}/b2api/v3/b2_get_download_authorization`, {
      method: 'POST',
      headers: {
        Authorization: auth.authorizationToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        bucketId: bucketId,
        fileNamePrefix: '', // Allows downloading any file in the bucket
        validDurationInSeconds: 86400 // 24 hours
      })
    });

    if (!dlAuthRes.ok) {
      const errText = await dlAuthRes.text();
      console.error('B2 download auth error:', errText);
      return res.status(500).json({ error: 'Failed to obtain download authorization.' });
    }

    const dlData = await dlAuthRes.json();
    const payload = {
      downloadUrl,
      bucketName,
      authorizationToken: dlData.authorizationToken,
      expiresAt: Date.now() + 23 * 60 * 60 * 1000
    };

    cachedToken = payload;
    cachedExpiresAt = payload.expiresAt;

    return res.status(200).json(payload);
  } catch (err) {
    console.error('B2 token handler error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
