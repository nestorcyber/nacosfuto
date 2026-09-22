/**
 * Dynamic cross-app routing helper that supports:
 * 1. Custom subdomain architectures (e.g. portal.nacosfuto.com.ng, admin.nacosfuto.com.ng)
 * 2. Production unified single-domain paths (/portal, /admin, /portal-admin, /, /admin-hub)
 * 3. Local development multi-port dev servers -> protocol://hostname:PORT
 * 4. Environment variable overrides (VITE_PORTAL_URL, VITE_WEBSITE_URL, etc.)
 */
export function getAppUrls() {
  if (typeof window === 'undefined') {
    return {
      website: '/',
      portal: '/portal',
      websiteAdmin: '/admin',
      portalAdmin: '/portal-admin',
      adminHub: '/admin-hub'
    };
  }

  const envPortal = typeof import.meta !== 'undefined' && import.meta.env?.VITE_PORTAL_URL;
  const envWebsite = typeof import.meta !== 'undefined' && import.meta.env?.VITE_WEBSITE_URL;
  const envWebAdmin = typeof import.meta !== 'undefined' && import.meta.env?.VITE_WEBSITE_ADMIN_URL;
  const envPortalAdmin = typeof import.meta !== 'undefined' && import.meta.env?.VITE_PORTAL_ADMIN_URL;

  const { hostname, protocol, port } = window.location;
  const isLocal = hostname === 'localhost' || hostname === '127.0.0.1' || hostname.endsWith('.local');

  // If in local dev with multi-port Vite servers (ports 5173-5176)
  if (isLocal && (port === '5173' || port === '5174' || port === '5175' || port === '5176')) {
    return {
      website: envWebsite || `${protocol}//${hostname}:5173`,
      portal: envPortal || `${protocol}//${hostname}:5174`,
      websiteAdmin: envWebAdmin || `${protocol}//${hostname}:5175`,
      portalAdmin: envPortalAdmin || `${protocol}//${hostname}:5176`,
      adminHub: `${protocol}//${hostname}:5173/admin-hub`
    };
  }

  // Detect custom subdomain setup (e.g. portal.nacosfuto.com.ng or admin.nacosfuto.org.ng)
  const isSubdomain = hostname.startsWith('portal.') || hostname.startsWith('admin.') || hostname.startsWith('portal-admin.');
  if (isSubdomain) {
    // Determine root apex domain (e.g. nacosfuto.com.ng, nacosfuto.org.ng, nacosfuto.ng)
    const parts = hostname.split('.');
    let baseDomain = hostname;
    if (parts.length >= 3) {
      if (['com', 'org', 'edu', 'gov', 'net'].includes(parts[parts.length - 2])) {
        baseDomain = parts.slice(-3).join('.');
      } else {
        baseDomain = parts.slice(-2).join('.');
      }
    }

    return {
      website: envWebsite || `${protocol}//${baseDomain}`,
      portal: envPortal || `${protocol}//portal.${baseDomain}`,
      websiteAdmin: envWebAdmin || `${protocol}//admin.${baseDomain}/website`,
      portalAdmin: envPortalAdmin || `${protocol}//admin.${baseDomain}`,
      adminHub: `${protocol}//${baseDomain}/admin-hub`
    };
  }

  // Production or unified single-host deployment (e.g. nacosfuto.org.ng/portal)
  return {
    website: envWebsite || '/',
    portal: envPortal || '/portal',
    websiteAdmin: envWebAdmin || '/admin',
    portalAdmin: envPortalAdmin || '/portal-admin',
    adminHub: '/admin-hub'
  };
}

