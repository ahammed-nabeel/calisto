// ============================================================
//  CALISTO PRODUCTS DATA STORE
//  Edit this file directly OR use the Admin Panel at /admin/
// ============================================================

const CALISTO_PRODUCTS = {
  categories: [
    {
      id: "gates",
      name: "Gates",
      slug: "gates",
      description: "Discover our specialized range of gate automation solutions designed for seamless operation and long-lasting performance.",
      heroTitle: "Gate Automation Systems,",
      heroSubtitle: "Engineered for Reliability.",
      icon: "assets/swing-auto.svg",
      pageFile: "gates.html",
      subcategories: [
        {
          id: "swing-gate-operators",
          name: "Swing Gate Operators",
          slug: "swing-gate-operators",
          description: "Choose from our wide range of operators designed to suit different gate weights, lengths, and usage frequencies.",
          icon: "assets/swing-auto.svg",
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
          icon: "assets/sliding-auto.svg",
          pageFile: "sliding-gate-operators.html",
          items: []
        }
      ]
    },
    {
      id: "rolling-shutters",
      name: "Rolling Shutters",
      slug: "rolling-shutters",
      description: "Enhance your privacy and security with our advanced rolling shutter and curtain automation solutions.",
      heroTitle: "Smart Rolling Shutters,",
      heroSubtitle: "Specialized for Control.",
      icon: "assets/shutter-auto.svg",
      pageFile: "rolling-shutters.html",
      subcategories: [
        {
          id: "rolling-shutter-operators",
          name: "Rolling Shutter Operators",
          slug: "rolling-shutter-operators",
          description: "Advanced tubular and central motor systems for rolling shutters.",
          icon: "assets/shutter-auto.svg",
          pageFile: "rolling-shutter-operators.html",
          items: []
        },
        {
          id: "curtain-operators",
          name: "Curtain Operators",
          slug: "curtain-operators",
          description: "Motorized curtain and drapery systems with remote control.",
          icon: "assets/curtain-auto.svg",
          pageFile: "curtain-operators.html",
          items: []
        }
      ]
    },
    {
      id: "automatic-doors",
      name: "Automatic Doors",
      slug: "automatic-doors",
      description: "Smart door automation for residential, commercial, and industrial spaces.",
      heroTitle: "Automatic Door Systems,",
      heroSubtitle: "Opening New Possibilities.",
      icon: "assets/door-auto.svg",
      pageFile: "automatic-doors.html",
      subcategories: []
    },
    {
      id: "window-systems",
      name: "Window Systems",
      slug: "window-systems",
      description: "Intelligent window automation for comfort, ventilation, and energy efficiency.",
      heroTitle: "Window Automation,",
      heroSubtitle: "Comfort at Your Command.",
      icon: "assets/window-auto.svg",
      pageFile: "window-systems.html",
      subcategories: []
    }
  ]
};

// Helper: find category by slug
function getCategoryBySlug(slug) {
  return CALISTO_PRODUCTS.categories.find(c => c.slug === slug);
}

// Helper: find subcategory by slug within a category
function getSubcategoryBySlug(categorySlug, subcatSlug) {
  const cat = getCategoryBySlug(categorySlug);
  if (!cat) return null;
  return cat.subcategories.find(s => s.slug === subcatSlug);
}

// Helper: find item by slug within a subcategory
function getItemBySlug(categorySlug, subcatSlug, itemSlug) {
  const subcat = getSubcategoryBySlug(categorySlug, subcatSlug);
  if (!subcat) return null;
  return subcat.items.find(i => i.slug === itemSlug);
}

// Save to localStorage (used by admin panel)
function saveProductsData(data) {
  localStorage.setItem('calisto_products', JSON.stringify(data));
}

// Load from localStorage (overrides default if admin has made changes)
function loadProductsData() {
  const saved = localStorage.getItem('calisto_products');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch(e) {
      return CALISTO_PRODUCTS;
    }
  }
  return CALISTO_PRODUCTS;
}
