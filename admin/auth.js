// ============================================================
//  CALISTO ADMIN — AUTH & PERMISSIONS (Supabase Version)
//  auth.js — include on every admin page
// ============================================================

const PERMISSIONS = {
  view_forms:       { label: 'View Contact Forms' },
  manage_products:  { label: 'Add / Edit Products' },
  manage_seo:       { label: 'SEO Details' },
  manage_users:     { label: 'User Management' },
  export_data:      { label: 'Export & Deploy' },
};

const ROLE_PRESETS = {
  superadmin: { permissions: Object.keys(PERMISSIONS) },
  editor:     { permissions: ['view_forms', 'manage_products', 'manage_seo'] },
  viewer:     { permissions: ['view_forms'] },
};

function getSession() {
  const raw = sessionStorage.getItem('calisto_session');
  if (raw) { try { return JSON.parse(raw); } catch(e) {} }
  return null;
}

function setSession(user, token) {
  const session = {
    id: user.id,
    email: user.email,
    name: user.name || 'User',
    role: user.role || 'viewer',
    permissions: ROLE_PRESETS[user.role || 'viewer']?.permissions || ['view_forms'],
    avatar: (user.name || user.email || 'U').slice(0, 2).toUpperCase(),
    loginAt: Date.now()
  };
  sessionStorage.setItem('calisto_session', JSON.stringify(session));
  if (token) sessionStorage.setItem('calisto_api_token', token);
  return session;
}

function clearSession() {
  sessionStorage.removeItem('calisto_session');
  sessionStorage.removeItem('calisto_api_token');
}

function requireAuth() {
  const session = getSession();
  if (!session) {
    window.location.href = 'login.html';
    return null;
  }
  return session;
}

function can(permission) {
  const session = getSession();
  if (!session) return false;
  
  // Superadmin always has all permissions
  if (session.role === 'superadmin') return true;
  
  return session.permissions.includes(permission);
}

function authLogout() {
  clearSession();
  window.location.href = 'login.html';
}
