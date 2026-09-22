/**
 * @file api/resource-storage.js
 * Vercel Serverless Function: Backblaze B2 Storage Handler for NACOS FUTO Resource Hub.
 * Handles presigned download and preview tokens without requiring Deno/Supabase CLI deployment.
 */

let cachedAuth = null;
let cachedDlToken = null;

async function getB2AuthTokens() {
  if (cachedAuth && cachedDlToken && cachedDlToken.expiresAt > Date.now() + 300000) {
    return { auth: cachedAuth, dlToken: cachedDlToken };
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
    authorizationToken: authData.authorizationToken
  };

  const dlRes = await fetch(`${cachedAuth.apiUrl}/b2api/v3/b2_get_download_authorization`, {
    method: 'POST',
    headers: {
      Authorization: authData.authorizationToken,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      bucketId: bucketId,
      fileNamePrefix: '',
      validDurationInSeconds: 86400
    })
  });

  if (!dlRes.ok) {
    throw new Error('Failed to obtain download authorization token');
  }

  const dlData = await dlRes.json();
  cachedDlToken = {
    token: dlData.authorizationToken,
    expiresAt: Date.now() + 23 * 60 * 60 * 1000
  };

  return { auth: cachedAuth, dlToken: cachedDlToken };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const body = req.body || (typeof req.query === 'object' ? req.query : {});
    const action = body.action || req.query.action || 'presign-download';
    const storageKey = body.storageKey || req.query.storageKey || '';
    const cleanKey = String(storageKey).replace(/^\/+/, '');

    const { auth, dlToken } = await getB2AuthTokens();

    if (action === 'get-upload-url' || action === 'presign-upload') {
      const upRes = await fetch(`${auth.apiUrl}/b2api/v3/b2_get_upload_url`, {
        method: 'POST',
        headers: {
          Authorization: auth.authorizationToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ bucketId: auth.bucketId })
      });

      if (!upRes.ok) {
        throw new Error('Failed to get B2 upload target URL');
      }

      const upData = await upRes.json();
      return res.status(200).json({
        success: true,
        uploadUrl: upData.uploadUrl,
        authorizationToken: upData.authorizationToken,
        bucket: auth.bucketName,
        storageKey: cleanKey
      });
    }

    if (action === 'presign-download' || action === 'presign-preview' || action === 'get-url') {
      let downloadUrl = `${auth.downloadUrl}/file/${auth.bucketName}/${cleanKey}?Authorization=${dlToken.token}`;
      if (body.downloadFileName) {
        downloadUrl += `&b2ContentDisposition=${encodeURIComponent(`attachment; filename="${body.downloadFileName}"`)}`;
      }

      return res.status(200).json({
        success: true,
        downloadUrl,
        previewUrl: `${auth.downloadUrl}/file/${auth.bucketName}/${cleanKey}?Authorization=${dlToken.token}`,
        authorizationToken: dlToken.token,
        bucket: auth.bucketName,
        storageKey: cleanKey
      });
    }

    if (action === 'delete') {
      // 1. List file versions matching the cleanKey
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
          deletedVersions.push(await delRes.json());
        }
      }

      return res.status(200).json({
        success: true,
        message: `Deleted ${deletedVersions.length} version(s) of ${cleanKey}`,
        deletedCount: deletedVersions.length
      });
    }

    return res.status(200).json({
      success: true,
      authorizationToken: dlToken.token,
      downloadUrl: auth.downloadUrl,
      bucket: auth.bucketName
    });
  } catch (err) {
    console.error('resource-storage API error:', err);
    return res.status(500).json({ error: err.message });
  }
}
