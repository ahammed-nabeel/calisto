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

  if (req.method === 'POST') {
    const { action, userId, updates, email, password, full_name, role } = req.body;

    // A. CREATE NEW USER
    if (action === 'create') {
      if (!email || !password) return res.status(400).json({ success: false, error: "Email and password required" });
      const { data: authUser, error: authErr } = await adminSupabase.auth.admin.createUser({
        email, password, email_confirm: true, user_metadata: { full_name }
      });
      if (authErr) return res.status(400).json({ success: false, error: authErr.message });

      await adminSupabase.from('profiles').upsert({
        id: authUser.user.id, email, full_name, role: role || 'viewer', updated_at: new Date(), active: true
      });
      return res.status(200).json({ success: true });
    }

    // B. DELETE USER
    if (action === 'delete_user') {
      const { error: authErr } = await adminSupabase.auth.admin.deleteUser(userId);
      if (authErr) return res.status(400).json({ success: false, error: authErr.message });
      await adminSupabase.from('profiles').delete().eq('id', userId);
      return res.status(200).json({ success: true });
    }

    // C. UPDATE USER (Existing)
    if (action === 'update_user') {
      const { error } = await adminSupabase.from('profiles').update(updates).eq('id', userId);
      return res.status(200).json({ success: !error, error: error?.message });
    }
  }

  // ── POST: Login / Management ──
  if (req.method === 'POST') {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { action, email, password, userId, updates } = body;

    if (!action || action === 'login') {
      if (!supabase) return res.status(500).json({ error: 'Supabase keys missing' });
      const { data, error: loginErr } = await supabase.auth.signInWithPassword({ email, password });
      if (loginErr) return res.status(401).json({ error: 'Login failed', details: loginErr.message });

      const { user, session } = data;
      let log = [];

      // 1. Fetch Profile (Safe check)
      const { data: existing, error: fetchErr } = await adminSupabase.from('profiles').select('id, email, full_name, role, active, updated_at').eq('id', user.id);
      let profile = existing && existing.length > 0 ? existing[0] : null;

      // 2. Create if missing
      if (!profile) {
        log.push('Profile record missing. Creating...');
        const { data: created, error: insErr } = await adminSupabase.from('profiles').insert([
          { id: user.id, email: user.email, full_name: user.user_metadata?.full_name || 'Admin', role: 'viewer', updated_at: new Date() }
        ]).select();
        
        if (insErr) {
          log.push(`FAILED CREATE: ${insErr.message} (Code: ${insErr.code})`);
        } else {
          profile = created[0];
          log.push('Profile created successfully.');
        }
      }

      // 3. Promote first user
      const { data: currentAdmins } = await adminSupabase.from('profiles').select('id').eq('role', 'superadmin');
      if (!currentAdmins || currentAdmins.length === 0) {
        log.push('System has no admin. Promoting current user...');
        const { data: updated, error: updErr } = await adminSupabase.from('profiles').update({ role: 'superadmin' }).eq('id', user.id).select();
        if (updErr) {
          log.push(`FAILED PROMOTION: ${updErr.message}`);
        } else {
          profile = updated[0];
          log.push('PROMOTED TO SUPERADMIN.');
        }
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

    // Management (Update/Delete)
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace('Bearer ', '');
    const { data: { user: adminUser } } = await adminSupabase.auth.getUser(token);
    const { data: adminProfile } = await adminSupabase.from('profiles').select('role').eq('id', adminUser?.id).single();
    if (adminProfile?.role !== 'superadmin') return res.status(403).json({ error: 'SuperAdmin required' });

    if (action === 'update_user') {
      const { error } = await adminSupabase.from('profiles').update(updates).eq('id', userId);
      return res.status(error ? 500 : 200).json({ success: !error });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
