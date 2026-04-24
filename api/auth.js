// ============================================================
//  CALISTO API — AUTH & USER MANAGEMENT (Supabase)
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
  // DISABLE CACHING
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const supabase = getSupabase(false); 
  const adminSupabase = getSupabase(true); 

  // ── GET: List All Users ──
  if (req.method === 'GET') {
    if (!adminSupabase) return res.status(500).json({ error: 'Config missing' });
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await adminSupabase.auth.getUser(token);
    if (authError || !user) return res.status(401).json({ error: 'Invalid session' });

    const { data: profiles, error } = await adminSupabase.from('profiles').select('*').order('updated_at', { ascending: false });
    return res.status(error ? 500 : 200).json({ success: !error, users: profiles || [], count: profiles?.length || 0 });
  }

  // ── POST: Login / Management ──
  if (req.method === 'POST') {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { action, email, password, userId, updates } = body;

    // LOGIN
    if (!action || action === 'login') {
      if (!supabase) return res.status(500).json({ error: 'Config missing' });
      const { data, error: loginErr } = await supabase.auth.signInWithPassword({ email, password });
      if (loginErr) return res.status(401).json({ error: 'Login failed', details: loginErr.message });

      const { user, session } = data;
      let logTrace = [];

      // ENSURE PROFILE EXISTS
      let { data: profile } = await adminSupabase.from('profiles').select('*').eq('id', user.id).single();
      
      if (!profile) {
        logTrace.push(`Profile missing for ${user.id}. Attempting create...`);
        const { data: newProf, error: insErr } = await adminSupabase.from('profiles').insert([
          { id: user.id, email: user.email, full_name: user.user_metadata?.full_name || 'Admin', role: 'viewer' }
        ]).select().single();
        
        if (insErr) {
          logTrace.push(`Insert failed: ${insErr.message}`);
        } else {
          profile = newProf;
          logTrace.push('Profile created.');
        }
      }

      // Check for any SuperAdmin
      const { data: allAdmins } = await adminSupabase.from('profiles').select('id').eq('role', 'superadmin');
      if (!allAdmins || allAdmins.length === 0) {
        logTrace.push('Found zero superadmins. Promoting this user...');
        const { data: updatedProf, error: updErr } = await adminSupabase.from('profiles').update({ role: 'superadmin' }).eq('id', user.id).select().single();
        if (updErr) {
          logTrace.push(`Promotion failed: ${updErr.message}`);
        } else {
          profile = updatedProf;
          logTrace.push('Promoted successfully.');
        }
      }

      return res.status(200).json({
        success: true,
        token: session.access_token,
        trace: logTrace,
        user: {
          id: user.id, email: user.email,
          name: profile?.full_name || 'Admin',
          role: profile?.role || 'viewer',
          active: profile?.active ?? true
        }
      });
    }

    // MANAGEMENT ACTIONS
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace('Bearer ', '');
    const { data: { user: adminUser } } = await adminSupabase.auth.getUser(token);
    const { data: adminProfile } = await adminSupabase.from('profiles').select('role').eq('id', adminUser?.id).single();
    if (adminProfile?.role !== 'superadmin') return res.status(403).json({ error: 'SuperAdmin required' });

    if (action === 'update_user') {
      const { error } = await adminSupabase.from('profiles').update(updates).eq('id', userId);
      return res.status(error ? 500 : 200).json({ success: !error });
    }
    if (action === 'delete_user') {
      const { error } = await adminSupabase.auth.admin.deleteUser(userId);
      return res.status(error ? 500 : 200).json({ success: !error });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
