/**
 * NACOS FUTO: Automated Cloudinary Folder Provisioning & Local Asset Migration Script
 * 
 * 1. Creates all canonical NACOS folders in Cloudinary via Admin API.
 * 2. Uploads local assets to their respective folders:
 *    - Executives -> nacos/executives
 *    - Yellow Pages Flyers -> nacos/yellow_pages
 *    - Events -> nacos/events
 *    - Gallery -> nacos/gallery
 *    - Alumni -> nacos/alumni
 *    - Homepage & Hero -> nacos/homepage
 *    - General Branding -> nacos/general
 * 3. Generates a live manifest mapping in packages/media/src/cloudinaryAssets.json
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Helper to parse env file manually
function parseEnv(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const content = fs.readFileSync(filePath, 'utf-8');
  const env = {};
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^['"]|['"]$/g, '');
      env[key] = val;
    }
  });
  return env;
}

const websiteEnv = parseEnv(path.join(rootDir, 'apps/website/.env'));
const rootEnv = parseEnv(path.join(rootDir, '.env'));
const env = { ...process.env, ...rootEnv, ...websiteEnv };

const cloudName = env.CLOUDINARY_CLOUD_NAME || 'z3wgqisj';
const apiKey = env.CLOUDINARY_API_KEY || '722252495954777';
const apiSecret = env.CLOUDINARY_API_SECRET || 'S8lEKNI2XO6bcGGylYWivj05xUA';

if (!cloudName || !apiKey || !apiSecret) {
  console.error('Missing Cloudinary credentials in .env!');
  process.exit(1);
}

console.log(`\n======================================================`);
console.log(`NACOS FUTO -> Cloudinary Asset Synchronization Engine`);
console.log(`Target Cloud: ${cloudName}`);
console.log(`API Key:      ${apiKey}`);
console.log(`======================================================\n`);

const CANONICAL_FOLDERS = [
  'nacos',
  'nacos/students',
  'nacos/ids',
  'nacos/certificates',
  'nacos/executives',
  'nacos/yellow_pages',
  'nacos/events',
  'nacos/gallery',
  'nacos/alumni',
  'nacos/news',
  'nacos/homepage',
  'nacos/general'
];

/**
 * Step 1: Ensure all canonical folders in Cloudinary
 */
async function ensureFolders() {
  console.log('--- Step 1: Provisioning Canonical Folders in Cloudinary ---');
  const authHeader = 'Basic ' + Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');

  for (const folder of CANONICAL_FOLDERS) {
    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/folders/${encodeURIComponent(folder)}`,
        {
          method: 'POST',
          headers: {
            Authorization: authHeader,
            'Content-Type': 'application/json'
          }
        }
      );

      if (res.ok) {
        console.log(`  [CREATED] /${folder}`);
      } else if (res.status === 409) {
        console.log(`  [EXISTS]  /${folder}`);
      } else {
        const text = await res.text();
        console.log(`  [READY]   /${folder} (status: ${res.status})`);
      }
    } catch (err) {
      console.warn(`  [NOTICE]  /${folder}: ${err.message}`);
    }
  }
}

/**
 * Helper: Sign parameters for Cloudinary Upload API
 */
function generateSignature(paramsToSign, secret) {
  const sorted = Object.keys(paramsToSign)
    .sort()
    .map(k => `${k}=${paramsToSign[k]}`)
    .join('&');
  return crypto.createHash('sha1').update(sorted + secret).digest('hex');
}

/**
 * Upload single local file to Cloudinary
 */
async function uploadFile(localFilePath, folder, customPublicId = null) {
  if (!fs.existsSync(localFilePath)) return null;

  const fileName = path.basename(localFilePath, path.extname(localFilePath));
  const publicId = customPublicId || fileName;
  const timestamp = Math.round(Date.now() / 1000);

  const paramsToSign = {
    folder,
    public_id: publicId,
    timestamp
  };

  const signature = generateSignature(paramsToSign, apiSecret);

  // Read file as base64 data URI
  const fileBuffer = fs.readFileSync(localFilePath);
  const ext = path.extname(localFilePath).toLowerCase();
  const mimeType = ext === '.png' ? 'image/png' : 'image/jpeg';
  const base64Data = `data:${mimeType};base64,` + fileBuffer.toString('base64');

  const formData = new URLSearchParams();
  formData.append('file', base64Data);
  formData.append('api_key', apiKey);
  formData.append('timestamp', timestamp.toString());
  formData.append('signature', signature);
  formData.append('folder', folder);
  formData.append('public_id', publicId);

  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString()
    });

    if (res.ok) {
      const data = await res.json();
      return {
        success: true,
        publicId: data.public_id,
        secureUrl: data.secure_url,
        url: data.url,
        format: data.format,
        bytes: data.bytes,
        width: data.width,
        height: data.height
      };
    } else {
      const err = await res.text();
      return { success: false, error: err };
    }
  } catch (e) {
    return { success: false, error: e.message };
  }
}

/**
 * Step 2: Categorize and Upload Local Assets
 */
async function uploadAllAssets() {
  console.log('\n--- Step 2: Uploading Local Images to Appropriate Cloudinary Folders ---');
  const websiteAssetsDir = path.join(rootDir, 'apps/website/src/assets');
  const executivesDir = path.join(websiteAssetsDir, 'executives');

  const manifest = {
    cloudName,
    syncedAt: new Date().toISOString(),
    assets: {}
  };

  const plan = [];

  // 1. Executives
  if (fs.existsSync(executivesDir)) {
    const execFiles = fs.readdirSync(executivesDir);
    for (const f of execFiles) {
      if (/\.(jpg|jpeg|png|webp)$/i.test(f) && f !== 'grid_debug.jpg') {
        plan.push({
          file: path.join(executivesDir, f),
          folder: 'nacos/executives',
          category: 'executives',
          id: path.basename(f, path.extname(f))
        });
      }
    }
  }

  // 2. Root website assets
  if (fs.existsSync(websiteAssetsDir)) {
    const files = fs.readdirSync(websiteAssetsDir);
    for (const f of files) {
      if (!/\.(jpg|jpeg|png|webp)$/i.test(f)) continue;

      const fullPath = path.join(websiteAssetsDir, f);
      const name = path.basename(f, path.extname(f));

      // Filter category by filename pattern
      if (f.startsWith('flyer_')) {
        plan.push({ file: fullPath, folder: 'nacos/yellow_pages', category: 'yellow_pages', id: name });
      } else if (f.startsWith('event_')) {
        plan.push({ file: fullPath, folder: 'nacos/events', category: 'events', id: name });
      } else if (f.startsWith('gallery_') || f.startsWith('nacos') || f === 'department.jpg' || f === 'research.jpg' || f === 'student-life.jpg') {
        plan.push({ file: fullPath, folder: 'nacos/gallery', category: 'gallery', id: name });
      } else if (f.startsWith('alumni')) {
        plan.push({ file: fullPath, folder: 'nacos/alumni', category: 'alumni', id: name });
      } else if (f.startsWith('header')) {
        plan.push({ file: fullPath, folder: 'nacos/homepage', category: 'homepage', id: name });
      } else if (f.startsWith('full-logo') || f === 'logo.png') {
        plan.push({ file: fullPath, folder: 'nacos/general', category: 'general', id: name });
      }
    }
  }

  console.log(`Found ${plan.length} local images to synchronize.\n`);

  let countSuccess = 0;
  for (let i = 0; i < plan.length; i++) {
    const item = plan[i];
    process.stdout.write(`  [${i + 1}/${plan.length}] Uploading ${path.basename(item.file)} -> ${item.folder}... `);
    const result = await uploadFile(item.file, item.folder, item.id);

    if (result && result.success) {
      countSuccess++;
      console.log('✓ SUCCESS');
      manifest.assets[item.id] = {
        publicId: result.publicId,
        url: result.secureUrl,
        folder: item.folder,
        category: item.category,
        width: result.width,
        height: result.height,
        bytes: result.bytes
      };
    } else {
      console.log(`✗ FAILED: ${result?.error || 'Unknown error'}`);
    }
  }

  // Save manifest
  const outputPath = path.join(rootDir, 'packages/media/src/cloudinaryAssets.json');
  fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2));
  console.log(`\nSuccessfully synchronized ${countSuccess}/${plan.length} images to Cloudinary!`);
  console.log(`Manifest saved to: ${outputPath}\n`);
}

async function run() {
  await ensureFolders();
  await uploadAllAssets();
}

run().catch(console.error);
