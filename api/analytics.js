import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req, res) {
  const { method } = req;

  if (method === 'POST') {
    // Record a visit (Public)
    const { path } = req.body;
    try {
      const { error } = await supabase
        .from('site_visits')
        .insert([{ page_path: path || 'unknown' }]);
      
      if (error) throw error;
      return res.status(200).json({ success: true });
    } catch (err) {
      // Silently fail for tracking to not break the user experience
      console.error('Tracking error:', err.message);
      return res.status(200).json({ success: false });
    }
  }

  if (method === 'GET') {
    // Get stats (Admin only)
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token' });

    const token = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) return res.status(401).json({ error: 'Invalid token' });

    try {
      const { count, error } = await supabase
        .from('site_visits')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      return res.status(200).json({ total_visits: count });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
