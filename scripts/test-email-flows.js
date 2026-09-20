import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dispatchEmail } from '../packages/supabase/src/server/emailDispatcher.js';
import { buildVerificationEmailHTML, buildVerificationEmailText, buildPasswordResetEmailHTML, buildPasswordResetEmailText } from '../packages/supabase/src/emailService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
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

async function testEmailFlows() {
  const targetEmail = process.argv[2] || 'neorxpro@gmail.com';
  console.log(`\nTesting Email Dispatch to: ${targetEmail}`);

  // 1. Test Registration Verification Email
  console.log('\n[1/2] Testing Registration Verification Email...');
  const regCode = '839201';
  const regHtml = buildVerificationEmailHTML(regCode, 5);
  const regText = buildVerificationEmailText(regCode, 5);

  const regResult = await dispatchEmail({
    to: targetEmail,
    subject: `NACOS Portal Verification Code: ${regCode}`,
    html: regHtml,
    text: regText
  });
  console.log('Registration Email Result:', regResult);

  // 2. Test Password Reset Email
  console.log('\n[2/2] Testing Password Reset Email...');
  const resetCode = '471928';
  const resetHtml = buildPasswordResetEmailHTML(resetCode, 10, 'Anyanwu Nestor');
  const resetText = buildPasswordResetEmailText(resetCode, 10, 'Anyanwu Nestor');

  const resetResult = await dispatchEmail({
    to: targetEmail,
    subject: `NACOS Portal Password Reset: ${resetCode}`,
    html: resetHtml,
    text: resetText
  });
  console.log('Password Reset Email Result:', resetResult);

  console.log('\n✔ All email dispatches completed successfully!');
}

testEmailFlows().catch(console.error);
