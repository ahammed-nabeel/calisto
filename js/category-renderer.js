// ============================================================
//  CALISTO CATEGORY RENDERER  v2
//  Shared renderer for all category, subcategory & product pages
// ============================================================

// ── CATEGORY PAGE (e.g. gates.html) ─────────────────────────
// Shows subcategory cards linking to their dedicated .html pages
function renderCategoryPage(categorySlug) {
  const d = loadProductsData();
  const cat = d.categories.find(c => c.slug === categorySlug);
  if (!cat) return;

  // Section header
  const sectionTitle = document.getElementById('section-title');
  const sectionDesc  = document.getElementById('section-desc');
  if (sectionTitle) sectionTitle.innerHTML = cat.heroTitle + (cat.heroSubtitle ? `<span>${cat.heroSubtitle}</span>` : '');
  if (sectionDesc)  sectionDesc.textContent  = cat.description;

  // Subcategory cards
  const grid = document.getElementById('category-grid');
  if (!grid) return;
  grid.innerHTML = '';

  if (!cat.subcategories || cat.subcategories.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:4rem;color:#64748b"><h3>Coming soon</h3><p>Products will be available shortly.</p></div>`;
    return;
  }

  cat.subcategories.forEach(sc => {
    // Use first item image if available, otherwise hero image
    const firstItemImg = sc.items && sc.items.length > 0 && sc.items[0].images && sc.items[0].images.length > 0
      ? sc.items[0].images[0].url : null;
    const displayImg = firstItemImg || sc.heroImage || cat.heroImage || '';
    const isPhoto = displayImg && (displayImg.startsWith('http') || displayImg.match(/\.(jpg|jpeg|png|webp)/i));

    const card = document.createElement('div');
    card.className = 'automation-card';
    card.innerHTML = `
      <div class="icon-box" style="width:100%;height:160px;margin-bottom:1.5rem;overflow:hidden;border-radius:12px;">
        <img src="${displayImg}" alt="${sc.name}" style="width:100%;height:100%;object-fit:cover;">
      </div>
      <h3>${sc.name}</h3>
      <ul class="automation-list">
        ${sc.items.slice(0, 4).map(it => `<li>${it.name}</li>`).join('')}
        ${sc.items.length === 0 ? '<li>Coming soon</li>' : ''}
      </ul>
      <a href="${sc.pageFile}" class="explore-link">EXPLORE</a>
    `;
    grid.appendChild(card);
  });
}

// ── SUBCATEGORY PAGE (e.g. swing-gate-operators.html) ────────
// Shows product cards linking to product-template.html
function renderSubcategoryPage(categorySlug, subcategorySlug) {
  const d = loadProductsData();
  const cat = d.categories.find(c => c.slug === categorySlug);
  if (!cat) return;
  const sc = cat.subcategories.find(s => s.slug === subcategorySlug);
  if (!sc) return;

  // Section header
  const sectionTitle = document.getElementById('section-title');
  const sectionDesc  = document.getElementById('section-desc');
  if (sectionTitle) sectionTitle.innerHTML = `Our ${sc.name} Models,<span>Engineered for Performance.</span>`;
  if (sectionDesc)  sectionDesc.textContent  = sc.description;

  // Product cards
  const grid = document.getElementById('category-grid');
  if (!grid) return;
  grid.innerHTML = '';

  if (!sc.items || sc.items.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:4rem;color:#64748b"><h3>No products yet</h3><p>Add products via the admin panel.</p></div>`;
    return;
  }

  sc.items.forEach(item => {
    const mainImg = item.images && item.images.length > 0 ? item.images[0].url : sc.heroImage || '';
    const templateUrl = `products/product-template.html?cat=${categorySlug}&sub=${subcategorySlug}&item=${item.slug}`;

    const card = document.createElement('div');
    card.className = 'automation-card';
    card.innerHTML = `
      <div class="icon-box" style="width:100%;height:180px;margin-bottom:1.5rem;overflow:hidden;border-radius:12px;">
        <img src="${mainImg}" alt="${item.name}" style="width:100%;height:100%;object-fit:cover;">
      </div>
      <h3>${item.name}</h3>
      <ul class="automation-list">
        ${(item.highlights || []).map(h => `<li>${h}</li>`).join('')}
        ${(!item.highlights || item.highlights.length === 0) ? '<li>View details</li>' : ''}
      </ul>
      <a href="${templateUrl}" class="explore-link">VIEW DETAILS</a>
    `;
    grid.appendChild(card);
  });
}

// ── PRODUCT PAGE (product-template.html) ─────────────────────
function renderProductPage(categorySlug, subcategorySlug, itemSlug) {
  const d = loadProductsData();
  const cat = d.categories.find(c => c.slug === categorySlug);
  if (!cat) { _showProductError('Category not found.'); return; }
  const sc = cat.subcategories.find(s => s.slug === subcategorySlug);
  if (!sc)  { _showProductError('Subcategory not found.'); return; }
  const item = sc.items.find(i => i.slug === itemSlug);
  if (!item) { _showProductError('Product not found.'); return; }

  // Resolve paths — product pages are inside /products/, assets need ../
  function rp(p) {
    if (!p) return '';
    if (p.startsWith('http') || p.startsWith('/') || p.startsWith('../') || p.startsWith('data:')) return p;
    return '../' + p;
  }

  // Title & meta
  document.title = `Calisto Automation | ${item.name}`;
  const h1 = document.getElementById('product-name');
  if (h1) h1.textContent = item.name;

  // Description
  const desc = document.getElementById('product-description');
  if (desc) desc.innerHTML = item.description || '';

  // Images
  if (item.images && item.images.length > 0) {
    const mainImg = document.getElementById('main-image');
    if (mainImg) mainImg.src = rp(item.images[0].url);

    const thumbs = document.getElementById('image-thumbnails');
    if (thumbs) {
      thumbs.innerHTML = item.images.map((img, i) => `
        <img src="${rp(img.url)}" alt="${img.alt}" class="thumbnail-img ${i === 0 ? 'active' : ''}"
          onclick="changeMainImage(this.src, this)">
      `).join('');
    }

    // Parallax layers
    const l1 = document.querySelector('.layer-1');
    const l2 = document.querySelector('.layer-2');
    if (l1) l1.src = rp(item.images[0].url);
    if (l2) l2.src = rp(item.images[1] ? item.images[1].url : item.images[0].url);
  }

  // Characteristics (pill layout)
  const charContainer = document.getElementById('characteristics-container');
  if (charContainer && item.characteristics && item.characteristics.length > 0) {
    const half  = Math.ceil(item.characteristics.length / 2);
    const left  = item.characteristics.slice(0, half);
    const right = item.characteristics.slice(half);
    const mainImgSrc = item.images && item.images[0] ? rp(item.images[0].url) : '';

    charContainer.innerHTML = `
      <div class="characteristics-col col-left">
        ${left.map(c => `
          <div class="char-pill">
            <span class="char-label">${c.label}</span>
            <div class="char-icon">${_charIcon()}</div>
          </div>`).join('')}
      </div>
      <div class="center-product">
        <img src="${mainImgSrc}" alt="${item.name}">
      </div>
      <div class="characteristics-col col-right">
        ${right.map(c => `
          <div class="char-pill">
            <div class="char-icon">${_charIcon()}</div>
            <span class="char-label">${c.label}</span>
          </div>`).join('')}
      </div>
    `;
  }

  // Specs table
  const specsTable = document.getElementById('specs-table-body');
  if (specsTable) {
    if (item.specs && item.specs.length > 0) {
      specsTable.innerHTML = item.specs.map(s => `<tr><th>${s.param}</th><td>${s.value}</td></tr>`).join('');
    } else {
      const btn = document.getElementById('toggleSpecsBtn');
      if (btn) btn.style.display = 'none';
    }
  }

  // Datasheets / downloads
  const docsGrid = document.getElementById('downloads-grid');
  if (docsGrid && item.datasheets && item.datasheets.length > 0) {
    docsGrid.innerHTML = item.datasheets.map((ds, i) => {
      const file = rp(ds.file);
      const isDrawing = ds.type === 'drawing' || ds.name.toLowerCase().includes('draw') || ds.name.toLowerCase().includes('dimen');
      return `
        <a href="${file || '#'}" class="download-card" id="doc-card-${i}"
          ${!file || isDrawing ? `onclick="openModal('${ds.name}'); return false;"` : 'target="_blank"'}>
          <svg class="download-icon" viewBox="0 0 24 24">
            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
          </svg>
          <span class="download-label">${ds.name}</span>
        </a>
      `;
    }).join('');

    // Wire drawing expansion
    const drawingDs = item.datasheets.find(ds => ds.type === 'drawing' && ds.file);
    if (drawingDs) {
      const idx = item.datasheets.indexOf(drawingDs);
      const drawingCard = document.getElementById(`doc-card-${idx}`);
      const drawingExpansion = document.getElementById('drawingExpansion');
      const drawingImg = document.getElementById('drawing-img');
      if (drawingCard && drawingExpansion) {
        if (drawingImg) drawingImg.src = rp(drawingDs.file);
        drawingCard.onclick = (e) => {
          e.preventDefault();
          drawingExpansion.classList.toggle('open');
          if (drawingExpansion.classList.contains('open')) {
            setTimeout(() => drawingExpansion.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
          }
        };
      }
    }
  }

  // Features description
  const featDesc = document.getElementById('chars-description') || document.getElementById('features-description');
  if (featDesc) featDesc.textContent = item.shortDescription || '';
}

function _charIcon() {
  return `<svg viewBox="0 0 24 24" style="width:28px;height:28px;fill:var(--accent)"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`;
}

function _showProductError(msg) {
  const main = document.querySelector('main');
  if (main) main.innerHTML = `<div style="text-align:center;padding:6rem 2rem;color:#64748b"><h2>Product not found</h2><p>${msg}</p><a href="../gates.html" style="color:#005cb9">← Back to catalog</a></div>`;
}
