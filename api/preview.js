/**
 * @file api/preview.js
 * Standard B2 Secure Preview Endpoint for NACOS FUTO Resource Hub.
 * 
 * Streams file with 'Content-Disposition: inline' for embedding in iframes,
 * PDF viewers, video players, and image previews without CORS or 401 issues.
 */

const keyId = process.env.VITE_B2_KEY_ID || process.env.B2_KEY_ID || '00504e4d4912f750000000001';
const appKey = process.env.VITE_B2_APPLICATION_KEY || process.env.B2_APPLICATION_KEY || 'K005IgcedfJWsbGIXMn6tQlFhUchfNo';
const bucketName = process.env.VITE_B2_BUCKET_NAME || process.env.B2_BUCKET_NAME || 'nacos-resources';

let cachedAuth = null;

async function getAuth() {
  if (cachedAuth && cachedAuth.expiresAt > Date.now() + 300000) {
    return cachedAuth;
  }

  const creds = Buffer.from(`${keyId}:${appKey}`).toString('base64');
  const res = await fetch('https://api.backblazeb2.com/b2api/v3/b2_authorize_account', {
    headers: { Authorization: `Basic ${creds}` }
  });

  if (!res.ok) {
    throw new Error(`Failed to authorize with B2: ${res.status}`);
  }

  const data = await res.json();
  cachedAuth = {
    downloadUrl: data.apiInfo?.storageApi?.downloadUrl || 'https://f005.backblazeb2.com',
    authorizationToken: data.authorizationToken,
    expiresAt: Date.now() + 23 * 60 * 60 * 1000
  };

  return cachedAuth;
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    return res.status(200).end();
  }

  const storageKey = req.query.key || req.query.storageKey;
  if (!storageKey) {
    return res.status(400).json({ error: 'Missing storage key (?key=...)' });
  }

  const cleanKey = String(storageKey).replace(/^\/+/, '');

  try {
    const auth = await getAuth();
    const b2FileUrl = `${auth.downloadUrl}/file/${bucketName}/${cleanKey}`;

    const b2Res = await fetch(b2FileUrl, {
      headers: {
        Authorization: auth.authorizationToken
      }
    });

    if (!b2Res.ok) {
      return res.status(b2Res.status).json({
        error: `Storage provider returned status ${b2Res.status}`,
        code: b2Res.status === 404 ? 'not_found' : 'storage_error'
      });
    }

    const contentType = b2Res.headers.get('content-type') || 'application/pdf';
    const contentLength = b2Res.headers.get('content-length');

    res.setHeader('Content-Type', contentType);
    if (contentLength) res.setHeader('Content-Length', contentLength);
    res.setHeader('Content-Disposition', 'inline');
    res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
    res.setHeader('Access-Control-Allow-Origin', '*');

    const arrayBuffer = await b2Res.arrayBuffer();
    return res.send(Buffer.from(arrayBuffer));
  } catch (err) {
    console.error('Preview proxy error:', err);
    return res.status(500).json({ error: err.message });
  }
}
