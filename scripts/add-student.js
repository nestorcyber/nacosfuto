import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Load .env variables
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

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// 2. Hash password helper (SHA-256 with project salt)
async function hashPassword(password, salt = 'nacos_futo_salt_2026') {
  const crypto = await import('crypto');
  return crypto.createHash('sha256').update(password + salt).digest('hex');
}

async function addStudent() {
  const regNumber = process.argv[2] || '20241450682';
  const surname = process.argv[3] || 'Anyanwu';
  const firstName = process.argv[4] || 'Nestor';
  const middleName = process.argv[5] || 'Ifeanyi';
  const fullName = `${surname} ${firstName} ${middleName}`.trim();
  const email = process.argv[6] || 'nestor.ifeanyi@futo.edu.ng';
  const phone = process.argv[7] || '+234 814 506 8200';
  const admissionYear = parseInt(regNumber.slice(0, 4), 10) || 2024;
  const initialPassword = 'password';

  console.log('\n======================================================');
  console.log('       NACOS FUTO - ADD NEW STUDENT TO DATABASE       ');
  console.log('======================================================\n');
  console.log(`Registration No : ${regNumber}`);
  console.log(`Surname         : ${surname}`);
  console.log(`First Name      : ${firstName}`);
  console.log(`Middle Name     : ${middleName}`);
  console.log(`Full Name       : ${fullName}`);
  console.log(`Email           : ${email}`);
  console.log(`Phone           : ${phone}`);
  console.log(`Admission Year  : ${admissionYear}`);
  console.log(`Initial Password: ${initialPassword}\n`);

  const passwordHash = await hashPassword(initialPassword);

  // 1. Insert into verified_students
  console.log('[1/2] Adding to public.verified_students (Official Roster)...');
  const { data: vsData, error: vsError } = await supabase
    .from('verified_students')
    .upsert([{
      registration_number: regNumber,
      surname,
      first_name: firstName,
      middle_name: middleName,
      last_name: surname,
      full_name: fullName,
      email,
      phone_number: phone,
      department: 'Computer Science',
      faculty: 'School of Information & Communication Tech (SICT)',
      programme: 'B.Tech Computer Science',
      programme_duration: 5,
      admission_year: admissionYear,
      level: '100 Level',
      status: 'active',
      has_registered: false
    }], { onConflict: 'registration_number' })
    .select();

  if (vsError) {
    console.error('❌ Error inserting into verified_students:', vsError.message);
  } else {
    console.log('✔ Successfully added to verified_students!');
  }

  // 2. Insert into profiles (Active login account)
  console.log('\n[2/2] Adding to public.profiles (Active Student Account)...');
  const { data: profData, error: profError } = await supabase
    .from('profiles')
    .upsert([{
      registration_number: regNumber,
      matric_number: regNumber,
      surname,
      first_name: firstName,
      middle_name: middleName,
      last_name: surname,
      full_name: fullName,
      email,
      phone_number: phone,
      department: 'Computer Science',
      faculty: 'School of Information & Communication Tech (SICT)',
      programme: 'B.Tech Computer Science',
      programme_duration: 5,
      admission_year: admissionYear,
      password_hash: passwordHash,
      role: 'Student Member',
      is_active: true
    }], { onConflict: 'registration_number' })
    .select();

  if (profError) {
    console.error('❌ Error inserting into profiles:', profError.message);
  } else {
    console.log('✔ Successfully added to profiles!');
  }

  console.log('\n======================================================');
  console.log('  STUDENT ACCOUNT CREATED SUCCESSFULLY!               ');
  console.log('  Login credentials:                                  ');
  console.log(`    Reg No:   ${regNumber}                            `);
  console.log(`    Password: ${initialPassword}                      `);
  console.log('======================================================\n');
}

addStudent().catch(console.error);
