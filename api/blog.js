// ============================================================
//  CALISTO API — BLOG ENDPOINT (Supabase)
//  GET  /api/blog  → Returns blog posts (Public: only published, Admin: all)
//  POST /api/blog  → Admin: Create/Update post (auth required)
//  DELETE /api/blog → Admin: Delete post (auth required)
// ============================================================

import { createClient } from '@supabase/supabase-js';

const TABLE = 'blog_posts';

function getSupabase() {
  let url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  url = url.replace(/\/$/, "").replace(/\/rest\/v1$/, "").replace(/\/auth\/v1$/, "");
  return createClient(url, key);
}

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  const supabase = getSupabase();

  // ── GET: Return blog posts ──
  if (req.method === 'GET') {
    if (!supabase) return res.status(200).json([]);

    const authHeader = req.headers.authorization || '';
    const isAdmin = authHeader.includes('Bearer ');

    try {
      let query = supabase.from(TABLE).select('*').order('created_at', { ascending: false });

      if (!isAdmin) {
        query = query.eq('published', true);
      }

      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json(data || []);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to fetch blog posts' });
    }
  }

  // ── AUTHENTICATED ADMIN METHODS ──
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) return res.status(401).json({ error: 'Invalid session' });

  // ── POST: Create/Update post ──
  if (req.method === 'POST') {
    try {
      const post = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      
      const { data, error } = await supabase
        .from(TABLE)
        .upsert({
          ...post,
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' })
        .select();

      if (error) throw error;
      return res.status(200).json({ success: true, post: data[0] });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to save post', details: err.message });
    }
  }

  // ── DELETE: Remove post ──
  if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      const { error } = await supabase
        .from(TABLE)
        .delete()
        .eq('id', id);

      if (error) throw error;
      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to delete post' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
