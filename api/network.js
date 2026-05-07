// ============================================================
//  CALISTO API — NETWORK ENDPOINT (Supabase)
//  GET  /api/network  → Returns network data from Supabase
//  POST /api/network  → Saves network data to Supabase (auth required)
// ============================================================

import { createClient } from '@supabase/supabase-js';

const TABLE = 'catalog_data';
const NETWORK_KEY = 'network';

function getSupabase() {
  let url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY; // Server-side only
  if (!url || !key) return null;
  url = url.replace(/\/$/, "");
  url = url.replace(/\/rest\/v1$/, "");
  url = url.replace(/\/auth\/v1$/, "");
  return createClient(url, key);
}

// ── Seed data ──
const SEED_DATA = {
  continents: [
    {
      id: "europe",
      name: "Europe",
      regions: [
        {
          id: "france",
          name: "France",
          dealers: [
            {
              id: "france-paris",
              city: "Paris",
              name: "Calisto France SAS",
              email: "contact@calisto.fr",
              phone: "+33 1 23 45 67 89",
              serviceCenters: []
            }
          ]
        },
        {
          id: "germany",
          name: "Germany",
          dealers: [
            {
              id: "germany-munich",
              city: "Munich",
              name: "AutoTeck GmbH",
              email: "info@autoteck.de",
              phone: "+49 89 123456",
              serviceCenters: []
            }
          ]
        },
        {
          id: "uk",
          name: "United Kingdom",
          dealers: [
            {
              id: "uk-london",
              city: "London",
              name: "Calisto UK Ltd",
              email: "sales@calisto.co.uk",
              phone: "+44 20 7123 4567",
              serviceCenters: []
            }
          ]
        }
      ]
    },
    {
      id: "americas",
      name: "Americas",
      regions: [
        {
          id: "usa",
          name: "USA",
          dealers: [
            {
              id: "usa-newyork",
              city: "New York",
              name: "Calisto North America Inc.",
              email: "usa@calistotech.com",
              phone: "+1 212 555 0199",
              serviceCenters: []
            }
          ]
        },
        {
          id: "canada",
          name: "Canada",
          dealers: [
            {
              id: "canada-toronto",
              city: "Toronto",
              name: "Maple Automation",
              email: "info@mapleauto.ca",
              phone: "",
              serviceCenters: []
            }
          ]
        },
        {
          id: "brazil",
          name: "Brazil",
          dealers: [
            {
              id: "brazil-saopaulo",
              city: "São Paulo",
              name: "Calisto Brasil Ltda",
              email: "contato@calistobrasil.com.br",
              phone: "",
              serviceCenters: []
            }
          ]
        }
      ]
    },
    {
      id: "asia-pacific",
      name: "Asia & Pacific",
      regions: [
        {
          id: "australia",
          name: "Australia",
          dealers: [
            {
              id: "aus-sydney",
              city: "Sydney",
              name: "Oz Automation Pty Ltd",
              email: "sales@ozautomation.com.au",
              phone: "",
              serviceCenters: []
            }
          ]
        },
        {
          id: "japan",
          name: "Japan",
          dealers: [
            {
              id: "jp-tokyo",
              city: "Tokyo",
              name: "Calisto Japan KK",
              email: "info@calisto.jp",
              phone: "+81 3 1234 5678",
              serviceCenters: []
            }
          ]
        },
        {
          id: "india",
          name: "India",
          dealers: [
            {
              id: "in-bangalore",
              city: "Bangalore",
              name: "Calisto India",
              email: "support@calisto.in",
              phone: "",
              serviceCenters: []
            }
          ]
        }
      ]
    }
  ]
};

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

  // ── GET: Return network data ──
  if (req.method === 'GET') {
    if (!supabase) {
      return res.status(200).json(SEED_DATA);
    }

    try {
      const { data, error } = await supabase
        .from(TABLE)
        .select('data')
        .eq('key', NETWORK_KEY)
        .single();

      if (error || !data) {
        // Try to seed if table exists but key is missing
        const { error: seedError } = await supabase.from(TABLE).upsert({
          key: NETWORK_KEY,
          data: SEED_DATA,
          updated_at: new Date().toISOString()
        }, { onConflict: 'key' });
        
        return res.status(200).json(SEED_DATA);
      }

      return res.status(200).json(data.data);
    } catch (err) {
      console.error('Supabase GET error:', err);
      return res.status(200).json(SEED_DATA);
    }
  }

  // ── POST: Save network data (auth required) ──
  if (req.method === 'POST') {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Missing auth token.' });
    }

    if (!supabase) {
      return res.status(500).json({ error: 'Database configuration missing.' });
    }

    // Verify the user's JWT with Supabase
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid session. Please logout and login again.' });
    }

    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

      if (!body || !body.continents) {
        return res.status(400).json({ error: 'Invalid data format.' });
      }

      const { error: upsertError } = await supabase.from(TABLE).upsert({
        key: NETWORK_KEY,
        data: body,
        updated_at: new Date().toISOString()
      }, { onConflict: 'key' });

      if (upsertError) {
        console.error('Supabase upsert error:', upsertError);
        return res.status(500).json({ 
            error: 'Save failed', 
            details: upsertError.message,
            code: upsertError.code 
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Network data saved & published.',
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      console.error('Save error:', err);
      return res.status(500).json({ error: 'API Error while saving.', details: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
