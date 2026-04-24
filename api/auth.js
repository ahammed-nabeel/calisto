// ============================================================
//  CALISTO API — AUTH & USER MANAGEMENT (Supabase)
// ============================================================

import { createClient } from '@supabase/supabase-js';

function getSupabase(useServiceRole = false) {
  const url = process.env.SUPABASE_URL;
  const key = useServiceRole ? process.env.SUPABASE_SERVICE_ROLE_KEY : process.env.SUPABASE_ANON_KEY;
  
  if (!url || !key) return null;
  
  // Clean URL
  const cleanUrl = url.replace(/\/$/, "").replace(/\/rest\/v1$/, "").replace(/\/auth\/v1$/, "");
  return createClient(cleanUrl, key);
}

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const supabase = getSupabase(false); 
  const adminSupabase = getSupabase(true); 

  // ── GET: List All Users ──
  if (req.method === 'GET') {
    if (!adminSupabase) return res.status(500).json({ error: 'Supabase keys are missing in Vercel environment.' });

    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Auth required' });

    const { data: { user }, error: authError } = await adminSupabase.auth.getUser(token);
    if (authError || !user) return res.status(401).json({ error: 'Invalid session' });

    try {
      const { data: profiles, error } = await adminSupabase.from('profiles').select('*').order('updated_at', { ascending: false });
      if (error) throw error;
      return res.status(200).json({ success: true, users: profiles });
    } catch (err) {
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
  }

  // ── POST: Login / Management ──
  if (req.method === 'POST') {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { action, email, password, userId, updates } = body;

    // Login
    if (!action || action === 'login') {
      if (!supabase) return res.status(500).json({ error: 'Supabase configuration missing.' });
      
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return res.status(401).json({ error: 'Login failed', details: error.message });

      const { user, session } = data;
      let { data: profile } = await adminSupabase.from('profiles').select('*').eq('id', user.id).single();

      // Auto-promote if no admins exist
      const { data: anyAdmin } = await adminSupabase.from('profiles').select('id').eq('role', 'superadmin').limit(1);
      if (!anyAdmin || anyAdmin.length === 0) {
        await adminSupabase.from('profiles').update({ role: 'superadmin' }).eq('id', user.id);
        const { data: updatedProf } = await adminSupabase.from('profiles').select('*').eq('id', user.id).single();
        profile = updatedProf;
      }

      return res.status(200).json({
        success: true,
        token: session.access_token,
        user: {
          id: user.id, email: user.email,
          name: profile?.full_name || 'Admin',
          role: profile?.role || 'viewer',
          active: profile?.active ?? true
        }
      });
    }

    // Protect Management actions
    if (!adminSupabase) return res.status(500).json({ error: 'Service role key missing.' });
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace('Bearer ', '');
    const { data: { user: adminUser } } = await adminSupabase.auth.getUser(token);
    const { data: adminProfile } = await adminSupabase.from('profiles').select('role').eq('id', adminUser?.id).single();
    
    if (adminProfile?.role !== 'superadmin') return res.status(403).json({ error: 'SuperAdmin only.' });

    if (action === 'update_user') {
      const { error } = await adminSupabase.from('profiles').update(updates).eq('id', userId);
      return res.status(error ? 500 : 200).json({ success: !error, error: error?.message });
    }
    if (action === 'delete_user') {
      const { error } = await adminSupabase.auth.admin.deleteUser(userId);
      return res.status(error ? 500 : 200).json({ success: !error, error: error?.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
