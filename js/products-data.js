// ============================================================
//  CALISTO PRODUCTS DATA STORE  v2
//  Edit via Admin Panel at /admin/ — Export to overwrite this file
// ============================================================

const CALISTO_PRODUCTS = {
  categories: [
    // ── GATES ────────────────────────────────────────────────
    {
      id: "gates",
      name: "Gates",
      slug: "gates",
      description: "Discover our specialized range of gate automation solutions designed for seamless operation and long-lasting performance.",
      heroTitle: "Gate Automation Systems,",
      heroSubtitle: "Engineered for Reliability.",
      heroImage: "https://images.unsplash.com/photo-1558002038-1091a16606f3?auto=format&fit=crop&w=1920&q=80",
      pageFile: "gates.html",
      subcategories: [
        {
          id: "swing-gate-operators",
          name: "Swing Gate Operators",
          slug: "swing-gate-operators",
          description: "Choose from our wide range of operators designed to suit different gate weights, lengths, and usage frequencies.",
          heroImage: "https://images.unsplash.com/photo-1558002038-1091a16606f3?auto=format&fit=crop&w=1920&q=80",
          heroSubtitle: "Premium automation solutions for residential and industrial swing gates.",
          pageFile: "swing-gate-operators.html",
          items: [
            {
              id: "vortex-calarm-350",
              name: "Vortex CALARM 350",
              slug: "vortex-calarm-350",
              shortDescription: "Articulated arm operator for large pillars with smooth movement.",
              description: "<p><strong>Vortex CALARM 350</strong> was developed to automate swing gates, available in <strong>230V</strong>, <strong>110V</strong> and <strong>24V</strong>, featuring screw driven piston precision for maximum reliability.</p><p>With a consumption of just <strong>2A</strong>, this motor minimizes environmental impact, in line with the search for energy-responsible solutions.</p><p>In addition to being practical, safe and powerful, it features <strong>slow start and stop</strong> technology for smooth operation and no inertia.</p>",
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
          id: "sliding-gate-operators",
          name: "Sliding Gate Operators",
          slug: "sliding-gate-operators",
          description: "High-performance sliding gate systems for residential and commercial applications.",
          heroImage: "https://images.unsplash.com/photo-1558002038-1091a16606f3?auto=format&fit=crop&w=1920&q=80",
          heroSubtitle: "Powerful sliding gate automation for any property.",
          pageFile: "sliding-gate-operators.html",
          items: []
        }
      ]
    },

    // ── ROLLING SHUTTERS ──────────────────────────────────────
    {
      id: "rolling-shutters",
      name: "Rolling Shutters",
      slug: "rolling-shutters",
      description: "Enhance your privacy and security with our advanced rolling shutter and curtain automation solutions.",
      heroTitle: "Smart Rolling Shutters,",
      heroSubtitle: "Specialized for Control.",
      heroImage: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1920&q=80",
      pageFile: "rolling-shutters.html",
      subcategories: [
        {
          id: "rolling-shutter-operators",
          name: "Rolling Shutter Operators",
          slug: "rolling-shutter-operators",
          description: "Advanced tubular and central motor systems for rolling shutters and curtains.",
          heroImage: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1920&q=80",
          heroSubtitle: "Precision tubular motors for reliable shutter control.",
          pageFile: "rolling-shutter-operators.html",
          items: []
        },
        {
          id: "curtain-operators",
          name: "Curtain Operators",
          slug: "curtain-operators",
          description: "Motorized curtain and drapery systems with remote control.",
          heroImage: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1920&q=80",
          heroSubtitle: "Elegant motorized curtain systems for modern interiors.",
          pageFile: "curtain-operators.html",
          items: []
        }
      ]
    },

    // ── AUTOMATIC DOORS ───────────────────────────────────────
    {
      id: "automatic-doors",
      name: "Automatic Doors",
      slug: "automatic-doors",
      description: "Smart door automation for residential, commercial, and industrial spaces.",
      heroTitle: "Automatic Door Systems,",
      heroSubtitle: "Opening New Possibilities.",
      heroImage: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1920&q=80",
      pageFile: "automatic-doors.html",
      subcategories: [
        {
          id: "sliding-door-operators",
          name: "Sliding Door Operators",
          slug: "sliding-door-operators",
          description: "Smooth, quiet automatic sliding door systems for commercial and residential use.",
          heroImage: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1920&q=80",
          heroSubtitle: "Touch-free access with precision sliding door automation.",
          pageFile: "sliding-door-operators.html",
          items: []
        },
        {
          id: "swing-door-operators",
          name: "Swing Door Operators",
          slug: "swing-door-operators",
          description: "Automated swing door systems for accessible and hygienic entry points.",
          heroImage: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1920&q=80",
          heroSubtitle: "Reliable automated swing doors for every environment.",
          pageFile: "swing-door-operators.html",
          items: []
        }
      ]
    },

    // ── WINDOW SYSTEMS ────────────────────────────────────────
    {
      id: "window-systems",
      name: "Window Systems",
      slug: "window-systems",
      description: "Intelligent window automation for comfort, ventilation, and energy efficiency.",
      heroTitle: "Window Automation,",
      heroSubtitle: "Comfort at Your Command.",
      heroImage: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1920&q=80",
      pageFile: "window-systems.html",
      subcategories: [
        {
          id: "window-operators",
          name: "Window Operators",
          slug: "window-operators",
          description: "Motorized window openers for roof, awning, casement, and tilt-and-turn windows.",
          heroImage: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1920&q=80",
          heroSubtitle: "Smart window control for ventilation and energy efficiency.",
          pageFile: "window-operators.html",
          items: []
        },
        {
          id: "awning-operators",
          name: "Awning Operators",
          slug: "awning-operators",
          description: "Motorized awning and blind systems for outdoor comfort and sun control.",
          heroImage: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1920&q=80",
          heroSubtitle: "Automated awnings for shade, comfort, and style.",
          pageFile: "awning-operators.html",
          items: []
        }
      ]
    }
  ]
};

// ── Helpers ──────────────────────────────────────────────────
function getCategoryBySlug(slug) {
  return loadProductsData().categories.find(c => c.slug === slug);
}

function getSubcategoryBySlug(categorySlug, subcatSlug) {
  const cat = getCategoryBySlug(categorySlug);
  if (!cat) return null;
  return cat.subcategories.find(s => s.slug === subcatSlug);
}

function getItemBySlug(categorySlug, subcatSlug, itemSlug) {
  const subcat = getSubcategoryBySlug(categorySlug, subcatSlug);
  if (!subcat) return null;
  return subcat.items.find(i => i.slug === itemSlug);
}

function saveProductsData(data) {
  localStorage.setItem('calisto_products', JSON.stringify(data));
}

function loadProductsData() {
  const saved = localStorage.getItem('calisto_products');
  if (saved) {
    try { return JSON.parse(saved); } catch(e) {}
  }
  return CALISTO_PRODUCTS;
}
