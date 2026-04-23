// ============================================================
//  CALISTO API — AUTH ENDPOINT (Supabase Auth)
//  POST /api/auth  → Sign in with Supabase Auth, returns JWT
// ============================================================

import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  let url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY; // Safe for auth operations
  if (!url || !key) return null;
  // Clean trailing parts
  url = url.replace(/\/$/, "");
  url = url.replace(/\/rest\/v1$/, "");
  url = url.replace(/\/auth\/v1$/, "");
  return createClient(url, key);
}

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabase = getSupabase();
    const supUrl = process.env.SUPABASE_URL || '';

    // Safety check for body
    if (!req.body) {
       return res.status(400).json({ error: 'Request body is empty.' });
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { email, password } = body || {};

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    if (!supabase) {
      return res.status(500).json({ 
        error: 'Supabase configuration missing.',
        details: `URL: ${supUrl ? 'Set' : 'Missing'} | Key: ${process.env.SUPABASE_ANON_KEY ? 'Set' : 'Missing'}`
      });
    }

    // Sign in with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      const debug = supUrl ? `${supUrl.substring(0, 15)}...${supUrl.slice(-5)}` : 'MISSING';
      return res.status(401).json({ 
        success: false, 
        error: error.message,
        debugUrl: debug 
      });
    }

    return res.status(200).json({
      success: true,
      token: data.session.access_token,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name || data.user.email.split('@')[0],
        role: 'superadmin',
        avatar: (data.user.user_metadata?.name || data.user.email)[0].toUpperCase()
      }
    });
  } catch (err) {
    console.error('Auth error:', err);
    return res.status(500).json({ 
      error: 'API Execution Error', 
      details: err.message, 
      stack: err.stack ? err.stack.split('\n')[0] : '' 
    });
  }
}
