import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const websiteDist = path.join(rootDir, 'apps', 'website', 'dist');
const portalDist = path.join(rootDir, 'apps', 'portal', 'dist');
const targetDist = path.join(rootDir, 'dist');
const targetPortalDist = path.join(targetDist, 'portal');
const targetAssetsDist = path.join(targetDist, 'assets');
const portalAssetsDist = path.join(portalDist, 'assets');

console.log('[bundle-dist] Preparing unified root dist directory for production deployment...');

// Clean existing root dist if present
if (fs.existsSync(targetDist)) {
  fs.rmSync(targetDist, { recursive: true, force: true });
}

fs.mkdirSync(targetDist, { recursive: true });

// 1. Copy website dist into root dist
if (fs.existsSync(websiteDist)) {
  console.log('[bundle-dist] Copying apps/website/dist -> dist...');
  fs.cpSync(websiteDist, targetDist, { recursive: true });
} else {
  console.warn('[bundle-dist] Warning: apps/website/dist was not found.');
}

// 2. Copy student portal dist into dist/portal
if (fs.existsSync(portalDist)) {
  console.log('[bundle-dist] Copying apps/portal/dist -> dist/portal...');
  fs.mkdirSync(targetPortalDist, { recursive: true });
  fs.cpSync(portalDist, targetPortalDist, { recursive: true });

  // 3. Also copy portal assets into dist/assets as safeguard against root asset requests
  if (fs.existsSync(portalAssetsDist)) {
    console.log('[bundle-dist] Mirroring portal assets into dist/assets...');
    fs.mkdirSync(targetAssetsDist, { recursive: true });
    fs.cpSync(portalAssetsDist, targetAssetsDist, { recursive: true });
  }

  // 4. Copy portal/index.html to dist/portal.html for cleanUrls / fallback routing
  const portalIndex = path.join(portalDist, 'index.html');
  if (fs.existsSync(portalIndex)) {
    fs.copyFileSync(portalIndex, path.join(targetDist, 'portal.html'));
  }
} else {
  console.warn('[bundle-dist] Warning: apps/portal/dist was not found.');
}

console.log('[bundle-dist] Successfully assembled unified output directory at ./dist');
