// ============================================================
//  CALISTO API — ENQUIRIES ENDPOINT (Supabase)
//  POST /api/enquiries   → Public: Submit a contact form
//  GET  /api/enquiries   → Admin: List all enquiries
//  PATCH /api/enquiries  → Admin: Update status (read/unread)
//  DELETE /api/enquiries → Admin: Remove enquiry
// ============================================================

import { createClient } from '@supabase/supabase-js';

const TABLE = 'enquiries';

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
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  const supabase = getSupabase();

  // ── POST: Public submission ──
  if (req.method === 'POST') {
    if (!supabase) return res.status(500).json({ error: 'Database not available' });

    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { name, email, subject, message } = body;

      if (!name || !email) {
        return res.status(400).json({ error: 'Name and Email are required.' });
      }

      const { data, error } = await supabase
        .from(TABLE)
        .insert([{
          name,
          email,
          subject: subject || 'No Subject',
          message: message || '',
          status: 'unread',
          created_at: new Date().toISOString()
        }])
        .select();

      if (error) throw error;

      return res.status(201).json({ success: true, message: 'Enquiry received.', id: data[0].id });
    } catch (err) {
      console.error('Enquiry POST error:', err);
      return res.status(500).json({ error: 'Failed to send enquiry.', details: err.message });
    }
  }

  // ── AUTHENTICATED ADMIN METHODS ──
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) return res.status(401).json({ error: 'Invalid session' });

  // ── GET: List enquiries ──
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from(TABLE)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to fetch enquiries' });
    }
  }

  // ── PATCH: Update status ──
  if (req.method === 'PATCH') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { id, status } = body;

      const { error } = await supabase
        .from(TABLE)
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to update status' });
    }
  }

  // ── DELETE: Remove ──
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
      return res.status(500).json({ error: 'Failed to delete enquiry' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
