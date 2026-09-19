/**
 * Verification Providers Healthcheck & Test Script
 * 
 * Usage:
 *   node scripts/test-verification-providers.js [--email test@example.com] [--phone 08012345678]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Load environment variables manually from .env if present
function loadLocalEnv() {
  const envFiles = [
    path.join(rootDir, '.env'),
    path.join(rootDir, 'apps', 'portal', '.env')
  ];

  const env = { ...process.env };
  for (const file of envFiles) {
    if (fs.existsSync(file)) {
      const lines = fs.readFileSync(file, 'utf8').split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const [k, ...v] = trimmed.split('=');
        if (k && !env[k.trim()]) {
          env[k.trim()] = v.join('=').trim().replace(/(^['"]|['"]$)/g, '');
        }
      }
    }
  }
  return env;
}

const env = loadLocalEnv();

console.log('\n======================================================');
console.log('  NACOS FUTO Verification Providers Configuration');
console.log('======================================================\n');

// 1. Resend Status
const resendKey = env.RESEND_API_KEY;
const resendFrom = env.RESEND_FROM || env.EMAIL_FROM || 'NACOS FUTO <onboarding@resend.dev>';
console.log('✉️  EMAIL VERIFICATION (RESEND):');
console.log('   - Provider: Resend (https://resend.com)');
console.log(`   - Status:   ${resendKey ? '✅ Configured (Key: ' + resendKey.slice(0, 6) + '...)' : '⚠️  Not configured (Will use simulated console logger)'}`);
console.log(`   - Sender:   ${resendFrom}`);

// 2. Termii Status
const termiiKey = env.TERMII_API_KEY;
const termiiSender = env.TERMII_SENDER_ID || 'N-Alert';
const termiiChannel = env.TERMII_CHANNEL || 'dnd';
console.log('\n📱 PHONE VERIFICATION (TERMII):');
console.log('   - Provider: Termii (https://termii.com)');
console.log(`   - Status:   ${termiiKey ? '✅ Configured (Key: ' + termiiKey.slice(0, 6) + '...)' : '⚠️  Not configured (Will use simulated console logger)'}`);
console.log(`   - Sender ID: ${termiiSender}`);
console.log(`   - Route:     ${termiiChannel} (High priority OTP)`);

console.log('\n------------------------------------------------------');
console.log('To supply live credentials:');
console.log('1. Open your root .env or apps/portal/.env file.');
console.log('2. Add:');
console.log('   RESEND_API_KEY=re_your_api_key');
console.log('   TERMII_API_KEY=your_termii_key');
console.log('   TERMII_SENDER_ID=N-Alert (or your approved sender ID)');
console.log('   TERMII_CHANNEL=dnd');
console.log('======================================================\n');
