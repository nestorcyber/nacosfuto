import { supabase } from '@nacos/database';
import { hashPassword, isLocalEnvironment } from './utils.js';
import { ADMIN_SCOPES, hasPermission } from './permissions.js';

const PORTAL_ADMIN_SESSION_KEY = 'nacos_portal_admin_session';
const ADMIN_SCOPES_STORAGE_KEY = 'nacos_admin_scopes_db';
const STUDENT_USER_SESSION_KEY = 'nacos_user';

export function getLocalPortalAdmins() {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(ADMIN_SCOPES_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
  }

  const defaultAdmins = [
    {
      id: 'admin-seed-3',
      user_id: 'usr-portaladmin-1',
      email: 'portaladmin@nacos.org.ng',
      full_name: 'Portal Examination & Verification Officer',
      scope: ADMIN_SCOPES.STUDENT_PORTAL,
      role: 'portal_admin',
      permissions: [
        'student_portal.view',
        'student_portal.students',
        'student_portal.verification',
        'student_portal.id_cards',
        'student_portal.results',
        'student_portal.dues',
        'student_portal.settings'
      ],
      is_active: true,
      password_hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', // 'password'
      created_at: '2026-08-12T14:00:00Z'
    },
    {
      id: 'admin-seed-4',
      user_id: 'usr-superadmin-1',
      email: 'superadmin@nacos.org.ng',
      full_name: 'Staff Adviser / Super Admin',
      scope: ADMIN_SCOPES.SUPER_ADMIN,
      role: 'super_admin',
      permissions: ['*'],
      is_active: true,
      password_hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
      created_at: '2026-07-01T08:00:00Z'
    }
  ];

  localStorage.setItem(ADMIN_SCOPES_STORAGE_KEY, JSON.stringify(defaultAdmins));
  return defaultAdmins;
}

export async function loginPortalAdmin(email, password) {
  if (!email || !password) {
    return { error: 'Please provide both email address and administrative password.' };
  }

  const cleanEmail = email.trim().toLowerCase();
  const passwordHash = await hashPassword(password);

  let adminRecord = null;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: password
    });
    if (!error && data?.user) {
      const { data: scopeData } = await supabase
        .from('admin_scopes')
        .select('*')
        .eq('user_id', data.user.id)
        .in('scope', [ADMIN_SCOPES.STUDENT_PORTAL, ADMIN_SCOPES.SUPER_ADMIN])
        .eq('is_active', true)
        .maybeSingle();

      if (scopeData) adminRecord = scopeData;
    }
  } catch (e) {
    // Offline
  }

  if (!adminRecord) {
    if (!isLocalEnvironment()) {
      return { 
        error: 'Invalid portal administrative credentials. Access restricted to authorized NACOS portal administrators.' 
      };
    }

    const admins = getLocalPortalAdmins();
    const candidate = admins.find(a => a.email.toLowerCase() === cleanEmail);

    if (!candidate) {
      return { 
        error: 'Invalid portal administrative credentials. Access restricted to authorized NACOS portal administrators.' 
      };
    }

    const isDefaultPass = isLocalEnvironment() && password === 'password';
    if (candidate.password_hash !== passwordHash && !isDefaultPass) {
      return { error: 'Invalid password. Please check your credentials.' };
    }

    if (candidate.scope !== ADMIN_SCOPES.STUDENT_PORTAL && candidate.scope !== ADMIN_SCOPES.SUPER_ADMIN) {
      return { 
        error: `Access Denied: Your account holds the '${candidate.scope}' scope and is not authorized to manage Student Portal data.` 
      };
    }

    if (!candidate.is_active) {
      return { error: 'Account Disabled: Your portal administrative access has been revoked.' };
    }

    adminRecord = candidate;
  }

  const portalAdminSession = {
    user_id: adminRecord.user_id || adminRecord.id,
    id: adminRecord.id,
    email: adminRecord.email,
    full_name: adminRecord.full_name,
    scope: adminRecord.scope,
    role: adminRecord.role,
    permissions: adminRecord.permissions || ['student_portal.view', 'student_portal.students'],
    is_super_admin: adminRecord.scope === ADMIN_SCOPES.SUPER_ADMIN || adminRecord.role === 'super_admin',
    logged_in_at: new Date().toISOString()
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(PORTAL_ADMIN_SESSION_KEY, JSON.stringify(portalAdminSession));
  }

  return { success: true, admin: portalAdminSession };
}

export function getPortalAdminSession() {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(PORTAL_ADMIN_SESSION_KEY);
  if (!stored) return null;

  try {
    const session = JSON.parse(stored);
    if (session && (session.scope === ADMIN_SCOPES.STUDENT_PORTAL || session.scope === ADMIN_SCOPES.SUPER_ADMIN)) {
      return session;
    }
  } catch (e) {
    console.error('Failed to parse portal admin session', e);
  }

  return null;
}

export async function logoutPortalAdmin() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(PORTAL_ADMIN_SESSION_KEY);
  }
  try {
    await supabase.auth.signOut();
  } catch (e) {}
  return { success: true };
}

export function getStudentSession() {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(STUDENT_USER_SESSION_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch (e) {
    return null;
  }
}
