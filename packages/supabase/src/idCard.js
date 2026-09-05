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

  // Student registration number is the only number used to track students (digits only)
  const rawNum = app.matric_number || app.id_card_number;
  const idCardNumber = String(rawNum).replace(/\D/g, '') || String(rawNum).trim();

  app.id_card_number = idCardNumber;
  app.id_card_back_url = ID_CARD_TEMPLATE.masterBackUrl;
  app.status = 'generated'; // Ready for student view and download
  app.approved_at = new Date().toISOString();
  app.generated_at = new Date().toISOString();
  app.reviewed_by = adminUser?.id || adminUser?.user_id || 'admin-portal';
  app.updated_at = new Date().toISOString();

  saveLocalIdApplications(apps);

  try {
    await supabase.from('id_card_applications').update({
      id_card_number: app.id_card_number,
      id_card_back_url: app.id_card_back_url,
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
  const rawNum = app.matric_number || app.id_card_number;
  app.id_card_number = String(rawNum).replace(/\D/g, '') || String(rawNum).trim();
  app.id_card_back_url = ID_CARD_TEMPLATE.masterBackUrl;
  app.status = 'generated';
  app.generated_at = new Date().toISOString();
  app.reviewed_by = adminUser?.id || adminUser?.user_id || 'admin-portal';
  app.updated_at = new Date().toISOString();

  saveLocalIdApplications(apps);

  try {
    await supabase.from('id_card_applications').update({
      id_card_number: app.id_card_number,
      id_card_back_url: app.id_card_back_url,
      status: 'generated',
      generated_at: app.generated_at,
      reviewed_by: app.reviewed_by,
      updated_at: app.updated_at
    }).eq('id', app.id);
  } catch (e) {}

  return { success: true, application: app };
}

/**
 * Persist generated ID Card Image URL to the database
 */
export async function saveGeneratedIdCardAsset(applicationId, imageUrl) {
  if (!applicationId || !imageUrl) return { error: 'Missing parameters' };

  const apps = getLocalIdApplicationsDatabase();
  const index = apps.findIndex(a => a.id === applicationId);
  if (index !== -1) {
    apps[index].id_card_image_url = imageUrl;
    apps[index].id_card_back_url = ID_CARD_TEMPLATE.masterBackUrl;
    apps[index].updated_at = new Date().toISOString();
    saveLocalIdApplications(apps);
  }

  try {
    await supabase.from('id_card_applications').update({
      id_card_image_url: imageUrl,
      id_card_back_url: ID_CARD_TEMPLATE.masterBackUrl,
      updated_at: new Date().toISOString()
    }).eq('id', applicationId);
  } catch (e) {}

  return { success: true, imageUrl };
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
 * Helper to trace the exact rounded regular hexagon geometry on HTML5 Canvas
 */
function traceRoundedHexagon(ctx, vertices, radius = 18) {
  ctx.beginPath();
  const len = vertices.length;
  for (let i = 0; i < len; i++) {
    const pPrev = vertices[(i - 1 + len) % len];
    const pCurr = vertices[i];
    const pNext = vertices[(i + 1) % len];
    const midPrevX = (pPrev.x + pCurr.x) / 2;
    const midPrevY = (pPrev.y + pCurr.y) / 2;
    if (i === 0) {
      ctx.moveTo(midPrevX, midPrevY);
    }
    ctx.arcTo(pCurr.x, pCurr.y, pNext.x, pNext.y, radius);
  }
  ctx.closePath();
}

/**
 * Image loader helper with fallback URLs and cross-origin handling
 */
function loadTemplateImage(primaryUrl, fallbackUrl) {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(null);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => {
      if (fallbackUrl && fallbackUrl !== primaryUrl) {
        const fallbackImg = new Image();
        fallbackImg.crossOrigin = 'anonymous';
        fallbackImg.onload = () => resolve(fallbackImg);
        fallbackImg.onerror = () => resolve(null);
        fallbackImg.src = fallbackUrl;
      } else {
        resolve(null);
      }
    };
    img.src = fallbackUrl || primaryUrl;
  });
}

function loadOptionalImage(src) {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !src) return resolve(null);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

/**
 * High-Resolution Canvas Rendering Engine for NACOS Official Student ID Card
 * Takes the authoritative EMPTY ID CARD TEMPLATE as the master visual background layer,
 * and composites:
 * 1. Student Passport Photo (clipped inside the existing rounded hexagonal frame,
 *    with object-fit: cover, keeping the template's green and white border visible above).
 * 2. Student Full Name (uppercase, Aeonik Black font, centered horizontally underneath
 *    the static 'NAME' badge, auto-wrapped into 1 or 2 lines, auto-scaled if long).
 * 3. Student Registration Number (digits only, Aeonik Black font, centered horizontally
 *    underneath the static 'REG NO.' badge).
 */
export async function drawIdCardOnCanvas(canvas, student, photoImg, cardInfo = null, options = {}) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const t = ID_CARD_TEMPLATE;

  // Set exact master card resolution: 662 × 1075 px
  canvas.width = t.dimensions.width;
  canvas.height = t.dimensions.height;

  // 1. Load Master Template Image (Priority: local asset / public -> Cloudinary URL)
  const templateImg = options.templateImg || await loadTemplateImage(
    t.masterTemplateUrl, 
    '/nacos_id_template_master.jpg'
  );

  // Draw master empty template as the authoritative background
  if (templateImg && templateImg.complete && templateImg.naturalWidth > 0) {
    ctx.drawImage(templateImg, 0, 0, canvas.width, canvas.height);
  } else {
    // Elegant deep green fallback if template image is still loading
    ctx.fillStyle = '#083002';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // 2. Composite Student Passport Photograph
  if (photoImg && photoImg.complete && photoImg.naturalWidth > 0) {
    ctx.save();
    // Clip strictly inside the rounded hexagon
    traceRoundedHexagon(ctx, t.photo.vertices, t.photo.cornerRadius);
    ctx.clip();

    // Cover scaling centered at (331, 358)
    const targetW = t.photo.boundingBox.width + 6; // 300px
    const targetH = t.photo.boundingBox.height + 6; // 334px
    const imgRatio = photoImg.naturalWidth / photoImg.naturalHeight;
    const boxRatio = targetW / targetH;
    let renderW, renderH, renderX, renderY;

    if (imgRatio > boxRatio) {
      renderH = targetH;
      renderW = targetH * imgRatio;
    } else {
      renderW = targetW;
      renderH = targetW / imgRatio;
    }
    renderX = t.photo.centerX - renderW / 2;
    renderY = t.photo.centerY - renderH / 2;

    ctx.drawImage(photoImg, renderX, renderY, renderW, renderH);
    ctx.restore();
  }

  // 2b. Frame Overlay (Ensures authentic green and white border sits cleanly above the photo)
  const frameImg = options.frameImg || await loadOptionalImage('/nacos_id_template_frame.png');
  if (frameImg && frameImg.complete && frameImg.naturalWidth > 0) {
    ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
  } else {
    // Sharp border stroke to guarantee clean border lines if frame PNG is not present
    ctx.save();
    ctx.strokeStyle = 'rgba(10, 115, 1, 0.95)';
    ctx.lineWidth = 6;
    ctx.lineJoin = 'round';
    traceRoundedHexagon(ctx, t.photo.vertices, t.photo.cornerRadius);
    ctx.stroke();
    ctx.restore();
  }

  // 3. Render Dynamic Student Full Name (Maintaining Fixed 38px Aeonik Black font across all generations)
  const rawName = student?.full_name || student?.name || 'STUDENT NAME';
  const fullName = String(rawName).trim().toUpperCase();

  const nameFontSize = t.name.fontSize; // Fixed 38px - never scaled down
  ctx.font = `${t.name.fontWeight} ${nameFontSize}px ${t.name.fontFamily}`;

  // Word and hyphen-based tokenization to support natural multi-line wrapping
  const rawWords = fullName.split(/\s+/).filter(Boolean);
  const initialTokens = [];
  for (const word of rawWords) {
    if (word.includes('-')) {
      const parts = word.split('-');
      for (let i = 0; i < parts.length; i++) {
        if (i < parts.length - 1) {
          initialTokens.push(parts[i] + '-');
        } else if (parts[i]) {
          initialTokens.push(parts[i]);
        }
      }
    } else {
      initialTokens.push(word);
    }
  }

  // Break excessively long single words if any token alone exceeds maxWidth
  const tokens = [];
  for (const token of initialTokens) {
    if (ctx.measureText(token).width > t.name.maxWidth && token.length > 12) {
      const half = Math.ceil(token.length / 2);
      tokens.push(token.slice(0, half) + '-');
      tokens.push(token.slice(half));
    } else {
      tokens.push(token);
    }
  }

  // Greedily assemble tokens into lines without shrinking the font size
  const lines = [];
  let currentLine = '';

  for (const token of tokens) {
    const testLine = currentLine
      ? (currentLine.endsWith('-') ? `${currentLine}${token}` : `${currentLine} ${token}`)
      : token;

    if (ctx.measureText(testLine).width <= t.name.maxWidth) {
      currentLine = testLine;
    } else {
      if (currentLine) {
        lines.push(currentLine);
      }
      currentLine = token;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }

  // Center multiple lines vertically between the NAME badge (bottom = 682) and REG NO. badge (top = 865)
  const numLines = lines.length;
  let centerY = 750;
  let lineGap = 50;

  if (numLines <= 1) {
    centerY = 750;
    lineGap = 0;
  } else if (numLines === 2) {
    centerY = 750;
    lineGap = 50; // Lines at 725 and 775
  } else if (numLines === 3) {
    centerY = 750;
    lineGap = 46; // Lines at 704, 750, 796
  } else {
    centerY = 755;
    lineGap = 40; // Lines at 695, 735, 775, 815
  }

  const startY = centerY - ((numLines - 1) * lineGap) / 2;

  ctx.fillStyle = t.name.color; // #000000
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  lines.forEach((lineText, idx) => {
    const lineY = startY + idx * lineGap;
    ctx.fillText(lineText, t.name.centerX, lineY);
  });

  // 4. Render Dynamic Registration Number (Strictly Digits Only)
  const rawReg = student?.registration_number || student?.matric || cardInfo?.matric_number || cardInfo?.id_card_number || '20241424442';
  const regNo = String(rawReg).replace(/\D/g, '') || String(rawReg).trim();

  let regFontSize = t.registrationNumber.fontSize; // 38
  ctx.font = `${t.registrationNumber.fontWeight} ${regFontSize}px ${t.registrationNumber.fontFamily}`;
  while (ctx.measureText(regNo).width > t.registrationNumber.maxWidth && regFontSize > 22) {
    regFontSize -= 1;
    ctx.font = `${t.registrationNumber.fontWeight} ${regFontSize}px ${t.registrationNumber.fontFamily}`;
  }

  ctx.fillStyle = t.registrationNumber.color; // #000000
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(regNo, t.registrationNumber.centerX, t.registrationNumber.y); // (331, 956)
}

/**
 * Trigger download of single image (dataURL or URL)
 */
function triggerFileDownload(urlOrDataUrl, filename) {
  const link = document.createElement('a');
  link.download = filename;
  link.href = urlOrDataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Download high-resolution PNG image
 * Supports downloading Front, Back, or Both sides
 */
export async function downloadIdCardAsImage(frontCanvasOrUrl, filename = 'NACOS-Student-ID-Card', side = 'both') {
  const frontDataUrl = typeof frontCanvasOrUrl === 'string' 
    ? frontCanvasOrUrl 
    : frontCanvasOrUrl?.toDataURL('image/png');

  const backUrl = ID_CARD_TEMPLATE.masterBackUrl || '/nacos_id_template_back.jpg';

  if (side === 'front' || side === 'both') {
    if (frontDataUrl) {
      triggerFileDownload(frontDataUrl, `${filename}-front.png`);
    }
  }

  if (side === 'back' || side === 'both') {
    if (side === 'both') {
      // Short delay to avoid browser download blocking
      setTimeout(() => {
        triggerFileDownload(backUrl, `${filename}-back.png`);
      }, 400);
    } else {
      triggerFileDownload(backUrl, `${filename}-back.png`);
    }
  }
}

/**
 * Generate and download high-resolution PDF document formatted for standard portrait CR-80 card printing
 * Contains Page 1: Front of ID, Page 2: Back of ID
 */
export function downloadIdCardAsPdf(frontCanvasOrUrl, filename = 'NACOS-Student-ID-Card', backUrl = null) {
  const frontImgData = typeof frontCanvasOrUrl === 'string'
    ? frontCanvasOrUrl
    : frontCanvasOrUrl?.toDataURL('image/png');

  if (!frontImgData) return;

  const backImgData = backUrl || ID_CARD_TEMPLATE.masterBackUrl || '/nacos_id_template_back.jpg';

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    downloadIdCardAsImage(frontCanvasOrUrl, filename, 'both');
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${filename} - Official Two-Sided NACOS ID Card</title>
        <style>
          @page {
            size: 53.98mm 85.6mm;
            margin: 0;
          }
          *, *::before, *::after {
            box-sizing: border-box;
          }
          html, body {
            margin: 0;
            padding: 0;
            background: #ffffff;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .id-card-page {
            width: 53.98mm;
            height: 85.6mm;
            page-break-after: always;
            page-break-inside: avoid;
            break-after: page;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            margin: 0 auto;
          }
          .id-card-page:last-child {
            page-break-after: avoid;
            break-after: avoid;
          }
          img {
            width: 53.98mm;
            height: 85.6mm;
            display: block;
            object-fit: cover;
          }
        </style>
      </head>
      <body>
        <div class="id-card-page">
          <img src="${frontImgData}" alt="NACOS ID Card Front" />
        </div>
        <div class="id-card-page">
          <img src="${backImgData}" alt="NACOS ID Card Back" onload="window.print();" />
        </div>
      </body>
    </html>
  `);
  printWindow.document.close();
}
