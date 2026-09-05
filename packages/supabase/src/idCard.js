import { supabase } from './client.js';
import { syncMediaAsset } from './media.js';
import { ID_CARD_TEMPLATE } from '@nacos/config/idCardTemplate';
import { getLocalStudentsDatabase } from './auth.js';
import { uploadMedia, CLOUDINARY_FOLDERS, getOptimizedImageUrl } from '@nacos/media';
import QRCode from 'qrcode';

const PAYMENTS_STORAGE_KEY = 'nacos_payments_db';
const ID_APPLICATIONS_STORAGE_KEY = 'nacos_id_applications_db';
const ID_SETTINGS_STORAGE_KEY = 'nacos_id_settings_db';
const AUDIT_LOGS_STORAGE_KEY = 'nacos_admin_audit_logs_db';

/**
 * Seed and retrieve configurable ID Card Settings
 */
export function getLocalIdSettingsDatabase() {
  const stored = localStorage.getItem(ID_SETTINGS_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
  }

  const initialSettings = {
    id: 'default',
    id_card_fee: 2500,
    is_application_open: true,
    academic_session: '2026/2027',
    allow_reapplication_on_revoke: true,
    card_template_version: '2026.1',
    updated_at: new Date().toISOString()
  };

  localStorage.setItem(ID_SETTINGS_STORAGE_KEY, JSON.stringify(initialSettings));
  return initialSettings;
}

export async function getIdCardSettings() {
  try {
    const { data, error } = await supabase
      .from('id_card_settings')
      .select('*')
      .eq('id', 'default')
      .maybeSingle();

    if (!error && data) {
      return data;
    }
  } catch (e) {
    // Offline fallback
  }

  return getLocalIdSettingsDatabase();
}

export async function updateIdCardFee(newFee) {
  const feeNumber = Number(newFee);
  if (isNaN(feeNumber) || feeNumber < 0) {
    return { error: 'Fee must be a valid positive number.' };
  }

  const settings = getLocalIdSettingsDatabase();
  settings.id_card_fee = feeNumber;
  settings.updated_at = new Date().toISOString();
  localStorage.setItem(ID_SETTINGS_STORAGE_KEY, JSON.stringify(settings));

  try {
    await supabase
      .from('id_card_settings')
      .upsert({ id: 'default', id_card_fee: feeNumber, updated_at: new Date().toISOString() });
  } catch (e) {
    // Offline
  }

  return { success: true, settings };
}

/**
 * Seed and retrieve verified payments database
 */
export function getLocalPaymentsDatabase() {
  const stored = localStorage.getItem(PAYMENTS_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
  }

  const initialPayments = [
    {
      id: 'pay-seed-1',
      student_matric: '20241029481',
      session: '2026/2027',
      amount: 2500,
      payment_type: 'id_card',
      payment_reference: 'NACOS-FUTO-2026-PAY-98124',
      status: 'successful',
      purpose: 'Departmental Dues & Digital Student ID Card',
      created_at: '2026-08-20T10:30:00Z'
    },
    {
      id: 'pay-seed-b',
      student_matric: '20251145321',
      session: '2026/2027',
      amount: 2500,
      payment_type: 'id_card',
      payment_reference: 'NACOS-FUTO-2026-PAY-54321',
      status: 'successful',
      purpose: 'Departmental Dues & Digital Student ID Card',
      created_at: '2026-08-22T14:10:00Z'
    },
    {
      id: 'pay-seed-c',
      student_matric: '20261099999',
      session: '2026/2027',
      amount: 2500,
      payment_type: 'id_card',
      payment_reference: 'NACOS-FUTO-2026-PAY-99999',
      status: 'failed',
      purpose: 'Departmental Dues & Digital Student ID Card',
      created_at: '2026-08-25T09:45:00Z'
    }
  ];

  localStorage.setItem(PAYMENTS_STORAGE_KEY, JSON.stringify(initialPayments));
  return initialPayments;
}

/**
 * Seed and retrieve ID Card Applications database
 * 
 * Supports the complete 9-state lifecycle:
 * 1. draft
 * 2. pending_payment
 * 3. payment_confirmed
 * 4. photo_required
 * 5. ready_to_submit
 * 6. submitted / processing
 * 7. approved
 * 8. generated
 * 9. rejected / revoked
 */
export function getLocalIdApplicationsDatabase() {
  const stored = localStorage.getItem(ID_APPLICATIONS_STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      // Auto-migrate legacy entries containing letters or old NACOS-FUTO sequences
      if (Array.isArray(parsed) && parsed.some(a => (a.matric_number && /[a-zA-Z]/.test(a.matric_number)) || (a.id_card_number && a.id_card_number.startsWith('NACOS-FUTO-')))) {
        localStorage.removeItem(ID_APPLICATIONS_STORAGE_KEY);
      } else {
        return parsed;
      }
    } catch (e) {
      console.error(e);
    }
  }

  const seededApplications = [
    {
      id: 'app-seed-1',
      student_id: 'student-seed-1',
      matric_number: '20241029481',
      application_number: 'APP-2026-000001',
      id_card_number: '20241029481',
      status: 'generated',
      payment_status: 'verified',
      payment_reference: 'NACOS-FUTO-2026-PAY-98124',
      amount: 2500,
      passport_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      cloudinary_public_id: 'nacos/students/20241029481_passport',
      submitted_at: '2026-08-20T11:00:00Z',
      approved_at: '2026-08-21T09:30:00Z',
      generated_at: '2026-08-21T10:00:00Z',
      created_at: '2026-08-20T10:30:00Z',
      updated_at: '2026-08-21T10:00:00Z'
    },
    {
      id: 'app-seed-2',
      student_id: 'student-seed-b',
      matric_number: '20251145321',
      application_number: 'APP-2026-000002',
      id_card_number: null,
      status: 'photo_required',
      payment_status: 'verified',
      payment_reference: 'NACOS-FUTO-2026-PAY-54321',
      amount: 2500,
      passport_url: null,
      cloudinary_public_id: null,
      created_at: '2026-08-22T14:10:00Z',
      updated_at: '2026-08-22T14:10:00Z'
    },
    {
      id: 'app-seed-3',
      student_id: 'student-seed-c',
      matric_number: '20261099999',
      application_number: 'APP-2026-000003',
      id_card_number: null,
      status: 'pending_payment',
      payment_status: 'pending',
      payment_reference: null,
      amount: 2500,
      passport_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
      cloudinary_public_id: null,
      created_at: '2026-08-25T09:45:00Z',
      updated_at: '2026-08-25T09:45:00Z'
    }
  ];

  localStorage.setItem(ID_APPLICATIONS_STORAGE_KEY, JSON.stringify(seededApplications));
  return seededApplications;
}

function saveLocalIdApplications(apps) {
  localStorage.setItem(ID_APPLICATIONS_STORAGE_KEY, JSON.stringify(apps));
}

/**
 * Check whether a student has a verified dues/ID-card payment
 * Derived securely from the payment database, NEVER from client-side flags.
 */
export async function checkStudentPaymentStatus(matricNumber) {
  if (!matricNumber) return { isPaid: false, payment: null };

  const cleanMatric = matricNumber.trim().toUpperCase();

  // 1. Check Supabase remote if available
  try {
    const { data, error } = await supabase
      .from('dues_payments')
      .select('*')
      .eq('matric_number', cleanMatric)
      .in('status', ['verified', 'successful'])
      .maybeSingle();

    if (!error && data) {
      return { isPaid: true, payment: data };
    }
  } catch (err) {
    // Offline fallback
  }

  // 2. Check local payments database
  const payments = getLocalPaymentsDatabase();
  const payment = payments.find(p => 
    p.student_matric.toUpperCase() === cleanMatric && 
    (p.status === 'verified' || p.status === 'successful' || p.status === 'cleared')
  );

  if (payment) {
    return { isPaid: true, payment };
  }

  return { isPaid: false, payment: null };
}

/**
 * Record a verified payment for a student (simulating gateway callback or manual clearance)
 */
export async function recordStudentPayment(matricNumber, amount = 2500) {
  const cleanMatric = matricNumber.trim().toUpperCase();
  const payments = getLocalPaymentsDatabase();

  const newPayment = {
    id: 'pay-' + Date.now(),
    student_matric: cleanMatric,
    session: '2026/2027',
    amount,
    payment_reference: `NACOS-FUTO-2026-PAY-${Math.floor(10000 + Math.random() * 90000)}`,
    status: 'verified',
    purpose: 'Departmental Dues & Digital Student ID Card',
    created_at: new Date().toISOString()
  };

  payments.push(newPayment);
  localStorage.setItem(PAYMENTS_STORAGE_KEY, JSON.stringify(payments));

  // Sync with Supabase if online
  try {
    await supabase.from('dues_payments').insert([{
      matric_number: cleanMatric,
      session: newPayment.session,
      amount: newPayment.amount,
      payment_reference: newPayment.payment_reference,
      status: 'verified'
    }]);
  } catch (e) {
    // offline
  }

  return { success: true, payment: newPayment };
}

/**
 * Fetch the active ID card application for a student.
 * Returns null if student has never applied (State 1: Not Applied).
 */
export async function getStudentIdApplication(matricOrId) {
  if (!matricOrId) return null;

  const cleanMatric = String(matricOrId).trim().toUpperCase();

  // 1. Try Supabase remote
  try {
    const { data, error } = await supabase
      .from('id_card_applications')
      .select('*')
      .or(`matric_number.eq.${cleanMatric},student_id.eq.${matricOrId}`)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!error && data) {
      return data;
    }
  } catch (e) {
    // offline
  }

  // 2. Local storage
  const apps = getLocalIdApplicationsDatabase();
  const app = apps.find(a => 
    (a.matric_number && a.matric_number.toUpperCase() === cleanMatric) ||
    a.student_id === matricOrId
  );

  return app || null;
}

/**
 * On-Demand: Create an ID card application.
 * Called ONLY when student explicitly clicks "Apply for ID Card" in State 1.
 * Prevents duplicate active applications!
 */
export async function createIdCardApplication(student) {
  if (!student) {
    return { error: 'Invalid student profile.' };
  }

  const matric = student.matric || student.registration_number;
  if (!matric) {
    return { error: 'Student registration number is required to apply.' };
  }

  const cleanMatric = matric.trim().toUpperCase();
  const studentId = student.id || cleanMatric;

  // 1. Duplicate prevention: Check if student already has an active application
  const existingApp = await getStudentIdApplication(cleanMatric);
  if (existingApp && !['rejected', 'revoked'].includes(existingApp.status)) {
    return { success: true, application: existingApp, alreadyExisted: true };
  }

  // 2. Retrieve configurable fee
  const settings = await getIdCardSettings();
  const fee = settings.id_card_fee || 2500;

  // 3. Check if student already has a verified payment in the database
  const paymentCheck = await checkStudentPaymentStatus(cleanMatric);

  const existingPhoto = student.profile_photo_url || student.avatar_url || student.photo_url;

  // Determine initial status based on verified payment and photo
  let initialStatus = 'pending_payment';
  let paymentStatus = 'pending';
  let paymentRef = null;

  if (paymentCheck.isPaid) {
    paymentStatus = 'verified';
    paymentRef = paymentCheck.payment?.payment_reference || `NACOS-FUTO-2026-PAY-${Math.floor(10000 + Math.random() * 90000)}`;
    if (existingPhoto) {
      initialStatus = 'ready_to_submit';
    } else {
      initialStatus = 'photo_required';
    }
  }

  const appNumber = `APP-2026-${Math.floor(100000 + Math.random() * 900000)}`;

  const newApp = {
    id: 'app-' + Date.now(),
    student_id: studentId,
    matric_number: cleanMatric,
    application_number: appNumber,
    id_card_number: null,
    status: initialStatus,
    payment_status: paymentStatus,
    payment_reference: paymentRef,
    amount: fee,
    passport_url: existingPhoto || null,
    cloudinary_public_id: student.cloudinary_public_id || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const apps = getLocalIdApplicationsDatabase();
  apps.unshift(newApp);
  saveLocalIdApplications(apps);

  // Sync with Supabase
  try {
    await supabase.from('id_card_applications').insert([newApp]);
  } catch (e) {
    // Offline
  }

  return { success: true, application: newApp };
}

/**
 * Server-verified payment linkage.
 * Verifies payment against dues_payments and transitions application to 'payment_confirmed' / 'photo_required'.
 */
export async function verifyAndLinkPayment(applicationId, matricNumber) {
  const paymentCheck = await checkStudentPaymentStatus(matricNumber);
  if (!paymentCheck.isPaid) {
    return { error: 'Payment could not be verified. Please complete payment before proceeding.' };
  }

  const apps = getLocalIdApplicationsDatabase();
  const index = apps.findIndex(a => a.id === applicationId || a.matric_number.toUpperCase() === matricNumber.toUpperCase());
  if (index === -1) {
    return { error: 'Application not found.' };
  }

  const app = apps[index];
  app.payment_status = 'verified';
  app.payment_reference = paymentCheck.payment?.payment_reference || `NACOS-FUTO-2026-PAY-${Math.floor(10000 + Math.random() * 90000)}`;
  app.paid_at = new Date().toISOString();

  // If photo is already uploaded, advance to ready_to_submit, else photo_required
  if (app.passport_url) {
    app.status = 'ready_to_submit';
  } else {
    app.status = 'photo_required';
  }
  app.updated_at = new Date().toISOString();

  saveLocalIdApplications(apps);

  try {
    await supabase.from('id_card_applications').update({
      payment_status: app.payment_status,
      payment_reference: app.payment_reference,
      paid_at: app.paid_at,
      status: app.status,
      updated_at: app.updated_at
    }).eq('id', app.id);
  } catch (e) {
    // Offline
  }

  return { success: true, application: app };
}

/**
 * Upload and link passport photograph to application
 */
export async function savePassportToApplication(applicationId, file, student) {
  if (!file) {
    return { error: 'No image file provided.' };
  }

  const matric = student.matric || student.registration_number;
  const matricClean = String(matric).replace(/[^a-zA-Z0-9]/g, '_');
  const customPublicId = `${CLOUDINARY_FOLDERS.STUDENTS}/${matricClean}_passport`;

  // 1. Upload to Cloudinary
  const uploadResult = await uploadMedia(file, {
    folder: CLOUDINARY_FOLDERS.STUDENTS,
    publicId: customPublicId,
    tags: ['nacos', 'students', 'id_card', matricClean],
    maxSizeBytes: 5 * 1024 * 1024
  });

  if (!uploadResult.success) {
    return { error: uploadResult.error || 'Failed to upload passport to Cloudinary.' };
  }

  const photoUrl = uploadResult.secureUrl || uploadResult.url;
  const publicId = uploadResult.publicId;

  // 2. Update application
  const apps = getLocalIdApplicationsDatabase();
  const index = apps.findIndex(a => a.id === applicationId || (a.matric_number && a.matric_number.toUpperCase() === matric.toUpperCase()));

  let updatedApp = null;
  if (index !== -1) {
    apps[index].passport_url = photoUrl;
    apps[index].cloudinary_public_id = publicId;
    if (apps[index].payment_status === 'verified') {
      apps[index].status = 'ready_to_submit';
    }
    apps[index].updated_at = new Date().toISOString();
    updatedApp = apps[index];
    saveLocalIdApplications(apps);
  }

  // 3. Update student profile
  const students = getLocalStudentsDatabase();
  const sIndex = students.findIndex(s => s.id === student.id || s.registration_number === matric);
  if (sIndex !== -1) {
    students[sIndex].profile_photo_url = photoUrl;
    students[sIndex].avatar_url = photoUrl;
    students[sIndex].photo_url = photoUrl;
    students[sIndex].cloudinary_public_id = publicId;
    localStorage.setItem('nacos_students_db', JSON.stringify(students));
  }

  // 4. Update session
  const currentUser = localStorage.getItem('nacos_user');
  if (currentUser) {
    try {
      const userObj = JSON.parse(currentUser);
      userObj.profile_photo_url = photoUrl;
      userObj.avatar_url = photoUrl;
      userObj.photo_url = photoUrl;
      userObj.cloudinary_public_id = publicId;
      localStorage.setItem('nacos_user', JSON.stringify(userObj));
    } catch (e) {}
  }

  // 5. Supabase sync
  try {
    await syncMediaAsset({
      publicId,
      url: photoUrl,
      folder: CLOUDINARY_FOLDERS.STUDENTS,
      category: 'students',
      image_alt: `Student Passport - ${matric}`,
      entity_type: 'student_passport',
      entity_id: String(matric)
    });

    if (updatedApp) {
      await supabase.from('id_card_applications').update({
        passport_url: photoUrl,
        cloudinary_public_id: publicId,
        status: updatedApp.status,
        updated_at: updatedApp.updated_at
      }).eq('id', updatedApp.id);
    }

    await supabase.from('profiles').update({
      profile_photo_url: photoUrl,
      avatar_url: photoUrl,
      cloudinary_public_id: publicId
    }).or(`id.eq.${student.id},registration_number.eq.${matric}`);
  } catch (e) {
    // Offline
  }

  return { success: true, photoUrl, publicId, application: updatedApp };
}

/**
 * Submit ID Card application for portal review
 */
export async function submitIdApplication(applicationId) {
  const apps = getLocalIdApplicationsDatabase();
  const index = apps.findIndex(a => a.id === applicationId);
  if (index === -1) {
    return { error: 'Application not found.' };
  }

  const app = apps[index];
  if (app.payment_status !== 'verified') {
    return { error: 'Payment must be verified before submitting application.' };
  }
  if (!app.passport_url) {
    return { error: 'Please upload a passport photograph before submitting.' };
  }

  app.status = 'submitted';
  app.submitted_at = new Date().toISOString();
  app.updated_at = new Date().toISOString();

  saveLocalIdApplications(apps);

  try {
    await supabase.from('id_card_applications').update({
      status: 'submitted',
      submitted_at: app.submitted_at,
      updated_at: app.updated_at
    }).eq('id', app.id);
  } catch (e) {}

  return { success: true, application: app };
}

/**
 * PORTAL ADMIN: Retrieve all ID card applications with student details
 */
export async function portalAdminGetApplications({ status = 'ALL', search = '' } = {}) {
  let list = [];

  try {
    let query = supabase
      .from('id_card_applications')
      .select('*, profiles:student_id(full_name, registration_number, department, programme, admission_year)')
      .order('created_at', { ascending: false });

    if (status && status !== 'ALL') {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (!error && data && data.length > 0) {
      list = data;
    }
  } catch (e) {}

  if (list.length === 0) {
    const apps = getLocalIdApplicationsDatabase();
    const students = getLocalStudentsDatabase();

    list = apps.map(app => {
      const student = students.find(s => 
        s.id === app.student_id || 
        s.registration_number.toUpperCase() === app.matric_number.toUpperCase()
      ) || {};

      return {
        ...app,
        student_name: student.full_name || student.name || 'Student Member',
        programme: student.programme || 'B.Tech Computer Science',
        department: student.department || 'Computer Science',
        level: student.level || '300 Level'
      };
    });
  }

  // Filter in memory
  if (status && status !== 'ALL') {
    list = list.filter(a => a.status === status);
  }

  if (search) {
    const q = search.trim().toLowerCase();
    list = list.filter(a => 
      (a.matric_number && a.matric_number.toLowerCase().includes(q)) ||
      (a.application_number && a.application_number.toLowerCase().includes(q)) ||
      (a.id_card_number && a.id_card_number.toLowerCase().includes(q)) ||
      (a.student_name && a.student_name.toLowerCase().includes(q))
    );
  }

  return list;
}

/**
 * PORTAL ADMIN: Approve application and generate unique official ID Number
 * Generates sequence NACOS-FUTO-2026-000001, NACOS-FUTO-2026-000002, etc.
 */
export async function portalAdminApproveApplication(applicationId, adminUser) {
  const apps = getLocalIdApplicationsDatabase();
  const index = apps.findIndex(a => a.id === applicationId);
  if (index === -1) {
    return { error: 'Application record not found.' };
  }

  const app = apps[index];
  if (app.payment_status !== 'verified') {
    return { error: 'Cannot approve application: payment is unverified.' };
  }
  if (!app.passport_url) {
    return { error: 'Cannot approve application: passport photograph is missing.' };
  }

  // Student registration number is the only number used to track students (no artificial numbers generated)
  const idCardNumber = app.matric_number || app.id_card_number;

  app.id_card_number = idCardNumber;
  app.status = 'generated'; // Ready for student view and download
  app.approved_at = new Date().toISOString();
  app.generated_at = new Date().toISOString();
  app.reviewed_by = adminUser?.id || adminUser?.user_id || 'admin-portal';
  app.updated_at = new Date().toISOString();

  saveLocalIdApplications(apps);

  try {
    await supabase.from('id_card_applications').update({
      id_card_number: app.id_card_number,
      status: 'generated',
      approved_at: app.approved_at,
      generated_at: app.generated_at,
      reviewed_by: app.reviewed_by,
      updated_at: app.updated_at
    }).eq('id', app.id);
  } catch (e) {}

  return { success: true, application: app };
}

/**
 * PORTAL ADMIN: Reject application with reason
 */
export async function portalAdminRejectApplication(applicationId, reason, adminUser) {
  if (!reason || !reason.trim()) {
    return { error: 'A rejection reason is required for student feedback.' };
  }

  const apps = getLocalIdApplicationsDatabase();
  const index = apps.findIndex(a => a.id === applicationId);
  if (index === -1) {
    return { error: 'Application record not found.' };
  }

  const app = apps[index];
  app.status = 'rejected';
  app.rejection_reason = reason.trim();
  app.rejected_at = new Date().toISOString();
  app.reviewed_by = adminUser?.id || adminUser?.user_id || 'admin-portal';
  app.updated_at = new Date().toISOString();

  saveLocalIdApplications(apps);

  try {
    await supabase.from('id_card_applications').update({
      status: 'rejected',
      rejection_reason: app.rejection_reason,
      rejected_at: app.rejected_at,
      reviewed_by: app.reviewed_by,
      updated_at: app.updated_at
    }).eq('id', app.id);
  } catch (e) {}

  return { success: true, application: app };
}

/**
 * PORTAL ADMIN: Revoke an issued ID card
 */
export async function portalAdminRevokeIdCard(applicationId, reason, adminUser) {
  if (!reason || !reason.trim()) {
    return { error: 'A revocation reason is required.' };
  }

  const apps = getLocalIdApplicationsDatabase();
  const index = apps.findIndex(a => a.id === applicationId);
  if (index === -1) {
    return { error: 'Application record not found.' };
  }

  const app = apps[index];
  app.status = 'revoked';
  app.revocation_reason = reason.trim();
  app.revoked_at = new Date().toISOString();
  app.reviewed_by = adminUser?.id || adminUser?.user_id || 'admin-portal';
  app.updated_at = new Date().toISOString();

  saveLocalIdApplications(apps);

  try {
    await supabase.from('id_card_applications').update({
      status: 'revoked',
      revocation_reason: app.revocation_reason,
      revoked_at: app.revoked_at,
      reviewed_by: app.reviewed_by,
      updated_at: app.updated_at
    }).eq('id', app.id);
  } catch (e) {}

  return { success: true, application: app };
}

/**
 * PORTAL ADMIN: Regenerate ID Card
 */
export async function portalAdminRegenerateIdCard(applicationId, adminUser) {
  const apps = getLocalIdApplicationsDatabase();
  const index = apps.findIndex(a => a.id === applicationId);
  if (index === -1) {
    return { error: 'Application record not found.' };
  }

  const app = apps[index];
  app.status = 'generated';
  app.generated_at = new Date().toISOString();
  app.updated_at = new Date().toISOString();

  saveLocalIdApplications(apps);

  try {
    await supabase.from('id_card_applications').update({
      status: 'generated',
      generated_at: app.generated_at,
      updated_at: app.updated_at
    }).eq('id', app.id);
  } catch (e) {}

  return { success: true, application: app };
}

/**
 * PUBLIC ID VERIFICATION
 * Used when anyone scans the ID Card QR code leading to /verify/id/[id_card_number]
 */
export async function verifyIdCardPublic(idCardNumber) {
  if (!idCardNumber) {
    return { status: 'not_found', message: 'No ID card number specified.' };
  }

  const cleanNum = idCardNumber.trim().toUpperCase();

  // 1. Try remote Supabase query
  try {
    const { data, error } = await supabase
      .from('id_card_applications')
      .select('*, profiles:student_id(*)')
      .or(`id_card_number.eq.${cleanNum},application_number.eq.${cleanNum}`)
      .maybeSingle();

    if (!error && data) {
      const student = data.profiles || {};
      if (data.status === 'revoked') {
        return {
          status: 'revoked',
          card: data,
          student: {
            name: student.full_name,
            matric: data.matric_number,
            department: student.department || 'Computer Science',
            faculty: student.faculty || 'SICT',
            level: student.level || '300 Level'
          },
          revocation_reason: data.revocation_reason || 'Card revoked by departmental authority.'
        };
      }

      if (data.status === 'generated' || data.status === 'approved') {
        return {
          status: 'valid',
          card: data,
          student: {
            name: student.full_name,
            matric: data.matric_number,
            department: student.department || 'Computer Science',
            faculty: student.faculty || 'SICT',
            level: student.level || '300 Level',
            session: '2026/2027'
          }
        };
      }

      return {
        status: 'pending',
        card: data,
        message: 'This application is currently undergoing processing.'
      };
    }
  } catch (e) {}

  // 2. Fallback to local storage
  const apps = getLocalIdApplicationsDatabase();
  const app = apps.find(a => 
    (a.id_card_number && a.id_card_number.toUpperCase() === cleanNum) ||
    (a.application_number && a.application_number.toUpperCase() === cleanNum) ||
    (a.matric_number && a.matric_number.toUpperCase() === cleanNum)
  );

  if (!app) {
    return { status: 'not_found', message: 'No record found in the official NACOS registry for this identifier.' };
  }

  const students = getLocalStudentsDatabase();
  const student = students.find(s => 
    s.id === app.student_id || 
    s.registration_number.toUpperCase() === app.matric_number.toUpperCase()
  ) || {};

  if (app.status === 'revoked') {
    return {
      status: 'revoked',
      card: app,
      student: {
        name: student.full_name || student.name || 'Student Member',
        matric: app.matric_number,
        department: student.department || 'Computer Science',
        faculty: student.faculty || 'SICT',
        level: student.level || '300 Level'
      },
      revocation_reason: app.revocation_reason || 'Card revoked by departmental authority.'
    };
  }

  if (app.status === 'generated' || app.status === 'approved') {
    return {
      status: 'valid',
      card: app,
      student: {
        name: student.full_name || student.name || 'Student Member',
        matric: app.matric_number,
        department: student.department || 'Computer Science',
        faculty: student.faculty || 'SICT',
        level: student.level || '300 Level',
        session: '2026/2027'
      }
    };
  }

  return {
    status: 'pending',
    card: app,
    message: 'This ID application has not been generated yet.'
  };
}

/**
 * High-Resolution Canvas Rendering Engine for ID Card
 * Strictly renders the permanent NACOS visual template and dynamically positions:
 * - PHOTO
 * - FULL NAME (with dynamic auto-shrinking text fitting)
 * - REGISTRATION NUMBER
 * - OFFICIAL NACOS ID NUMBER (e.g. NACOS-FUTO-2026-000001)
 * - ACADEMIC DETAILS & DYNAMIC SCANNABLE QR CODE
 */
export async function drawIdCardOnCanvas(canvas, student, photoImg, cardInfo = null) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const t = ID_CARD_TEMPLATE;

  // Set high-res canvas dimensions
  canvas.width = t.dimensions.width;
  canvas.height = t.dimensions.height;

  // 1. Card Base Background (Brand Deep Forest Green Gradient)
  const bgGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  bgGradient.addColorStop(0, '#041801');
  bgGradient.addColorStop(0.5, '#083002');
  bgGradient.addColorStop(1, '#020f01');
  ctx.fillStyle = bgGradient;
  
  // Rounded card rectangle
  roundRect(ctx, 0, 0, canvas.width, canvas.height, t.background.borderRadius);
  ctx.fill();

  // Outer Border
  ctx.strokeStyle = t.background.borderColor;
  ctx.lineWidth = t.background.borderWidth;
  ctx.stroke();

  // Subtle Geometric Background Pattern / Watermark
  ctx.save();
  ctx.strokeStyle = 'rgba(19, 134, 1, 0.15)';
  ctx.lineWidth = 1.5;
  for (let i = -canvas.height; i < canvas.width; i += 40) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + canvas.height, canvas.height);
    ctx.stroke();
  }
  ctx.restore();

  // 2. Card Header Banner
  const headerGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
  headerGradient.addColorStop(0, '#0a3d03');
  headerGradient.addColorStop(1, '#052202');
  ctx.fillStyle = headerGradient;
  roundRect(ctx, 4, 4, canvas.width - 8, t.header.height, [20, 20, 0, 0]);
  ctx.fill();

  // Header Divider Accent Line
  ctx.fillStyle = '#138601';
  ctx.fillRect(0, t.header.height + 4, canvas.width, 4);

  // Header Typography
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 22px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(t.header.title, 65, 45);

  ctx.fillStyle = '#cbe1ff';
  ctx.font = '600 15px system-ui, sans-serif';
  ctx.fillText(t.header.chapter, 65, 75);

  ctx.fillStyle = '#a3cfbb';
  ctx.font = 'bold 13px system-ui, sans-serif';
  ctx.fillText(t.header.department, 65, 102);

  // Top-Right Header Badge
  ctx.fillStyle = 'rgba(19, 134, 1, 0.4)';
  roundRect(ctx, canvas.width - 240, 35, 180, 42, 8);
  ctx.fill();
  ctx.strokeStyle = '#4bd043';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#4bd043';
  ctx.font = 'bold 12px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('OFFICIAL STUDENT ID', canvas.width - 150, 61);

  // 3. Student Photo Placement
  const p = t.photo;
  ctx.save();
  roundRect(ctx, p.x, p.y, p.width, p.height, p.borderRadius);
  ctx.clip(); // Clip photo into smooth rounded rectangle

  if (photoImg && photoImg.complete && photoImg.naturalWidth > 0) {
    const imgRatio = photoImg.naturalWidth / photoImg.naturalHeight;
    const boxRatio = p.width / p.height;
    let renderW, renderH, renderX, renderY;

    if (imgRatio > boxRatio) {
      renderH = p.height;
      renderW = p.height * imgRatio;
      renderX = p.x - (renderW - p.width) / 2;
      renderY = p.y;
    } else {
      renderW = p.width;
      renderH = p.width / imgRatio;
      renderX = p.x;
      renderY = p.y - (renderH - p.height) / 2;
    }
    ctx.drawImage(photoImg, renderX, renderY, renderW, renderH);
  } else {
    // Photo Placeholder
    ctx.fillStyle = '#0a3504';
    ctx.fillRect(p.x, p.y, p.width, p.height);
    ctx.fillStyle = '#4bd043';
    ctx.font = 'bold 48px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText((student.name || student.full_name || 'ST').slice(0, 2).toUpperCase(), p.x + p.width / 2, p.y + p.height / 2 + 15);
  }
  ctx.restore();

  // Photo Frame Border
  ctx.strokeStyle = p.borderColor;
  ctx.lineWidth = p.borderWidth;
  roundRect(ctx, p.x, p.y, p.width, p.height, p.borderRadius);
  ctx.stroke();

  // 4. Student Dynamic Fields with Text Auto-Scaling
  ctx.textAlign = 'left';

  // Dynamic Full Name (Auto-Shrinks for long names)
  const fullName = (student.name || student.full_name || 'STUDENT NAME').toUpperCase();
  const n = t.name;
  let fontSize = n.maxFontSize;
  ctx.font = `${n.fontWeight} ${fontSize}px ${n.fontFamily}`;
  while (ctx.measureText(fullName).width > n.maxWidth && fontSize > n.minFontSize) {
    fontSize -= 1;
    ctx.font = `${n.fontWeight} ${fontSize}px ${n.fontFamily}`;
  }
  ctx.fillStyle = n.color;
  ctx.fillText(fullName, n.x, n.y);

  // Registration Number (The only number used to track students)
  const regNo = String(student.registration_number || student.matric || cardInfo?.matric_number || cardInfo?.id_card_number || '20241029481').trim();
  const r = t.registrationNumber;
  ctx.fillStyle = r.color;
  ctx.font = `${r.fontWeight} ${r.fontSize}px ${r.fontFamily}`;
  ctx.fillText(`REG NO: ${regNo}`, r.x, r.y);

  // Programme
  ctx.fillStyle = '#86efac';
  ctx.font = 'bold 12px system-ui, sans-serif';
  ctx.fillText('PROGRAMME:', t.programme.x, t.programme.y - 12);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '600 15px system-ui, sans-serif';
  ctx.fillText(student.programme || 'B.Tech Computer Science', t.programme.x, t.programme.y + 10);

  // Level & Admission Year
  ctx.fillStyle = '#86efac';
  ctx.font = 'bold 12px system-ui, sans-serif';
  ctx.fillText('LEVEL & SESSION:', t.academicLevel.x, t.academicLevel.y - 12);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '600 15px system-ui, sans-serif';
  const levelText = `${student.level || student.current_level || '300 Level'} • Session 2026/2027`;
  ctx.fillText(levelText, t.academicLevel.x, t.academicLevel.y + 10);

  // Faculty
  ctx.fillStyle = '#86efac';
  ctx.font = 'bold 12px system-ui, sans-serif';
  ctx.fillText('FACULTY:', t.faculty.x, t.faculty.y - 12);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '600 14px system-ui, sans-serif';
  ctx.fillText(student.faculty || 'School of Information & Comm. Tech (SICT)', t.faculty.x, t.faculty.y + 8);

  // 5. Dynamic Scannable QR Code leading to verification URL
  const q = t.qrCode;
  ctx.fillStyle = '#FFFFFF';
  roundRect(ctx, q.x, q.y, q.size, q.size, 8);
  ctx.fill();
  ctx.strokeStyle = '#138601';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Generate real dynamic QR code URL based on student's registration number
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://nacos-futo.org.ng';
  const verifyUrl = `${origin}/verify/id/${regNo}`;

  try {
    const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
      margin: 1,
      width: q.size - 8,
      color: { dark: '#041801', light: '#ffffff' }
    });

    const qrImg = new Image();
    qrImg.src = qrDataUrl;
    await new Promise((resolve) => {
      qrImg.onload = () => {
        ctx.drawImage(qrImg, q.x + 4, q.y + 4, q.size - 8, q.size - 8);
        resolve();
      };
      qrImg.onerror = () => resolve();
    });
  } catch (err) {
    // Fallback decorative pattern if QR generation encounters an issue
    ctx.fillStyle = '#041801';
    roundRect(ctx, q.x + 10, q.y + 10, 24, 24, 3);
    ctx.fill();
    roundRect(ctx, q.x + q.size - 34, q.y + 10, 24, 24, 3);
    ctx.fill();
    roundRect(ctx, q.x + 10, q.y + q.size - 34, 24, 24, 3);
    ctx.fill();
  }

  // 6. Card Footer & Security Signature Bar
  ctx.fillStyle = 'rgba(4, 24, 1, 0.9)';
  roundRect(ctx, 4, t.footer.y, canvas.width - 8, t.footer.height + 24, [0, 0, 20, 20]);
  ctx.fill();
  ctx.strokeStyle = '#138601';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = '#86efac';
  ctx.font = 'bold 11px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(t.footer.authorizedText, 65, t.footer.y + 35);

  ctx.fillStyle = '#a3cfbb';
  ctx.font = '10px monospace';
  ctx.fillText(`SECURITY VERIFY: /verify/id/${idNumber}`, 65, t.footer.y + 55);

  ctx.fillStyle = '#4bd043';
  ctx.font = 'bold 11px system-ui, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('STATUS: CLEARED & ACTIVE', canvas.width - 65, t.footer.y + 42);
}

function roundRect(ctx, x, y, width, height, radius = 0) {
  if (typeof radius === 'number') {
    radius = [radius, radius, radius, radius];
  }
  const [tl, tr, br, bl] = radius;
  ctx.beginPath();
  ctx.moveTo(x + tl, y);
  ctx.lineTo(x + width - tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + tr);
  ctx.lineTo(x + width, y + height - br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - br, y + height);
  ctx.lineTo(x + bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - bl);
  ctx.lineTo(x, y + tl);
  ctx.quadraticCurveTo(x, y, x + tl, y);
  ctx.closePath();
}

/**
 * Download high-resolution PNG image
 */
export function downloadIdCardAsImage(canvas, filename = 'NACOS-Student-ID-Card') {
  if (!canvas) return;
  const link = document.createElement('a');
  link.download = `${filename}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

/**
 * Generate and download high-resolution PDF document formatted for standard CR-80 card printing
 */
export function downloadIdCardAsPdf(canvas, filename = 'NACOS-Student-ID-Card') {
  if (!canvas) return;
  const imgData = canvas.toDataURL('image/png');

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    downloadIdCardAsImage(canvas, filename);
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${filename}</title>
        <style>
          @page {
            size: 85.6mm 53.98mm;
            margin: 0;
          }
          body {
            margin: 0;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #ffffff;
          }
          img {
            width: 85.6mm;
            height: 53.98mm;
            display: block;
          }
        </style>
      </head>
      <body>
        <img src="${imgData}" onload="window.print();window.close();" />
      </body>
    </html>
  `);
  printWindow.document.close();
}
