// ============================================================
//  CALISTO ADMIN — AUTH & USER MANAGEMENT
//  auth.js — include on every admin page
// ============================================================

// ── Default superadmin (always exists, cannot be deleted) ──
const SUPERADMIN = {
  id: 'superadmin',
  username: 'admin',
  password: 'calisto2025',   // Change after first login
  name: 'Super Admin',
  role: 'superadmin',
  email: 'admin@calistotech.com',
  avatar: 'SA',
  createdAt: '2025-01-01',
  active: true
};

// ── Permission definitions ──
const PERMISSIONS = {
  view_forms:       { label: 'View Contact Forms',       icon: 'inbox',    desc: 'Read submitted contact/enquiry forms' },
  manage_products:  { label: 'Add / Edit Products',      icon: 'box',      desc: 'Create, edit, delete categories, subcategories and products' },
  manage_seo:       { label: 'SEO Details',              icon: 'search',   desc: 'Edit meta titles, descriptions, keywords per page' },
  manage_users:     { label: 'User Management',          icon: 'users',    desc: 'Create, edit, deactivate user accounts and assign roles' },
  export_data:      { label: 'Export & Deploy',          icon: 'download', desc: 'Download data files and deploy product catalog' },
};

// ── Role presets ──
const ROLE_PRESETS = {
  superadmin: {
    label: 'Super Admin',
    color: '#7c3aed',
    permissions: Object.keys(PERMISSIONS)   // all
  },
  editor: {
    label: 'Editor',
    color: '#0891b2',
    permissions: ['view_forms', 'manage_products', 'manage_seo']
  },
  viewer: {
    label: 'Viewer',
    color: '#16a34a',
    permissions: ['view_forms']
  },
  seo_manager: {
    label: 'SEO Manager',
    color: '#d97706',
    permissions: ['manage_seo', 'view_forms']
  },
  custom: {
    label: 'Custom',
    color: '#64748b',
    permissions: []
  }
};

// ── Storage helpers ──
function getUsers() {
  const raw = localStorage.getItem('calisto_users');
  if (raw) { try { return JSON.parse(raw); } catch(e) {} }
  return [SUPERADMIN];
}

function saveUsers(users) {
  localStorage.setItem('calisto_users', JSON.stringify(users));
}

function getSession() {
  const raw = sessionStorage.getItem('calisto_session');
  if (raw) { try { return JSON.parse(raw); } catch(e) {} }
  return null;
}

function setSession(user) {
  const session = {
    id: user.id,
    username: user.username,
    name: user.name,
    role: user.role,
    permissions: getUserPermissions(user),
    avatar: user.avatar || user.name.slice(0,2).toUpperCase(),
    loginAt: Date.now()
  };
  sessionStorage.setItem('calisto_session', JSON.stringify(session));
  return session;
}

function clearSession() {
  sessionStorage.removeItem('calisto_session');
}

function getUserPermissions(user) {
  if (user.role === 'superadmin') return Object.keys(PERMISSIONS);
  if (user.role === 'custom') return user.permissions || [];
  return (ROLE_PRESETS[user.role] || ROLE_PRESETS.viewer).permissions;
}

// ── Auth functions ──
function authLogin(username, password) {
  if (!username || !password) return { success: false, message: 'Please enter username and password.' };

  // Check superadmin first
  if (username === SUPERADMIN.username && password === SUPERADMIN.password) {
    setSession(SUPERADMIN);
    return { success: true, user: SUPERADMIN };
  }

  // Check stored users
  const users = getUsers();
  const user = users.find(u => u.username === username && u.password === password && u.active !== false);
  if (user) {
    setSession(user);
    return { success: true, user };
  }

  return { success: false, message: 'Incorrect username or password.' };
}

function authLogout() {
  clearSession();
  window.location.href = 'login.html';
}

// ── Guard: call on every admin page ──
function requireAuth() {
  const session = getSession();
  if (!session) {
    window.location.href = 'login.html';
    return null;
  }
  return session;
}

// ── Permission check ──
function can(permission) {
  const session = getSession();
  if (!session) return false;
  return session.permissions.includes(permission);
}

// ── User CRUD ──
function createUser({ username, password, name, email, role, permissions }) {
  const users = getUsers();
  if (users.find(u => u.username === username) || username === SUPERADMIN.username) {
    return { success: false, message: 'Username already exists.' };
  }
  const newUser = {
    id: 'user_' + Date.now(),
    username,
    password,
    name,
    email: email || '',
    role: role || 'viewer',
    permissions: permissions || [],
    avatar: name.slice(0,2).toUpperCase(),
    createdAt: new Date().toISOString().slice(0,10),
    active: true
  };
  users.push(newUser);
  saveUsers(users);
  return { success: true, user: newUser };
}

function updateUser(id, updates) {
  if (id === SUPERADMIN.id) return { success: false, message: 'Cannot edit the superadmin.' };
  const users = getUsers();
  const idx = users.findIndex(u => u.id === id);
  if (idx === -1) return { success: false, message: 'User not found.' };
  // Don't allow username collision
  if (updates.username && updates.username !== users[idx].username) {
    if (users.find(u => u.username === updates.username)) {
      return { success: false, message: 'Username already taken.' };
    }
  }
  users[idx] = { ...users[idx], ...updates };
  saveUsers(users);
  return { success: true, user: users[idx] };
}

function deleteUser(id) {
  if (id === SUPERADMIN.id) return { success: false, message: 'Cannot delete the superadmin.' };
  const session = getSession();
  if (session && session.id === id) return { success: false, message: 'Cannot delete your own account.' };
  let users = getUsers();
  users = users.filter(u => u.id !== id);
  saveUsers(users);
  return { success: true };
}

function toggleUserActive(id) {
  if (id === SUPERADMIN.id) return { success: false };
  const users = getUsers();
  const user = users.find(u => u.id === id);
  if (!user) return { success: false };
  user.active = !user.active;
  saveUsers(users);
  return { success: true, active: user.active };
}

function getAllUsers() {
  const users = getUsers();
  // Inject superadmin if not stored
  const hasSA = users.find(u => u.id === SUPERADMIN.id);
  if (!hasSA) return [SUPERADMIN, ...users];
  return users;
}
