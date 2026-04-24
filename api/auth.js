// ============================================================
//  CALISTO API — AUTH & USER MANAGEMENT (Supabase)
// ============================================================

import { createClient } from '@supabase/supabase-js';

function getSupabase(useServiceRole = false) {
  let url = process.env.SUPABASE_URL;
  const key = useServiceRole ? process.env.SUPABASE_SERVICE_ROLE_KEY : process.env.SUPABASE_ANON_KEY;
  
  if (!url) return { error: 'SUPABASE_URL is missing.' };
  if (!key) return { error: useServiceRole ? 'SUPABASE_SERVICE_ROLE_KEY is missing.' : 'SUPABASE_ANON_KEY is missing.' };
  
  // Clean trailing parts
  url = url.replace(/\/$/, "").replace(/\/rest\/v1$/, "").replace(/\/auth\/v1$/, "");
  return createClient(url, key);
}

export default async function handler(req, res) {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }
  res.setHeader('Access-Control-Allow-Origin', '*');

  const supabase = getSupabase(false); 
  const adminSupabase = getSupabase(true); 

  // ── GET: List All Users (Admin only) ──
  if (req.method === 'GET') {
    if (adminSupabase.error) return res.status(500).json({ error: adminSupabase.error });

    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Auth required' });

    // Verify token
    const { data: { user }, error: authError } = await adminSupabase.auth.getUser(token);
    if (authError || !user) return res.status(401).json({ error: 'Invalid session' });

    try {
      const { data: profiles, error } = await adminSupabase
        .from('profiles')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return res.status(200).json({ success: true, users: profiles });
    } catch (err) {
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
  }

  // ── POST: Login or Update User ──
  if (req.method === 'POST') {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { action, email, password, userId, updates } = body;

    // --- CASE 1: Login ---
    if (!action || action === 'login') {
      if (supabase.error) return res.status(500).json({ error: supabase.error });

      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return res.status(401).json({ error: 'Authentication failed', details: error.message });

      const { user, session } = data;
      // Fetch profile for role
      let { data: profile } = await adminSupabase.from('profiles').select('*').eq('id', user.id).single();

      // AUTO-PROMOTION: If no superadmins exist, make this user a superadmin
      const { data: anyAdmin } = await adminSupabase.from('profiles').select('id').eq('role', 'superadmin').limit(1);
      if (!anyAdmin || anyAdmin.length === 0) {
        await adminSupabase.from('profiles').update({ role: 'superadmin' }).eq('id', user.id);
        // Refresh profile local variable
        const { data: updatedProf } = await adminSupabase.from('profiles').select('*').eq('id', user.id).single();
        profile = updatedProf;
      }

      return res.status(200).json({
        success: true,
        token: session.access_token,
        user: {
          id: user.id,
          email: user.email,
          name: profile?.full_name || user.user_metadata?.full_name || 'Admin',
          role: profile?.role || 'viewer',
          active: profile?.active ?? true
        }
      });
    }

    // --- CASE 2: User management (Update/Delete) ---
    if (adminSupabase.error) return res.status(500).json({ error: adminSupabase.error });

    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace('Bearer ', '');
    const { data: { user: adminUser } } = await adminSupabase.auth.getUser(token);
    
    const { data: adminProfile } = await adminSupabase.from('profiles').select('role').eq('id', adminUser?.id).single();
    if (adminProfile?.role !== 'superadmin') {
      return res.status(403).json({ error: 'Permission denied. SuperAdmin only.' });
    }

    if (action === 'update_user') {
      const { error } = await adminSupabase.from('profiles').update(updates).eq('id', userId);
      if (error) return res.status(500).json({ error: 'Update failed', details: error.message });
      return res.status(200).json({ success: true });
    }

    if (action === 'delete_user') {
      const { error } = await adminSupabase.auth.admin.deleteUser(userId);
      if (error) return res.status(500).json({ error: 'Delete failed', details: error.message });
      return res.status(200).json({ success: true });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
