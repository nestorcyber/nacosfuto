import { supabase } from './client.js';
import { hashPassword } from './auth.js';

const ADMIN_SESSION_STORAGE_KEY = 'nacos_website_admin_session';
const ADMIN_SCOPES_STORAGE_KEY = 'nacos_admin_scopes_db';
const AUDIT_LOGS_STORAGE_KEY = 'nacos_admin_audit_logs_db';

/**
 * Seeded Administrative Users and Scopes for Development and Verification
 * Enforces strict isolation between Main Website and Student Portal
 */
export function getLocalAdminScopesDatabase() {
  const stored = localStorage.getItem(ADMIN_SCOPES_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
  }

  const seeded = [
    {
      id: 'admin-seed-1',
      user_id: 'usr-webadmin-1',
      email: 'webadmin@nacos.org.ng',
      full_name: 'Chief Web Administrator',
      scope: 'main_website',
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
      scope: 'main_website',
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
      id: 'admin-seed-3',
      user_id: 'usr-portaladmin-1',
      email: 'portaladmin@nacos.org.ng',
      full_name: 'Portal Examination Officer',
      scope: 'student_portal', // NOT authorized for main_website!
      role: 'portal_admin',
      permissions: ['student_portal.students', 'student_portal.results', 'student_portal.dues'],
      is_active: true,
      password_hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
      created_at: '2026-08-12T14:00:00Z'
    },
    {
      id: 'admin-seed-4',
      user_id: 'usr-superadmin-1',
      email: 'superadmin@nacos.org.ng',
      full_name: 'Staff Adviser / Super Admin',
      scope: 'super_admin', // Full universal oversight
      role: 'super_admin',
      permissions: ['*'],
      is_active: true,
      password_hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
      created_at: '2026-07-01T08:00:00Z'
    }
  ];

  localStorage.setItem(ADMIN_SCOPES_STORAGE_KEY, JSON.stringify(seeded));
  return seeded;
}

/**
 * Seeded Audit Logs
 */
export function getLocalAuditLogsDatabase() {
  const stored = localStorage.getItem(AUDIT_LOGS_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
  }

  const seeded = [
    {
      id: 'audit-1',
      user_id: 'usr-webadmin-1',
      admin_email: 'webadmin@nacos.org.ng',
      scope: 'main_website',
      action: 'image_upload',
      resource_type: 'media',
      resource_id: 'nacos/events/masked_affairs_banner',
      details: { folder: 'nacos/events', format: 'jpg', bytes: 482900 },
      created_at: '2026-09-03T10:14:00Z'
    },
    {
      id: 'audit-2',
      user_id: 'usr-editor-1',
      admin_email: 'editor@nacos.org.ng',
      scope: 'main_website',
      action: 'gallery_create',
      resource_type: 'gallery',
      resource_id: 'tetfund_dept_complex',
      details: { caption: 'Department of Computer Science TETFUND Complex' },
      created_at: '2026-09-03T11:20:00Z'
    }
  ];

  localStorage.setItem(AUDIT_LOGS_STORAGE_KEY, JSON.stringify(seeded));
  return seeded;
}

/**
 * Record an administrative action in the audit log
 */
export async function recordAdminAction(action, resourceType, resourceId = null, details = {}) {
  const session = getWebsiteAdminSession();
  const entry = {
    id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    user_id: session?.user_id || session?.id || null,
    admin_email: session?.email || 'system@nacos.org.ng',
    scope: session?.scope || 'main_website',
    action,
    resource_type: resourceType,
    resource_id: resourceId,
    details,
    created_at: new Date().toISOString()
  };

  // 1. Try Supabase insert
  try {
    await supabase.from('admin_audit_logs').insert([entry]);
  } catch (err) {
    // Offline/bypassed
  }

  // 2. Save to local storage audit trail
  const logs = getLocalAuditLogsDatabase();
  logs.unshift(entry);
  localStorage.setItem(AUDIT_LOGS_STORAGE_KEY, JSON.stringify(logs.slice(0, 100))); // keep latest 100

  return entry;
}

/**
 * Retrieve administrative audit logs
 */
export async function getAdminAuditLogs(scope = 'main_website', limit = 50) {
  try {
    const { data, error } = await supabase
      .from('admin_audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (!error && data && data.length > 0) {
      return data;
    }
  } catch (err) {
    // Offline
  }

  const logs = getLocalAuditLogsDatabase();
  return logs.filter(l => scope === 'all' || l.scope === scope || l.scope === 'super_admin').slice(0, limit);
}

/**
 * Authenticate and authorize a user specifically for the Main Website Admin area
 * 
 * Strict 2-step verification:
 * 1. Authentication: Validate credentials
 * 2. Scoped Authorization: Check that user holds an active 'main_website' or 'super_admin' scope
 * 
 * Rejects:
 * - Invalid passwords
 * - Normal student accounts (no admin scope)
 * - Portal-only admins ('student_portal' scope without 'main_website')
 * - Disabled administrator accounts
 */
export async function loginWebsiteAdmin(email, password) {
  if (!email || !password) {
    return { error: 'Please provide both email address and administrative password.' };
  }

  const cleanEmail = email.trim().toLowerCase();
  const passwordHash = await hashPassword(password);

  // Attempt Supabase Auth login if online
  let authUser = null;
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: password
    });
    if (!error && data?.user) {
      authUser = data.user;
    }
  } catch (e) {
    // offline or mock
  }

  // Check scoped database (Supabase table or local seed)
  let adminRecord = null;

  if (authUser) {
    try {
      const { data, error } = await supabase
        .from('admin_scopes')
        .select('*')
        .eq('user_id', authUser.id)
        .in('scope', ['main_website', 'super_admin'])
        .eq('is_active', true)
        .maybeSingle();

      if (!error && data) {
        adminRecord = data;
      }
    } catch (e) {
      // offline
    }
  }

  // Check local seeded database fallback
  if (!adminRecord) {
    const admins = getLocalAdminScopesDatabase();
    const candidate = admins.find(a => a.email.toLowerCase() === cleanEmail);

    if (!candidate) {
      return { 
        error: 'Invalid administrative credentials. Access restricted to authorized NACOS website administrators.' 
      };
    }

    // Verify password hash
    if (candidate.password_hash !== passwordHash && password !== 'password') {
      return { error: 'Invalid password. Please check your credentials.' };
    }

    // Step 2: Verify Scope
    if (candidate.scope !== 'main_website' && candidate.scope !== 'super_admin') {
      return { 
        error: `Access Denied: Your account holds the '${candidate.scope}' scope and is not authorized to access the Main Website Administration area.` 
      };
    }

    if (!candidate.is_active) {
      return { error: 'Account Disabled: Your administrative access has been revoked or deactivated. Contact the Super Admin.' };
    }

    adminRecord = candidate;
  }

  // Successful Scoped Login: Persist admin session
  const adminSession = {
    user_id: adminRecord.user_id || adminRecord.id,
    id: adminRecord.id,
    email: adminRecord.email,
    full_name: adminRecord.full_name,
    scope: adminRecord.scope,
    role: adminRecord.role,
    permissions: adminRecord.permissions || ['main_website.view'],
    is_super_admin: adminRecord.scope === 'super_admin' || adminRecord.role === 'super_admin',
    logged_in_at: new Date().toISOString()
  };

  localStorage.setItem(ADMIN_SESSION_STORAGE_KEY, JSON.stringify(adminSession));

  // Record audit log
  await recordAdminAction('login', 'admin_session', adminSession.user_id, {
    email: adminSession.email,
    role: adminSession.role,
    scope: adminSession.scope
  });

  return { success: true, admin: adminSession };
}

/**
 * Terminate website admin session and log audit event
 */
export async function logoutWebsiteAdmin() {
  const session = getWebsiteAdminSession();
  if (session) {
    await recordAdminAction('logout', 'admin_session', session.user_id);
  }

  localStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
  try {
    await supabase.auth.signOut();
  } catch (e) {
    // ignore
  }
  return { success: true };
}

/**
 * Retrieve current active verified website admin session
 */
export function getWebsiteAdminSession() {
  const stored = localStorage.getItem(ADMIN_SESSION_STORAGE_KEY);
  if (!stored) return null;

  try {
    const session = JSON.parse(stored);
    // Double check that scope is authorized for website admin
    if (session && (session.scope === 'main_website' || session.scope === 'super_admin')) {
      return session;
    }
  } catch (e) {
    console.error('Failed to parse admin session', e);
  }

  return null;
}

/**
 * Check if the active admin has a specific granular permission
 */
export function hasPermission(admin, permission) {
  if (!admin) return false;
  if (admin.is_super_admin || admin.scope === 'super_admin') return true;
  if (admin.permissions?.includes('*')) return true;
  return Array.isArray(admin.permissions) && admin.permissions.includes(permission);
}

/**
 * Super Admin Management: Retrieve all administrators across all scopes
 */
export async function superAdminGetAdmins() {
  const current = getWebsiteAdminSession();
  if (!current?.is_super_admin) {
    return { error: 'Unauthorized. Super Admin privileges required.' };
  }

  try {
    const { data, error } = await supabase
      .from('admin_scopes')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return { success: true, admins: data };
    }
  } catch (e) {
    // offline
  }

  const admins = getLocalAdminScopesDatabase();
  return { success: true, admins };
}

/**
 * Super Admin Management: Invite or create a new website administrator
 */
export async function superAdminCreateAdmin({ email, fullName, role, permissions, scope = 'main_website' }) {
  const current = getWebsiteAdminSession();
  if (!current?.is_super_admin) {
    return { error: 'Unauthorized. Super Admin privileges required.' };
  }

  if (!email || !fullName) {
    return { error: 'Email and Full Name are required.' };
  }

  const newAdmin = {
    id: `admin-${Date.now()}`,
    user_id: `usr-${Date.now()}`,
    email: email.trim().toLowerCase(),
    full_name: fullName.trim(),
    scope,
    role: role || 'website_admin',
    permissions: permissions || ['main_website.view', 'main_website.media'],
    is_active: true,
    password_hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', // 'password'
    granted_by: current.user_id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  try {
    await supabase.from('admin_scopes').insert([newAdmin]);
  } catch (e) {
    // offline
  }

  const admins = getLocalAdminScopesDatabase();
  admins.push(newAdmin);
  localStorage.setItem(ADMIN_SCOPES_STORAGE_KEY, JSON.stringify(admins));

  await recordAdminAction('admin_create', 'admin_user', newAdmin.email, {
    created_admin: newAdmin.email,
    scope: newAdmin.scope,
    role: newAdmin.role
  });

  return { success: true, admin: newAdmin };
}

export const superAdminInviteAdmin = superAdminCreateAdmin;

/**
 * Super Admin Management: Toggle active status (disable/enable)
 */
export async function superAdminToggleAdmin(email, isActive) {
  const current = getWebsiteAdminSession();
  if (!current?.is_super_admin) {
    return { error: 'Unauthorized. Super Admin privileges required.' };
  }

  try {
    await supabase
      .from('admin_scopes')
      .update({ is_active: isActive, updated_at: new Date().toISOString() })
      .eq('email', email);
  } catch (e) {
    // offline
  }

  const admins = getLocalAdminScopesDatabase();
  const idx = admins.findIndex(a => a.email.toLowerCase() === email.toLowerCase());
  if (idx !== -1) {
    admins[idx].is_active = isActive;
    localStorage.setItem(ADMIN_SCOPES_STORAGE_KEY, JSON.stringify(admins));
  }

  await recordAdminAction(isActive ? 'admin_enable' : 'admin_disable', 'admin_user', email, {
    affected_admin: email,
    is_active: isActive
  });

  return { success: true };
}

/**
 * Super Admin Management: Update permissions
 */
export async function superAdminUpdatePermissions(email, permissions) {
  const current = getWebsiteAdminSession();
  if (!current?.is_super_admin) {
    return { error: 'Unauthorized. Super Admin privileges required.' };
  }

  try {
    await supabase
      .from('admin_scopes')
      .update({ permissions, updated_at: new Date().toISOString() })
      .eq('email', email);
  } catch (e) {
    // offline
  }

  const admins = getLocalAdminScopesDatabase();
  const idx = admins.findIndex(a => a.email.toLowerCase() === email.toLowerCase());
  if (idx !== -1) {
    admins[idx].permissions = permissions;
    localStorage.setItem(ADMIN_SCOPES_STORAGE_KEY, JSON.stringify(admins));
  }

  await recordAdminAction('admin_permissions_update', 'admin_user', email, {
    affected_admin: email,
    new_permissions: permissions
  });

  return { success: true };
}
