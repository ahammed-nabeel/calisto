// ============================================================
//  CALISTO API — SEO SETTINGS ENDPOINT (Supabase)
//  GET  /api/seo  → Returns SEO settings from Supabase
//  POST /api/seo  → Saves SEO settings to Supabase (auth required)
// ============================================================

import { createClient } from '@supabase/supabase-js';

const TABLE = 'catalog_data';
const SEO_KEY = 'seo_settings';

function getSupabase() {
  let url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  url = url.replace(/\/$/, "").replace(/\/rest\/v1$/, "").replace(/\/auth\/v1$/, "");
  return createClient(url, key);
}

// ── Default SEO metadata (Fallback) ──
const DEFAULT_SEO = [
  { file: 'index.html', label: 'Home', title: 'Calisto Automation | Precision Engineering', desc: 'Global leader in gate, door, and shutter automation. Headquartered in Taiwan.', kw: 'gate automation, door opener, calisto taiwan' },
  { file: 'about.html', label: 'About', title: 'Our Story | Calisto Automation', desc: 'Learn about Calisto\'s history, mission, and commitment to precision engineering.', kw: 'about calisto, automation company taiwan' },
  { file: 'contact.html', label: 'Contact', title: 'Contact Us | Calisto Automation', desc: 'Get in touch with our global team for support and sales.', kw: 'contact calisto, support' }
];

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  const supabase = getSupabase();

  // ── GET: Return SEO settings ──
  if (req.method === 'GET') {
    if (!supabase) return res.status(200).json(DEFAULT_SEO);

    try {
      const { data, error } = await supabase
        .from(TABLE)
        .select('data')
        .eq('key', SEO_KEY)
        .single();

      if (error || !data) {
        // Seed if missing
        await supabase.from(TABLE).upsert({
          key: SEO_KEY,
          data: DEFAULT_SEO,
          updated_at: new Date().toISOString()
        }, { onConflict: 'key' });
        return res.status(200).json(DEFAULT_SEO);
      }
      return res.status(200).json(data.data);
    } catch (err) {
      return res.status(200).json(DEFAULT_SEO);
    }
  }

  // ── POST: Save SEO settings (auth required) ──
  if (req.method === 'POST') {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Missing auth token.' });

    if (!supabase) return res.status(500).json({ error: 'Database configuration missing.' });

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) return res.status(401).json({ error: 'Invalid session.' });

    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      
      const { error: upsertError } = await supabase.from(TABLE).upsert({
        key: SEO_KEY,
        data: body,
        updated_at: new Date().toISOString()
      }, { onConflict: 'key' });

      if (upsertError) throw upsertError;

      return res.status(200).json({ success: true, message: 'SEO settings saved.' });
    } catch (err) {
      return res.status(500).json({ error: 'API Error', details: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
