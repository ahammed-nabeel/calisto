// ============================================================
//  DYNAMIC CATEGORY PAGE RENDERER
//  Include this + products-data.js on any category/subcategory page
// ============================================================

function renderCategoryPage(categorySlug) {
  const d = loadProductsData();
  const cat = d.categories.find(c => c.slug === categorySlug);
  if (!cat) return;

  // Update hero
  const heroTitle = document.getElementById('hero-title');
  const heroSubtitle = document.getElementById('hero-subtitle');
  if (heroTitle) heroTitle.innerHTML = cat.heroTitle + (cat.heroSubtitle ? `<span>${cat.heroSubtitle}</span>` : '');
  if (heroSubtitle) heroSubtitle.textContent = cat.description;

  // Update section header
  const sectionTitle = document.getElementById('section-title');
  const sectionDesc = document.getElementById('section-desc');
  if (sectionTitle) sectionTitle.innerHTML = cat.heroTitle + (cat.heroSubtitle ? `<span>${cat.heroSubtitle}</span>` : '');
  if (sectionDesc) sectionDesc.textContent = cat.description;

  // Render subcategory cards
  const grid = document.getElementById('category-grid');
  if (!grid) return;
  grid.innerHTML = '';
  cat.subcategories.forEach(sc => {
    const card = document.createElement('div');
    card.className = 'automation-card';
    card.innerHTML = `
      <div class="icon-box">
        <img src="${sc.icon || cat.icon}" alt="${sc.name}" style="width:100%;height:100%;">
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

function renderSubcategoryPage(categorySlug, subcategorySlug) {
  const d = loadProductsData();
  const cat = d.categories.find(c => c.slug === categorySlug);
  if (!cat) return;
  const sc = cat.subcategories.find(s => s.slug === subcategorySlug);
  if (!sc) return;

  // Section header
  const sectionTitle = document.getElementById('section-title');
  const sectionDesc = document.getElementById('section-desc');
  if (sectionTitle) sectionTitle.innerHTML = `Our ${sc.name} Models,<span>Engineered for Performance.</span>`;
  if (sectionDesc) sectionDesc.textContent = sc.description;

  // Render product cards
  const grid = document.getElementById('category-grid');
  if (!grid) return;
  grid.innerHTML = '';

  if (sc.items.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:4rem;color:#64748b"><h3>No products yet</h3><p>Add products from the admin panel.</p></div>`;
    return;
  }

  sc.items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'automation-card';
    const mainImg = item.images && item.images.length > 0 ? item.images[0].url : (sc.icon || cat.icon || '');
    const isImg = mainImg && !mainImg.endsWith('.svg');
    // Use dedicated page if it exists, otherwise fall back to the template
    const detailUrl = `products/${item.slug}.html`;
    const templateUrl = `products/product-template.html?cat=${categorySlug}&sub=${subcategorySlug}&item=${item.slug}`;
    card.innerHTML = `
      <div class="icon-box">
        <img src="${mainImg}" alt="${item.name}" style="width:100%;height:100%;${isImg ? 'object-fit:cover;border-radius:8px;' : ''}">
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

function renderProductPage(categorySlug, subcategorySlug, itemSlug) {
  const d = loadProductsData();
  const cat = d.categories.find(c => c.slug === categorySlug);
  if (!cat) return;
  const sc = cat.subcategories.find(s => s.slug === subcategorySlug);
  if (!sc) return;
  const item = sc.items.find(i => i.slug === itemSlug);
  if (!item) return;

  // Product pages live in /products/, assets need ../prefix
  function resolvePath(p) {
    if (!p) return '';
    if (p.startsWith('http') || p.startsWith('/') || p.startsWith('../') || p.startsWith('data:')) return p;
    return '../' + p;
  }

  // Title
  document.title = `Calisto Automation | ${item.name}`;
  const h1 = document.getElementById('product-name');
  if (h1) h1.textContent = item.name;

  // Description
  const desc = document.getElementById('product-description');
  if (desc) desc.innerHTML = item.description || '';

  // Images
  if (item.images && item.images.length > 0) {
    const mainImg = document.getElementById('main-image');
    if (mainImg) mainImg.src = resolvePath(item.images[0].url);
    const thumbs = document.getElementById('image-thumbnails');
    if (thumbs) {
      thumbs.innerHTML = item.images.map((img, i) => `
        <img src="${resolvePath(img.url)}" alt="${img.alt}" class="thumbnail-img ${i === 0 ? 'active' : ''}"
          onclick="changeMainImage(this.src, this)">
      `).join('');
    }
    // Parallax layers
    const l1 = document.querySelector('.layer-1');
    const l2 = document.querySelector('.layer-2');
    if (l1 && item.images[0]) l1.src = resolvePath(item.images[0].url);
    if (l2 && item.images[1]) l2.src = resolvePath(item.images[1].url);
    else if (l2 && item.images[0]) l2.src = resolvePath(item.images[0].url);
  }

  // Characteristics
  const charContainer = document.getElementById('characteristics-container');
  if (charContainer && item.characteristics && item.characteristics.length > 0) {
    const half = Math.ceil(item.characteristics.length / 2);
    const left = item.characteristics.slice(0, half);
    const right = item.characteristics.slice(half);
    const mainImgSrc = item.images && item.images[0] ? resolvePath(item.images[0].url) : '';
    charContainer.innerHTML = `
      <div class="characteristics-col col-left">
        ${left.map(c => `
          <div class="char-pill">
            <span class="char-label">${c.label}</span>
            <div class="char-icon">${getCharIcon()}</div>
          </div>`).join('')}
      </div>
      <div class="center-product">
        <img src="${mainImgSrc}" alt="${item.name}">
      </div>
      <div class="characteristics-col col-right">
        ${right.map(c => `
          <div class="char-pill">
            <div class="char-icon">${getCharIcon()}</div>
            <span class="char-label">${c.label}</span>
          </div>`).join('')}
      </div>
    `;
  }

  // Specs
  const specsTable = document.getElementById('specs-table-body');
  if (specsTable && item.specs) {
    specsTable.innerHTML = item.specs.map(s => `
      <tr><th>${s.param}</th><td>${s.value}</td></tr>
    `).join('');
    if (item.specs.length === 0) {
      const btn = document.getElementById('toggleSpecsBtn');
      if (btn) btn.style.display = 'none';
    }
  }

  // Datasheets
  const docsGrid = document.getElementById('downloads-grid');
  if (docsGrid && item.datasheets && item.datasheets.length > 0) {
    docsGrid.innerHTML = item.datasheets.map((ds, i) => {
      const resolvedFile = resolvePath(ds.file);
      const isDrawing = ds.name.toLowerCase().includes('draw') || ds.name.toLowerCase().includes('dimension');
      return `
        <a href="${resolvedFile || '#'}" class="download-card" id="doc-card-${i}"
          ${isDrawing && ds.file ? '' : `onclick="openModal('${ds.name}'); return false;"`}
          ${ds.file && !isDrawing ? 'target="_blank"' : ''}>
          <svg class="download-icon" viewBox="0 0 24 24">
            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
          </svg>
          <span class="download-label">${ds.name}</span>
        </a>
      `;
    }).join('');

    // Wire up drawing card
    const drawingDs = item.datasheets.find(ds =>
      ds.name.toLowerCase().includes('draw') || ds.name.toLowerCase().includes('dimension')
    );
    if (drawingDs && drawingDs.file) {
      const drawingImg = document.getElementById('drawing-img');
      if (drawingImg) drawingImg.src = resolvePath(drawingDs.file);
      const idx = item.datasheets.indexOf(drawingDs);
      const drawingCard = document.getElementById(`doc-card-${idx}`);
      const drawingExpansion = document.getElementById('drawingExpansion');
      if (drawingCard && drawingExpansion) {
        drawingCard.addEventListener('click', e => {
          e.preventDefault();
          drawingExpansion.classList.toggle('open');
          if (drawingExpansion.classList.contains('open')) {
            setTimeout(() => drawingExpansion.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
          }
        });
      }
    }
  }

  // Features description paragraph
  const featDesc = document.getElementById('chars-description') || document.getElementById('features-description');
  if (featDesc && item.shortDescription) featDesc.textContent = item.shortDescription;
}
function getCharIcon() {
  return `<svg viewBox="0 0 24 24" style="width:28px;height:28px;fill:var(--accent)"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`;
}
