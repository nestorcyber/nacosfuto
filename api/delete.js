/**
 * @file api/delete.js
 * Vercel Serverless Function: Deletes files from Backblaze B2 storage.
 * Safely runs with master/application key credentials on server-side.
 */

let cachedAuth = null;

async function getB2Auth() {
  if (cachedAuth && cachedAuth.expiresAt > Date.now() + 300000) {
    return cachedAuth;
  }

  const keyId = process.env.VITE_B2_KEY_ID || process.env.B2_KEY_ID || '00504e4d4912f750000000001';
  const appKey = process.env.VITE_B2_APPLICATION_KEY || process.env.B2_APPLICATION_KEY || 'K005IgcedfJWsbGIXMn6tQlFhUchfNo';
  const bucketId = process.env.VITE_B2_BUCKET_ID || process.env.B2_BUCKET_ID || '50149e04ad14c911a20f0715';
  const bucketName = process.env.VITE_B2_BUCKET_NAME || process.env.B2_BUCKET_NAME || 'nacos-resources';

  const rawCreds = `${keyId}:${appKey}`;
  const creds = Buffer.from(rawCreds).toString('base64');

  const authRes = await fetch('https://api.backblazeb2.com/b2api/v3/b2_authorize_account', {
    headers: { Authorization: `Basic ${creds}` }
  });

  if (!authRes.ok) {
    throw new Error('Failed to authorize with Backblaze B2');
  }

  const authData = await authRes.json();
  cachedAuth = {
    apiUrl: authData.apiInfo?.storageApi?.apiUrl || 'https://api005.backblazeb2.com',
    downloadUrl: authData.apiInfo?.storageApi?.downloadUrl || 'https://f005.backblazeb2.com',
    bucketName: authData.apiInfo?.storageApi?.bucketName || bucketName,
    bucketId: bucketId,
    authorizationToken: authData.authorizationToken,
    expiresAt: Date.now() + 23 * 60 * 60 * 1000
  };

  return cachedAuth;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    let storageKey = '';
    if (req.body && typeof req.body === 'object') {
      storageKey = req.body.storageKey || req.body.key || '';
    } else if (typeof req.body === 'string') {
      try {
        const parsed = JSON.parse(req.body);
        storageKey = parsed.storageKey || parsed.key || '';
      } catch (_) {}
    }

    if (!storageKey && req.query) {
      storageKey = req.query.storageKey || req.query.key || '';
    }

    const cleanKey = String(storageKey).replace(/^\/+/, '');
    if (!cleanKey) {
      return res.status(400).json({ error: 'Missing storageKey parameter' });
    }

    const auth = await getB2Auth();

    // 1. List file versions matching the storageKey
    const listRes = await fetch(`${auth.apiUrl}/b2api/v3/b2_list_file_versions`, {
      method: 'POST',
      headers: {
        Authorization: auth.authorizationToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        bucketId: auth.bucketId,
        startFileName: cleanKey,
        prefix: cleanKey
      })
    });

    if (!listRes.ok) {
      const errText = await listRes.text();
      throw new Error(`Failed to list file versions from B2: ${errText}`);
    }

    const listData = await listRes.json();
    const matchingFiles = (listData.files || []).filter(f => f.fileName === cleanKey);

    if (matchingFiles.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'File does not exist or already deleted in B2',
        deletedCount: 0
      });
    }

    // 2. Delete all versions of this file
    const deletedVersions = [];
    for (const file of matchingFiles) {
      const delRes = await fetch(`${auth.apiUrl}/b2api/v3/b2_delete_file_version`, {
        method: 'POST',
        headers: {
          Authorization: auth.authorizationToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fileName: file.fileName,
          fileId: file.fileId
        })
      });

      if (delRes.ok) {
        const delData = await delRes.json();
        deletedVersions.push(delData);
      }
    }

    return res.status(200).json({
      success: true,
      message: `Deleted ${deletedVersions.length} version(s) of ${cleanKey}`,
      deletedCount: deletedVersions.length,
      versions: deletedVersions
    });
  } catch (err) {
    console.error('Delete handler error:', err);
    return res.status(500).json({ error: err.message || 'Failed to delete file from B2' });
  }
}
