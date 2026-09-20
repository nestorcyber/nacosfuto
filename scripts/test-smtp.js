import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dispatchEmail, verifySmtpConnection, getEmailConfig } from '../packages/supabase/src/server/emailDispatcher.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load root .env natively
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
      if (process.env[key] === undefined) {
        process.env[key] = val;
      }
    }
  }
}

async function run() {
  console.log('\n======================================================');
  console.log('       NACOS FUTO - SMTP & EMAIL SERVICE TESTER       ');
  console.log('======================================================\n');

  const config = getEmailConfig();
  console.log('Active Provider Selected:', config.activeProvider.toUpperCase());
  console.log('SMTP Configured:', config.smtp.isConfigured ? 'YES' : 'NO');
  if (config.smtp.isConfigured) {
    console.log(`  - Host: ${config.smtp.host}:${config.smtp.port}`);
    console.log(`  - Secure: ${config.smtp.secure}`);
    console.log(`  - User: ${config.smtp.user}`);
    console.log(`  - From: ${config.smtp.from}`);
  }
  console.log('Resend Configured (Retained):', config.resend.isConfigured ? 'YES' : 'NO');
  if (config.resend.isConfigured) {
    console.log(`  - Resend From: ${config.resend.from}`);
  }

  // Verify SMTP Connection if configured
  if (config.smtp.isConfigured) {
    console.log('\n[1/2] Verifying SMTP Connection...');
    const verification = await verifySmtpConnection();
    if (verification.success) {
      console.log('\x1b[32m✔ ' + verification.message + '\x1b[0m');
    } else {
      console.log('\x1b[31m✖ ' + verification.error + '\x1b[0m');
    }
  }

  // Send a test email if destination provided
  const targetEmail = process.argv[2] || process.env.TEST_EMAIL;
  if (targetEmail) {
    console.log(`\n[2/2] Sending Test Verification Email to: ${targetEmail}...`);
    try {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const res = await dispatchEmail({
        to: targetEmail,
        subject: `[Test] NACOS FUTO Verification Code: ${code}`,
        text: `This is a test verification email from NACOS FUTO.\nYour test code is: ${code}`,
        html: `<h2>NACOS FUTO SMTP Test</h2><p>Your verification code is: <strong>${code}</strong></p>`
      });
      console.log('\x1b[32m✔ Email successfully dispatched!\x1b[0m', res);
    } catch (e) {
      console.error('\x1b[31m✖ Failed to dispatch email:\x1b[0m', e.message);
    }
  } else {
    console.log('\nTip: To send a real test email, pass an address:');
    console.log('  node scripts/test-smtp.js your-email@domain.com\n');
  }
}

run();
