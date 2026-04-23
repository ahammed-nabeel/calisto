// ============================================================
//  CALISTO API — PRODUCTS ENDPOINT (Supabase)
//  GET  /api/products  → Returns product catalog from Supabase
//  POST /api/products  → Saves product catalog to Supabase (auth required)
// ============================================================

import { createClient } from '@supabase/supabase-js';

const TABLE = 'catalog_data';
const CATALOG_KEY = 'products';

function getSupabase() {
  let url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY; // Server-side only — never expose!
  if (!url || !key) return null;
  // Clean trailing parts
  url = url.replace(/\/$/, "");
  url = url.replace(/\/rest\/v1$/, "");
  url = url.replace(/\/auth\/v1$/, "");
  return createClient(url, key);
}

// ── Seed data — used when Supabase is empty (first deploy) ──
const SEED_DATA = {
  categories: [
    {
      id: "gates", name: "Gates", slug: "gates",
      description: "Discover our specialized range of gate automation solutions designed for seamless operation and long-lasting performance.",
      heroTitle: "Gate Automation Systems,", heroSubtitle: "Engineered for Reliability.",
      heroImage: "https://images.unsplash.com/photo-1558002038-1091a16606f3?auto=format&fit=crop&w=1920&q=80",
      pageFile: "gates.html",
      subcategories: [
        {
          id: "swing-gate-operators", name: "Swing Gate Operators", slug: "swing-gate-operators",
          description: "Choose from our wide range of operators designed to suit different gate weights, lengths, and usage frequencies.",
          heroImage: "https://images.unsplash.com/photo-1558002038-1091a16606f3?auto=format&fit=crop&w=1920&q=80",
          heroSubtitle: "Premium automation solutions for residential and industrial swing gates.",
          pageFile: "swing-gate-operators.html",
          items: [
            {
              id: "vortex-calarm-350", name: "Vortex CALARM 350", slug: "vortex-calarm-350",
              shortDescription: "Articulated arm operator for large pillars with smooth movement.",
              description: "<p><strong>Vortex CALARM 350</strong> was developed to automate swing gates, available in <strong>230V</strong>, <strong>110V</strong> and <strong>24V</strong>, featuring screw driven piston precision for maximum reliability.</p>",
              highlights: ["Articulated arm", "For large pillars", "Smooth movement"],
              characteristics: [
                { label: "DC motor & Backup Battery", icon: "battery" },
                { label: "Smart Stop-on-Obstacle", icon: "shield" },
                { label: "Slow Start/Stop Operation", icon: "play" },
                { label: "Auto Closing Function", icon: "refresh" },
                { label: "Access Control Support", icon: "lock" },
                { label: "WIFI Function (Optional)", icon: "wifi" }
              ],
              specs: [
                { param: "Unit Model", value: "SW300DC" },
                { param: "Power Supply", value: "AC220V/50Hz ; AC110V/60Hz" },
                { param: "Maximum Loading Weight", value: "300 KG / Leaf" },
                { param: "Motor Power", value: "DC24V / 50W" },
                { param: "Driving Method", value: "Screw driven piston type" },
                { param: "Limit Switch", value: "Electromechanical limit switch / hall sensor" },
                { param: "Max Single-Leaf Length", value: "3.0 m" },
                { param: "Gate Moving Speed", value: "2.5 cm/s" },
                { param: "Remote Control Range", value: "≥ 30 m" },
                { param: "Recording of Up Remotes", value: "32" },
                { param: "Remote Frequency", value: "433.92 MHz" },
                { param: "Work Duty", value: "S2, 30 min" },
                { param: "Working Temperature", value: "-20°C ~ 70°C" },
                { param: "Package Weight", value: "15 KG" }
              ],
              images: [
                { url: "assets/Vortex CALARM 350.jpeg", alt: "Vortex CALARM 350 Main" },
                { url: "assets/Vortex CALARM 350 (2).jpeg", alt: "Vortex CALARM 350 Detail 1" },
                { url: "assets/Vortex CALARM 350 (3).jpeg", alt: "Vortex CALARM 350 Detail 2" },
                { url: "assets/Vortex CALARM 350 (4).jpeg", alt: "Vortex CALARM 350 Detail 3" }
              ],
              datasheets: [
                { name: "Product Brochure", file: "", type: "brochure" },
                { name: "Installation Manual", file: "", type: "manual" },
                { name: "Technical Drawings", file: "assets/vortex-specs.png", type: "drawing" }
              ]
            }
          ]
        },
        {
          id: "sliding-gate-operators", name: "Sliding Gate Operators", slug: "sliding-gate-operators",
          description: "High-performance sliding gate systems for residential and commercial applications.",
          heroImage: "https://images.unsplash.com/photo-1558002038-1091a16606f3?auto=format&fit=crop&w=1920&q=80",
          heroSubtitle: "Powerful sliding gate automation for any property.",
          pageFile: "sliding-gate-operators.html", items: []
        }
      ]
    },
    {
      id: "rolling-shutters", name: "Rolling Shutters", slug: "rolling-shutters",
      description: "Enhance your privacy and security with our advanced rolling shutter and curtain automation solutions.",
      heroTitle: "Smart Rolling Shutters,", heroSubtitle: "Specialized for Control.",
      heroImage: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1920&q=80",
      pageFile: "rolling-shutters.html",
      subcategories: [
        { id: "rolling-shutter-operators", name: "Rolling Shutter Operators", slug: "rolling-shutter-operators", description: "Advanced tubular and central motor systems.", heroImage: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1920&q=80", heroSubtitle: "Precision tubular motors for reliable shutter control.", pageFile: "rolling-shutter-operators.html", items: [] },
        { id: "curtain-operators", name: "Curtain Operators", slug: "curtain-operators", description: "Motorized curtain and drapery systems with remote control.", heroImage: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1920&q=80", heroSubtitle: "Elegant motorized curtain systems for modern interiors.", pageFile: "curtain-operators.html", items: [] }
      ]
    },
    {
      id: "automatic-doors", name: "Automatic Doors", slug: "automatic-doors",
      description: "Smart door automation for residential, commercial, and industrial spaces.",
      heroTitle: "Automatic Door Systems,", heroSubtitle: "Opening New Possibilities.",
      heroImage: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1920&q=80",
      pageFile: "automatic-doors.html",
      subcategories: [
        { id: "sliding-door-operators", name: "Sliding Door Operators", slug: "sliding-door-operators", description: "Smooth, quiet automatic sliding door systems.", heroImage: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1920&q=80", heroSubtitle: "Touch-free access with precision sliding door automation.", pageFile: "sliding-door-operators.html", items: [] },
        { id: "swing-door-operators", name: "Swing Door Operators", slug: "swing-door-operators", description: "Automated swing door systems for accessible entry points.", heroImage: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1920&q=80", heroSubtitle: "Reliable automated swing doors for every environment.", pageFile: "swing-door-operators.html", items: [] }
      ]
    },
    {
      id: "window-systems", name: "Window Systems", slug: "window-systems",
      description: "Intelligent window automation for comfort, ventilation, and energy efficiency.",
      heroTitle: "Window Automation,", heroSubtitle: "Comfort at Your Command.",
      heroImage: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1920&q=80",
      pageFile: "window-systems.html",
      subcategories: [
        { id: "window-operators", name: "Window Operators", slug: "window-operators", description: "Motorized window openers for roof, awning, and casement windows.", heroImage: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1920&q=80", heroSubtitle: "Smart window control for ventilation and energy efficiency.", pageFile: "window-operators.html", items: [] },
        { id: "awning-operators", name: "Awning Operators", slug: "awning-operators", description: "Motorized awning and blind systems for outdoor comfort.", heroImage: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1920&q=80", heroSubtitle: "Automated awnings for shade, comfort, and style.", pageFile: "awning-operators.html", items: [] }
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

  // ── GET: Return product catalog ──
  if (req.method === 'GET') {
    if (!supabase) {
      return res.status(200).json(SEED_DATA);
    }

    try {
      const { data, error } = await supabase
        .from(TABLE)
        .select('data')
        .eq('key', CATALOG_KEY)
        .single();

      if (error || !data) {
        // Try to seed if table exists but key is missing
        const { error: seedError } = await supabase.from(TABLE).upsert({
          key: CATALOG_KEY,
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

  // ── POST: Save product catalog (auth required) ──
  if (req.method === 'POST') {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Missing auth token.' });
    }

    if (!supabase) {
      return res.status(500).json({ error: 'Database configuration missing (Check SUPABASE_SERVICE_ROLE_KEY).' });
    }

    // Verify the user's JWT with Supabase
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid session. Please logout and login again.' });
    }

    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

      if (!body || !body.categories) {
        return res.status(400).json({ error: 'Invalid data format.' });
      }

      const { error: upsertError } = await supabase.from(TABLE).upsert({
        key: CATALOG_KEY,
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
        message: 'Product catalog saved & published.',
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      console.error('Save error:', err);
      return res.status(500).json({ error: 'API Error while saving.', details: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
