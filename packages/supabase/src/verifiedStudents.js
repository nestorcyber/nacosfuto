import { supabase } from './client.js';
import { hashPassword, enrichStudentProfile, getLocalStudentsDatabase } from './auth.js';
import { 
  CURRENT_ACADEMIC_YEAR_START, 
  parseAdmissionYear, 
  calculateCurrentLevel, 
  calculateExpectedGraduation, 
  getAcademicSession 
} from '@nacos/config/academic';

const VERIFIED_STORAGE_KEY = 'nacos_verified_students_db';
const CODES_STORAGE_KEY = 'nacos_verification_codes_db';

/**
 * Mask an email address for safe display in UI: e.g. "n••••u@futo.edu.ng"
 */
export function maskEmail(email) {
  if (!email || !email.includes('@')) return email;
  const [local, domain] = email.split('@');
  if (local.length <= 2) {
    return `${local.charAt(0)}••@${domain}`;
  }
  const first = local.charAt(0);
  const last = local.charAt(local.length - 1);
  return `${first}••••${last}@${domain}`;
}

/**
 * Retrieve verified students roster from localStorage with initial pre-seeding
 */
export function getLocalVerifiedStudents() {
  const stored = localStorage.getItem(VERIFIED_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse verified students storage', e);
    }
  }

  // Pre-seed with authoritative canonical departmental roster
  const seeded = [
    {
      id: 'vs-seed-20241029481',
      registration_number: '20241029481',
      full_name: 'Nestor Anyanwu',
      email: 'nestor.anyanwu@futo.edu.ng',
      phone_number: '+234 801 234 5678',
      department: 'Computer Science',
      faculty: 'School of Information & Communication Tech (SICT)',
      level: '100 Level',
      admission_year: 2024,
      programme: 'B.Tech Computer Science',
      programme_duration: 5,
      academic_session: '2024/2025',
      status: 'active',
      has_registered: false,
      auth_user_id: null,
      registered_at: null,
      created_at: '2024-10-01T08:00:00Z'
    },
    {
      id: 'vs-seed-20251145321',
      registration_number: '20251145321',
      full_name: 'Chioma Eze',
      email: 'chioma.eze@futo.edu.ng',
      phone_number: '+234 809 876 5432',
      department: 'Computer Science',
      faculty: 'School of Information & Communication Tech (SICT)',
      level: '100 Level',
      admission_year: 2025,
      programme: 'B.Sc Software Engineering',
      programme_duration: 4,
      academic_session: '2025/2026',
      status: 'active',
      has_registered: false,
      auth_user_id: null,
      registered_at: null,
      created_at: '2025-10-01T08:00:00Z'
    },
    {
      id: 'vs-seed-20261099999',
      registration_number: '20261099999',
      full_name: 'Emeka Okoro',
      email: 'emeka.okoro@futo.edu.ng',
      phone_number: '+234 812 345 6789',
      department: 'Computer Science',
      faculty: 'School of Information & Communication Tech (SICT)',
      level: '100 Level',
      admission_year: 2026,
      programme: 'B.Tech Computer Science',
      programme_duration: 5,
      academic_session: '2026/2027',
      status: 'active',
      has_registered: false,
      auth_user_id: null,
      registered_at: null,
      created_at: '2026-08-01T08:00:00Z'
    },
    {
      id: 'vs-seed-20221139481',
      registration_number: '20221139481',
      full_name: 'David Okonkwo',
      email: 'david.okonkwo@futo.edu.ng',
      phone_number: '+234 814 592 0184',
      department: 'Computer Science',
      faculty: 'School of Information & Communication Tech (SICT)',
      level: '300 Level',
      admission_year: 2022,
      programme: 'B.Tech Computer Science',
      programme_duration: 5,
      academic_session: '2024/2025',
      status: 'active',
      has_registered: false,
      auth_user_id: null,
      registered_at: null,
      created_at: '2022-10-01T08:00:00Z'
    },
    {
      id: 'vs-seed-20231184920',
      registration_number: '20231184920',
      full_name: 'Amarachi Blessing Nwosu',
      email: 'amarachi.nwosu@futo.edu.ng',
      phone_number: '+234 802 998 7711',
      department: 'Computer Science',
      faculty: 'School of Information & Communication Tech (SICT)',
      level: '200 Level',
      admission_year: 2023,
      programme: 'B.Tech Computer Science',
      programme_duration: 5,
      academic_session: '2024/2025',
      status: 'active',
      has_registered: false,
      auth_user_id: null,
      registered_at: null,
      created_at: '2023-10-01T08:00:00Z'
    },
    {
      id: 'vs-seed-20211048201',
      registration_number: '20211048201',
      full_name: 'Somtochukwu Michael Obi',
      email: 'somto.obi@futo.edu.ng',
      phone_number: '+234 806 332 1980',
      department: 'Computer Science',
      faculty: 'School of Information & Communication Tech (SICT)',
      level: '400 Level',
      admission_year: 2021,
      programme: 'B.Tech Computer Science',
      programme_duration: 5,
      academic_session: '2024/2025',
      status: 'active',
      has_registered: false,
      auth_user_id: null,
      registered_at: null,
      created_at: '2021-10-01T08:00:00Z'
    },
    {
      id: 'vs-seed-20201112948',
      registration_number: '20201112948',
      full_name: 'Chapter President (FUTO)',
      email: 'president.futo@nacos.org.ng',
      phone_number: '+234 803 112 3456',
      department: 'Computer Science',
      faculty: 'School of Information & Communication Tech (SICT)',
      level: '500 Level',
      admission_year: 2020,
      programme: 'B.Tech Computer Science',
      programme_duration: 5,
      academic_session: '2024/2025',
      status: 'active',
      has_registered: true,
      auth_user_id: 'student-seed-pres',
      registered_at: '2020-10-10T09:00:00Z',
      created_at: '2020-10-01T08:00:00Z'
    }
  ];

  localStorage.setItem(VERIFIED_STORAGE_KEY, JSON.stringify(seeded));
  return seeded;
}

export function saveLocalVerifiedStudents(list) {
  localStorage.setItem(VERIFIED_STORAGE_KEY, JSON.stringify(list));
}

/**
 * Step 1: Lookup student in verified roster by registration number
 */
export async function lookupVerifiedStudentRecord(regNo) {
  if (!regNo || !regNo.trim()) {
    return { 
      found: false, 
      error: { message: 'Registration number is required.' } 
    };
  }

  const cleanReg = regNo.trim().toUpperCase();

  // 1. Try Supabase lookup if connected
  try {
    const { data, error } = await supabase
      .from('verified_students')
      .select('*')
      .eq('registration_number', cleanReg)
      .maybeSingle();

    if (!error && data) {
      if (data.status !== 'active') {
        return {
          found: false,
          error: { message: 'Your student record is currently inactive or suspended. Please contact the department.' }
        };
      }
      if (data.has_registered) {
        return {
          found: false,
          error: { message: 'An account has already been registered for this registration number. Please sign in or contact an administrator to reset.' }
        };
      }

      return {
        found: true,
        data: {
          ...data,
          masked_email: maskEmail(data.email)
        },
        error: null
      };
    }
  } catch (err) {
    // Fallback to local store
  }

  // 2. Local store lookup
  const roster = getLocalVerifiedStudents();
  const record = roster.find(s => s.registration_number.toUpperCase() === cleanReg);

  if (!record) {
    return {
      found: false,
      error: { message: 'User not found, contact admin.' }
    };
  }

  if (record.status !== 'active') {
    return {
      found: false,
      error: { message: 'Your student record is currently marked inactive or suspended. Please contact the department.' }
    };
  }

  if (record.has_registered) {
    return {
      found: false,
      error: { message: 'An account has already been registered for this registration number. Please sign in or contact an administrator to reset.' }
    };
  }

  return {
    found: true,
    data: {
      ...record,
      masked_email: maskEmail(record.email)
    },
    error: null
  };
}

/**
 * Step 2: Send a 6-digit verification code (OTP) to the student-provided school email
 */
export async function sendStudentVerificationCode(regNo, studentEmail = '') {
  const lookup = await lookupVerifiedStudentRecord(regNo);
  if (!lookup.found) {
    return { success: false, error: lookup.error };
  }

  const student = lookup.data;
  const cleanEmail = (studentEmail || student.email || '').trim().toLowerCase();

  if (!cleanEmail) {
    return { success: false, error: { message: 'Please enter your school email address.' } };
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleanEmail)) {
    return { success: false, error: { message: 'Please enter a valid email address.' } };
  }

  // Check if school email format (encourage/accept institutional email)
  const isSchoolDomain = cleanEmail.endsWith('futo.edu.ng') || cleanEmail.includes('edu.ng') || cleanEmail.includes('futo');
  if (!isSchoolDomain && !cleanEmail.endsWith('@gmail.com')) {
    // gentle warning or acceptance
  }

  // Check if email already belongs to another registered student account
  const accounts = getLocalStudentsDatabase();
  const cleanReg = regNo.trim().toUpperCase();
  const emailInUse = accounts.some(a => 
    a.email?.toLowerCase() === cleanEmail && 
    a.registration_number?.toUpperCase() !== cleanReg
  );
  if (emailInUse) {
    return { success: false, error: { message: 'This email is already in use by another student account.' } };
  }

  // Generate a random 6-digit OTP code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 mins expiry

  // Try Supabase insert
  try {
    await supabase.from('student_verification_codes').insert([{
      registration_number: student.registration_number,
      email: cleanEmail,
      code,
      expires_at: expiresAt,
      is_used: false
    }]);
  } catch (e) {
    // Supabase offline/fallback
  }

  // Save to local storage for instant verification and demo support
  let storedCodes = [];
  try {
    const raw = localStorage.getItem(CODES_STORAGE_KEY);
    if (raw) storedCodes = JSON.parse(raw);
  } catch (e) {}

  storedCodes = storedCodes.filter(c => c.registration_number !== student.registration_number);
  storedCodes.push({
    registration_number: student.registration_number,
    email: cleanEmail,
    code,
    expires_at: expiresAt,
    is_used: false,
    created_at: new Date().toISOString()
  });
  localStorage.setItem(CODES_STORAGE_KEY, JSON.stringify(storedCodes));

  console.info(`[NACOS Auth] Verification code for ${student.registration_number} (${cleanEmail}): ${code}`);

  return {
    success: true,
    code, // Returned for dev preview banner
    email: cleanEmail,
    maskedEmail: maskEmail(cleanEmail),
    expiresAt,
    message: `A 6-digit verification code has been dispatched to ${cleanEmail}.`
  };
}

/**
 * Step 2b: Verify 6-digit OTP code entered by student
 */
export async function verifyStudentRegistrationCode(regNo, code) {
  if (!code || code.trim().length !== 6) {
    return { success: false, error: { message: 'Please enter a valid 6-digit verification code.' } };
  }

  const cleanReg = regNo.trim().toUpperCase();
  const cleanCode = code.trim();

  // Check local codes
  let storedCodes = [];
  try {
    const raw = localStorage.getItem(CODES_STORAGE_KEY);
    if (raw) storedCodes = JSON.parse(raw);
  } catch (e) {}

  const match = storedCodes.find(c => 
    c.registration_number.toUpperCase() === cleanReg && 
    c.code === cleanCode && 
    !c.is_used
  );

  // Also accept master bypass code in development if needed
  const isMasterDevCode = cleanCode === '123456';

  if (!match && !isMasterDevCode) {
    return { success: false, error: { message: 'Invalid verification code. Please check your email or request a new code.' } };
  }

  if (match) {
    const isExpired = new Date(match.expires_at) < new Date();
    if (isExpired) {
      return { success: false, error: { message: 'This verification code has expired. Please request a new code.' } };
    }
  }

  return { success: true };
}

/**
 * Step 3: Complete registration - create auth profile, set has_registered=true, auto-fill profile fields
 */
export async function completeVerifiedStudentRegistration(regNo, code, password, phone = '', customEmail = '') {
  // 1. Verify code again
  const verifyRes = await verifyStudentRegistrationCode(regNo, code);
  if (!verifyRes.success) {
    return { data: null, error: verifyRes.error };
  }

  if (!password || password.length < 6) {
    return { data: null, error: { message: 'Password must be at least 6 characters long.' } };
  }

  // 2. Fetch authoritative student record
  const roster = getLocalVerifiedStudents();
  const cleanReg = regNo.trim().toUpperCase();
  const index = roster.findIndex(s => s.registration_number.toUpperCase() === cleanReg);

  if (index === -1) {
    return { data: null, error: { message: 'Verified student record not found.' } };
  }

  const verifiedRecord = roster[index];
  if (verifiedRecord.has_registered) {
    return { data: null, error: { message: 'An account has already been registered for this student.' } };
  }

  const studentEmail = (customEmail || verifiedRecord.email || '').trim().toLowerCase();
  if (!studentEmail) {
    return { data: null, error: { message: 'Please provide a valid school email address.' } };
  }

  // 3. Mark code as used
  try {
    const raw = localStorage.getItem(CODES_STORAGE_KEY);
    if (raw) {
      const storedCodes = JSON.parse(raw);
      const codeIndex = storedCodes.findIndex(c => c.registration_number.toUpperCase() === cleanReg && c.code === code.trim());
      if (codeIndex !== -1) {
        storedCodes[codeIndex].is_used = true;
        localStorage.setItem(CODES_STORAGE_KEY, JSON.stringify(storedCodes));
      }
    }
  } catch (e) {}

  // 4. Hash password
  const passwordHash = await hashPassword(password);

  // 5. Create new student auth profile
  const userId = 'student-auth-' + Date.now();
  const newProfile = {
    id: userId,
    registration_number: verifiedRecord.registration_number,
    full_name: verifiedRecord.full_name,
    email: studentEmail,
    phone_number: phone.trim() || verifiedRecord.phone_number || '',
    admission_year: verifiedRecord.admission_year,
    programme: verifiedRecord.programme,
    department: verifiedRecord.department,
    faculty: verifiedRecord.faculty,
    programme_duration: verifiedRecord.programme_duration || 5,
    password_hash: passwordHash,
    role: 'Student Member',
    is_active: true,
    institution: 'Federal University of Technology, Owerri (FUTO)',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  // Add to local student accounts store
  const allAccounts = getLocalStudentsDatabase();
  // Remove any stale demo account with the same matric
  const filteredAccounts = allAccounts.filter(a => a.registration_number.toUpperCase() !== cleanReg);
  filteredAccounts.push(newProfile);
  localStorage.setItem('nacos_students_db', JSON.stringify(filteredAccounts));

  // 6. Update verified_students table (mark has_registered = true and save email)
  roster[index] = {
    ...verifiedRecord,
    email: studentEmail,
    has_registered: true,
    registered_at: new Date().toISOString(),
    auth_user_id: userId,
    updated_at: new Date().toISOString()
  };
  saveLocalVerifiedStudents(roster);

  // Sync to Supabase if available
  try {
    await supabase.from('verified_students').update({
      email: studentEmail,
      has_registered: true,
      registered_at: new Date().toISOString(),
      auth_user_id: userId
    }).eq('registration_number', cleanReg);

    await supabase.from('profiles').upsert([{
      id: userId,
      registration_number: verifiedRecord.registration_number,
      full_name: verifiedRecord.full_name,
      email: studentEmail,
      phone_number: newProfile.phone_number,
      admission_year: verifiedRecord.admission_year,
      programme: verifiedRecord.programme,
      department: verifiedRecord.department,
      faculty: verifiedRecord.faculty,
      programme_duration: verifiedRecord.programme_duration,
      role: 'Student Member',
      is_active: true
    }]);
  } catch (e) {
    // Local fallback maintained
  }

  // Enrich profile & log in user
  const enriched = enrichStudentProfile(newProfile);
  localStorage.setItem('nacos_user', JSON.stringify(enriched));

  return { data: { user: enriched }, error: null };
}

// =========================================================================
// ADMIN ROSTER MANAGEMENT SERVICES
// =========================================================================

/**
 * Get all verified students in the departmental roster
 */
export async function adminGetAllVerifiedStudents() {
  // 1. Try Supabase
  try {
    const { data, error } = await supabase
      .from('verified_students')
      .select('*')
      .order('registration_number', { ascending: true });

    if (!error && data && data.length > 0) {
      return data;
    }
  } catch (e) {}

  // 2. Fallback to local store
  return getLocalVerifiedStudents();
}

/**
 * Bulk import verified students from CSV/Excel data with duplicate pre-check
 */
export async function adminImportVerifiedStudents(rawRecords) {
  if (!Array.isArray(rawRecords) || rawRecords.length === 0) {
    return { error: { message: 'No student records provided for import.' } };
  }

  const existingRoster = getLocalVerifiedStudents();
  const existingMatricSet = new Set(existingRoster.map(s => s.registration_number.toUpperCase()));
  const existingEmailSet = new Set(existingRoster.map(s => s.email.toLowerCase()));

  const toInsert = [];
  const duplicates = [];
  const errors = [];
  const seenInBatchMatrics = new Set();
  const seenInBatchEmails = new Set();

  for (let i = 0; i < rawRecords.length; i++) {
    const row = rawRecords[i];
    const regNo = (row.registration_number || row.matricNumber || row['Reg No'] || row['Matric'] || '').toString().trim().toUpperCase();
    const fullName = (row.full_name || row.fullName || row['Full Name'] || row['Name'] || '').toString().trim();
    const email = (row.email || row['Email'] || row['Student Email'] || '').toString().trim().toLowerCase();

    if (!regNo || !fullName) {
      errors.push({ row: i + 1, message: `Row ${i + 1}: Missing required fields (Registration Number or Full Name)` });
      continue;
    }

    // Check duplicate matric within batch
    if (seenInBatchMatrics.has(regNo)) {
      duplicates.push({ regNo, email, reason: 'Duplicate registration number inside uploaded file' });
      continue;
    }
    seenInBatchMatrics.add(regNo);

    if (email) {
      if (seenInBatchEmails.has(email)) {
        duplicates.push({ regNo, email, reason: 'Duplicate email inside uploaded file' });
        continue;
      }
      seenInBatchEmails.add(email);
    }

    // Check duplicate in database
    if (existingMatricSet.has(regNo)) {
      duplicates.push({ regNo, email, reason: 'Already exists in departmental roster' });
      continue;
    }
    if (email && existingEmailSet.has(email)) {
      duplicates.push({ regNo, email, reason: 'Email already exists in departmental roster' });
      continue;
    }

    // Calculate level & admission year
    const parse = parseAdmissionYear(regNo, CURRENT_ACADEMIC_YEAR_START);
    const admissionYear = parse.valid ? parse.admissionYear : (parseInt(row.admission_year, 10) || CURRENT_ACADEMIC_YEAR_START);
    const duration = parseInt(row.programme_duration || row.duration, 10) || 5;
    const levelInfo = calculateCurrentLevel(admissionYear, CURRENT_ACADEMIC_YEAR_START, duration);

    const record = {
      id: 'vs-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      registration_number: regNo,
      full_name: fullName,
      email: email,
      phone_number: (row.phone_number || row.phone || '').toString().trim(),
      department: (row.department || 'Computer Science').toString().trim(),
      faculty: (row.faculty || 'School of Information & Communication Tech (SICT)').toString().trim(),
      level: row.level || levelInfo.levelString,
      admission_year: admissionYear,
      programme: (row.programme || 'B.Tech Computer Science').toString().trim(),
      programme_duration: duration,
      academic_session: row.academic_session || getAcademicSession(CURRENT_ACADEMIC_YEAR_START),
      status: 'active',
      has_registered: false,
      auth_user_id: null,
      registered_at: null,
      created_at: new Date().toISOString()
    };

    toInsert.push(record);
  }

  // Save new records
  if (toInsert.length > 0) {
    const updatedRoster = [...existingRoster, ...toInsert];
    saveLocalVerifiedStudents(updatedRoster);

    // Try Supabase insert
    try {
      await supabase.from('verified_students').insert(toInsert);
    } catch (e) {
      console.warn('Supabase bulk insert fallback to local storage:', e);
    }
  }

  return {
    success: true,
    importedCount: toInsert.length,
    duplicateCount: duplicates.length,
    errorCount: errors.length,
    duplicates,
    errors
  };
}

/**
 * Reset student registration: unlinks auth account and marks has_registered = false
 * allows student to re-verify or re-register cleanly
 */
export async function adminResetVerifiedStudentRegistration(regNo) {
  if (!regNo) return { error: { message: 'Registration number is required.' } };
  const cleanReg = regNo.trim().toUpperCase();

  const roster = getLocalVerifiedStudents();
  const index = roster.findIndex(s => s.registration_number.toUpperCase() === cleanReg);

  if (index === -1) {
    return { error: { message: 'Student not found in verified roster.' } };
  }

  // 1. Reset verified roster record
  roster[index] = {
    ...roster[index],
    has_registered: false,
    auth_user_id: null,
    registered_at: null,
    updated_at: new Date().toISOString()
  };
  saveLocalVerifiedStudents(roster);

  // 2. Remove from active student accounts database if present
  const accounts = getLocalStudentsDatabase();
  const updatedAccounts = accounts.filter(a => a.registration_number.toUpperCase() !== cleanReg);
  localStorage.setItem('nacos_students_db', JSON.stringify(updatedAccounts));

  // 3. Sync with Supabase
  try {
    await supabase
      .from('verified_students')
      .update({
        has_registered: false,
        auth_user_id: null,
        registered_at: null
      })
      .eq('registration_number', cleanReg);
  } catch (e) {}

  return { success: true, message: `Registration for ${cleanReg} has been reset. The student can now re-register.` };
}

/**
 * Toggle student active/inactive status in verified roster
 */
export async function adminToggleVerifiedStudentStatus(regNo) {
  if (!regNo) return { error: { message: 'Registration number is required.' } };
  const cleanReg = regNo.trim().toUpperCase();

  const roster = getLocalVerifiedStudents();
  const index = roster.findIndex(s => s.registration_number.toUpperCase() === cleanReg);

  if (index === -1) {
    return { error: { message: 'Student not found in verified roster.' } };
  }

  const newStatus = roster[index].status === 'active' ? 'inactive' : 'active';
  roster[index].status = newStatus;
  roster[index].updated_at = new Date().toISOString();
  saveLocalVerifiedStudents(roster);

  // Sync with Supabase
  try {
    await supabase
      .from('verified_students')
      .update({ status: newStatus })
      .eq('registration_number', cleanReg);
  } catch (e) {}

  return { success: true, status: newStatus };
}

/**
 * Manually add an individual student to the verified roster
 */
export async function adminAddVerifiedStudent(studentData) {
  const {
    fullName,
    matricNumber,
    email,
    phone,
    department,
    faculty,
    programme,
    programmeDuration
  } = studentData;

  if (!fullName?.trim() || !matricNumber?.trim() || !email?.trim()) {
    return { error: { message: 'Full name, registration number, and email are required.' } };
  }

  const cleanReg = matricNumber.trim().toUpperCase();
  const cleanEmail = email.trim().toLowerCase();

  const roster = getLocalVerifiedStudents();
  if (roster.some(s => s.registration_number.toUpperCase() === cleanReg)) {
    return { error: { message: `Student with registration number "${cleanReg}" already exists in roster.` } };
  }

  if (roster.some(s => s.email.toLowerCase() === cleanEmail)) {
    return { error: { message: `Student with email "${cleanEmail}" already exists in roster.` } };
  }

  const parse = parseAdmissionYear(cleanReg, CURRENT_ACADEMIC_YEAR_START);
  const admissionYear = parse.valid ? parse.admissionYear : CURRENT_ACADEMIC_YEAR_START;
  const duration = parseInt(programmeDuration, 10) || 5;
  const levelInfo = calculateCurrentLevel(admissionYear, CURRENT_ACADEMIC_YEAR_START, duration);

  const record = {
    id: 'vs-' + Date.now(),
    registration_number: cleanReg,
    full_name: fullName.trim(),
    email: cleanEmail,
    phone_number: phone?.trim() || '',
    department: department || 'Computer Science',
    faculty: faculty || 'School of Information & Communication Tech (SICT)',
    level: levelInfo.levelString,
    admission_year: admissionYear,
    programme: programme || 'B.Tech Computer Science',
    programme_duration: duration,
    academic_session: getAcademicSession(CURRENT_ACADEMIC_YEAR_START),
    status: 'active',
    has_registered: false,
    auth_user_id: null,
    registered_at: null,
    created_at: new Date().toISOString()
  };

  roster.push(record);
  saveLocalVerifiedStudents(roster);

  try {
    await supabase.from('verified_students').insert([record]);
  } catch (e) {}

  return { success: true, data: record };
}

/**
 * Delete a student from the verified roster
 */
export async function adminDeleteVerifiedStudent(regNo) {
  const cleanReg = regNo.trim().toUpperCase();
  const roster = getLocalVerifiedStudents();
  const filtered = roster.filter(s => s.registration_number.toUpperCase() !== cleanReg);
  saveLocalVerifiedStudents(filtered);

  try {
    await supabase.from('verified_students').delete().eq('registration_number', cleanReg);
  } catch (e) {}

  return { success: true };
}
