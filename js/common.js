const basePath = (
  (typeof window.isPostPage !== 'undefined' && window.isPostPage) ||
  (typeof window.isProductPage !== 'undefined' && window.isProductPage)
) ? '../' : '';

const headerHTML = `
  <header id="navbar">
    <div class="logo" onclick="window.location.href='${basePath}index.html'">
      <img src="${basePath}assets/logo-calisto.svg" alt="Calisto" class="site-logo">
    </div>
    <nav>
      <ul id="nav-links">
        <!-- Close button mobile -->
        <div class="mobile-close-btn" onclick="toggleMenu()">✕</div>
        
        <li><a href="${basePath}index.html#solutions">Solutions</a></li>
        <li><a href="${basePath}index.html#partner">Partners</a></li>
        <li><a href="${basePath}about.html">About</a></li>
        <li><a href="${basePath}contact.html">Contact</a></li>
      </ul>
    </nav>

    <div class="hamburger" onclick="toggleMenu()" aria-label="Open menu">
      <span></span><span></span><span></span>
    </div>
  </header>
`;

const footerHTML = `
  <footer>
    <div class="footer-content">
      <!-- Col 1: Identity -->
      <div class="footer-col">
        <div class="footer-logo">
          <img src="${basePath}assets/logo-calisto.svg" alt="Calisto Automation">
          <p>
            Premium entrance automation systems for residential and industrial applications.
            Engineered for durability, safety, and seamless integration.
          </p>
        </div>
      </div>

      <!-- Col 2: Navigation -->
      <div class="footer-col">
        <h4>Quick Links</h4>
        <ul>
          <li><a href="${basePath}index.html">Home</a></li>
          <li><a href="${basePath}index.html#solutions">Solutions</a></li>
          <li><a href="${basePath}index.html#partner">Partners</a></li>
          <li><a href="${basePath}about.html">About Us</a></li>
          <li><a href="${basePath}contact.html">Contact</a></li>
        </ul>
      </div>

      <!-- Col 3: Connect -->
      <div class="footer-col">
        <h4>Connect</h4>
        <div class="social-links">
          <!-- Facebook -->
          <a href="#" class="social-icon" aria-label="Facebook">
            <svg viewBox="0 0 24 24">
              <path d="M14 13.5h2.5l1-4H14v-1.2c0-1.03.4-1.2 1.4-1.2h1V4.2c-.53-.07-1.42-.1-2.4-.1-2.9 0-4.5 1.58-4.5 4.67v1.73H7v4h2.5V22h4.5v-8.5z"/>
            </svg>
          </a>
          <!-- Instagram -->
          <a href="#" class="social-icon" aria-label="Instagram">
            <svg viewBox="0 0 24 24">
              <path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.64.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.64-.07-4.85s.01-3.58.07-4.85C2.38 3.92 3.9 2.38 7.15 2.23c1.27-.06 1.64-.07 4.85-.07zM12 0C8.74 0 8.33.01 7.05.07c-4.27.2-6.78 2.71-6.98 6.98C.01 8.33 0 8.74 0 12c0 3.26.01 3.67.07 4.95.2 4.27 2.71 6.78 6.98 6.98 1.28.06 1.69.07 4.95.07 3.26 0 3.67-.01 4.95-.07 4.27-.2 6.78-2.71 6.98-6.98.06-1.28.07-1.69.07-4.95 0-3.26-.01-3.67-.07-4.95-.2-4.27-2.71-6.78-6.98-6.98C15.67.01 15.26 0 12 0z"/>
              <path d="M12 5.84c-3.4 0-6.16 2.76-6.16 6.16s2.76 6.16 6.16 6.16 6.16-2.76 6.16-6.16-2.76-6.16-6.16-6.16zm0 10.16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
              <path d="M18.41 4.15c-.78 0-1.41.63-1.41 1.41 0 .78.63 1.41 1.41 1.41.78 0 1.41-.63 1.41-1.41 0-.78-.63-1.41-1.41-1.41z"/>
            </svg>
          </a>
          <!-- YouTube -->
          <a href="#" class="social-icon" aria-label="YouTube">
            <svg viewBox="0 0 24 24">
              <path d="M23.5 6.2c-.3-1-1-1.8-2-2C19.8 3.5 12 3.5 12 3.5s-7.8 0-9.5.7c-1 .3-1.8 1.1-2.1 2C0 7.9 0 12 0 12s0 4.1.4 5.8c.3 1 1 1.8 2.1 2.1 1.7.7 9.5.7 9.5.7s7.8 0 9.5-.7c1-.3 1.8-1.1 2.1-2.1.4-1.7.4-5.8.4-5.8s0-4.1-.4-5.8zM9.6 15.5V8.5l6.4 3.5-6.4 3.5z"/>
            </svg>
          </a>
        </div>
        <ul>
          <li><a href="mailto:info@calistotech.com">info@calistotech.com</a></li>
          <li><a href="tel:+886222190785">+886 2 2219 0785</a></li>
          <li style="color:rgba(255,255,255,0.5); font-size:0.85rem; margin-top:10px;">Kaohsiung, Taiwan</li>
        </ul>
      </div>
    </div>

    <div class="footer-bottom">
      <div class="footer-note">© <span id="year"></span> Calisto Automation. All rights reserved.</div>
    </div>
  </footer>
`;

function loadComponents() {
  document.getElementById('header-placeholder').innerHTML = headerHTML;
  document.getElementById('footer-placeholder').innerHTML = footerHTML;

  // Initialize dynamic elements
  initHeader();
  document.getElementById("year").textContent = new Date().getFullYear();
}

function initHeader() {
  const header = document.getElementById("navbar");

  // Check if we should force the dark/scrolled header style
  // This is needed for pages without a dark hero section (like blog.html or individual posts)
  const forceDarkHeader = (typeof window.isInnerPage !== 'undefined' && window.isInnerPage) ||
    (typeof window.isPostPage !== 'undefined' && window.isPostPage);

  if (header) {
    if (forceDarkHeader) {
      header.classList.add("scrolled");
    } else {
      // Only toggle on scroll for the homepage (or pages with hero)
      window.addEventListener("scroll", () => {
        if (window.scrollY > 50) header.classList.add("scrolled");
        else header.classList.remove("scrolled");
      });
    }
  }
}

function toggleMenu() {
  document.getElementById("nav-links").classList.toggle("active");
}

document.addEventListener('DOMContentLoaded', loadComponents);
