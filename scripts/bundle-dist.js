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
} else {
  console.warn('[bundle-dist] Warning: apps/portal/dist was not found.');
}

console.log('[bundle-dist] Successfully assembled unified output directory at ./dist');
