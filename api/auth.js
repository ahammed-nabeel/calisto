// ============================================================
//  CALISTO API — AUTH & PROFILES (Diagnostics Mode)
// ============================================================

import { createClient } from '@supabase/supabase-js';

function getSupabase(useServiceRole = false) {
  const url = process.env.SUPABASE_URL;
  const key = useServiceRole ? process.env.SUPABASE_SERVICE_ROLE_KEY : process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  const cleanUrl = url.replace(/\/$/, "").replace(/\/rest\/v1$/, "").replace(/\/auth\/v1$/, "");
  return createClient(cleanUrl, key);
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const supabase = getSupabase(false); 
  const adminSupabase = getSupabase(true); 

  if (!adminSupabase) return res.status(500).json({ error: 'Config missing' });

  // ── GET USER LIST ──
  if (req.method === 'GET') {
    const { data: profiles, error: dbErr } = await adminSupabase.from('profiles').select('id, email, full_name, role, active, updated_at');
    return res.status(200).json({ 
      success: !dbErr, 
      users: profiles || [], 
      error: dbErr?.message 
    });
  }

  // ── POST: Login & Management ──
  if (req.method === 'POST') {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { action, email, password, userId, updates, full_name, role } = body;

    // 1. LOGIN (No token needed)
    if (!action || action === 'login') {
      if (!supabase) return res.status(500).json({ error: 'Supabase keys missing' });
      const { data, error: loginErr } = await supabase.auth.signInWithPassword({ email, password });
      if (loginErr) return res.status(401).json({ error: 'Login failed', details: loginErr.message });

      const { user, session } = data;
      let log = [];

      // Fetch Profile
      const { data: existing } = await adminSupabase.from('profiles').select('*').eq('id', user.id);
      let profile = existing && existing.length > 0 ? existing[0] : null;

      // Create if missing
      if (!profile) {
        log.push('Profile missing. Creating...');
        const { data: created, error: insErr } = await adminSupabase.from('profiles').insert([
          { id: user.id, email: user.email, full_name: user.user_metadata?.full_name || 'Admin', role: 'viewer', updated_at: new Date(), active: true }
        ]).select();
        if (!insErr) profile = created[0];
      }

      // Promote first user
      const { data: admins } = await adminSupabase.from('profiles').select('id').eq('role', 'superadmin');
      if (!admins || admins.length === 0) {
        log.push('No superadmin found. Promoting first user...');
        const { data: updated } = await adminSupabase.from('profiles').update({ role: 'superadmin' }).eq('id', user.id).select();
        if (updated) profile = updated[0];
      }

      return res.status(200).json({
        success: true,
        token: session.access_token,
        trace: log,
        user: {
          id: user.id, email: user.email,
          name: profile?.full_name || 'Admin',
          role: profile?.role || 'viewer',
          active: profile?.active ?? true
        }
      });
    }

    // ── ALL OTHER ACTIONS REQUIRE SUPERADMIN TOKEN ──
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace('Bearer ', '');
    const { data: { user: adminUser }, error: verifyErr } = await adminSupabase.auth.getUser(token);
    
    if (verifyErr || !adminUser) return res.status(401).json({ error: 'Unauthorized' });

    const { data: adminProfile } = await adminSupabase.from('profiles').select('role').eq('id', adminUser.id).single();
    if (adminProfile?.role !== 'superadmin') return res.status(403).json({ error: 'SuperAdmin required' });

    // A. CREATE USER
    if (action === 'create') {
      if (!email || !password) return res.status(400).json({ error: "Email/Password required" });
      const { data: authUser, error: authErr } = await adminSupabase.auth.admin.createUser({
        email, password, email_confirm: true, user_metadata: { full_name }
      });
      if (authErr) return res.status(400).json({ error: authErr.message });

      await adminSupabase.from('profiles').upsert({
        id: authUser.user.id, email, full_name, role: role || 'viewer', updated_at: new Date(), active: true
      });
      return res.status(200).json({ success: true });
    }

    // B. DELETE USER
    if (action === 'delete_user') {
      // Try to delete from Auth, but don't block if they don't exist there
      try {
        await adminSupabase.auth.admin.deleteUser(userId);
      } catch (e) {
        console.warn("Auth deletion failed or user not in Auth:", e.message);
      }
      
      const { error: dbErr } = await adminSupabase.from('profiles').delete().eq('id', userId);
      return res.status(dbErr ? 500 : 200).json({ success: !dbErr, error: dbErr?.message });
    }

    // C. UPDATE USER
    if (action === 'update_user') {
      const { error: dbErr } = await adminSupabase.from('profiles').update(updates).eq('id', userId);
      return res.status(dbErr ? 500 : 200).json({ success: !dbErr, error: dbErr?.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
