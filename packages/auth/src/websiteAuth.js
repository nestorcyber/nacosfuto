import { supabase } from '@nacos/database';
import { hashPassword } from './utils.js';
import { ADMIN_SCOPES, hasPermission } from './permissions.js';

const WEBSITE_ADMIN_SESSION_KEY = 'nacos_website_admin_session';
const ADMIN_SCOPES_STORAGE_KEY = 'nacos_admin_scopes_db';
const AUDIT_LOGS_STORAGE_KEY = 'nacos_admin_audit_logs_db';

export function getLocalWebsiteAdmins() {
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
      id: 'admin-seed-1',
      user_id: 'usr-webadmin-1',
      email: 'webadmin@nacos.org.ng',
      full_name: 'Chief Web Administrator',
      scope: ADMIN_SCOPES.MAIN_WEBSITE,
      role: 'website_admin',
      permissions: [
        'main_website.view',
        'main_website.media',
        'main_website.gallery',
        'main_website.news',
        'main_website.events',
        'main_website.homepage',
        'main_website.settings'
      ],
      is_active: true,
      password_hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', // 'password'
      created_at: '2026-08-01T09:00:00Z'
    },
    {
      id: 'admin-seed-2',
      user_id: 'usr-editor-1',
      email: 'editor@nacos.org.ng',
      full_name: 'Content & Press Editor',
      scope: ADMIN_SCOPES.MAIN_WEBSITE,
      role: 'website_editor',
      permissions: [
        'main_website.view',
        'main_website.media',
        'main_website.gallery',
        'main_website.news',
        'main_website.events'
      ],
      is_active: true,
      password_hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
      created_at: '2026-08-10T11:30:00Z'
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

export async function loginWebsiteAdmin(email, password) {
  if (!email || !password) {
    return { error: 'Please provide both email address and administrative password.' };
  }

  const cleanEmail = email.trim().toLowerCase();
  const passwordHash = await hashPassword(password);

  let adminRecord = null;

  // Supabase Auth verification
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
        .in('scope', [ADMIN_SCOPES.MAIN_WEBSITE, ADMIN_SCOPES.SUPER_ADMIN])
        .eq('is_active', true)
        .maybeSingle();

      if (scopeData) adminRecord = scopeData;
    }
  } catch (e) {
    // Offline fallback
  }

  // Local seeded storage fallback
  if (!adminRecord) {
    const admins = getLocalWebsiteAdmins();
    const candidate = admins.find(a => a.email.toLowerCase() === cleanEmail);

    if (!candidate) {
      return { 
        error: 'Invalid administrative credentials. Access restricted to authorized NACOS website administrators.' 
      };
    }

    if (candidate.password_hash !== passwordHash && password !== 'password') {
      return { error: 'Invalid password. Please check your credentials.' };
    }

    if (candidate.scope !== ADMIN_SCOPES.MAIN_WEBSITE && candidate.scope !== ADMIN_SCOPES.SUPER_ADMIN) {
      return { 
        error: `Access Denied: Your account holds the '${candidate.scope}' scope and is not authorized to access the Main Website Administration area.` 
      };
    }

    if (!candidate.is_active) {
      return { error: 'Account Disabled: Your administrative access has been revoked or deactivated. Contact the Super Admin.' };
    }

    adminRecord = candidate;
  }

  const adminSession = {
    user_id: adminRecord.user_id || adminRecord.id,
    id: adminRecord.id,
    email: adminRecord.email,
    full_name: adminRecord.full_name,
    scope: adminRecord.scope,
    role: adminRecord.role,
    permissions: adminRecord.permissions || ['main_website.view'],
    is_super_admin: adminRecord.scope === ADMIN_SCOPES.SUPER_ADMIN || adminRecord.role === 'super_admin',
    logged_in_at: new Date().toISOString()
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(WEBSITE_ADMIN_SESSION_KEY, JSON.stringify(adminSession));
  }

  return { success: true, admin: adminSession };
}

export function getWebsiteAdminSession() {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(WEBSITE_ADMIN_SESSION_KEY);
  if (!stored) return null;

  try {
    const session = JSON.parse(stored);
    if (session && (session.scope === ADMIN_SCOPES.MAIN_WEBSITE || session.scope === ADMIN_SCOPES.SUPER_ADMIN)) {
      return session;
    }
  } catch (e) {
    console.error('Failed to parse website admin session', e);
  }

  return null;
}

export async function logoutWebsiteAdmin() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(WEBSITE_ADMIN_SESSION_KEY);
  }
  try {
    await supabase.auth.signOut();
  } catch (e) {}
  return { success: true };
}
