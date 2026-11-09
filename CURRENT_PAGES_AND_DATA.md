# Calisto Automation — Website Pages & Data Catalog

> **Generated on:** November 6, 2026  
> **Repository:** Calisto Automation (`calisto`)  
> **Platform & Stack:** Static HTML5 / CSS3 / ES6+ JavaScript, Vercel Serverless Functions, Supabase (Database, Auth & Storage)  
> **Primary Domain:** [calistotech.com](https://calistotech.com) / [calistotech.co](https://calistotech.co)

---

## Table of Contents

1. [Executive Summary & Architecture](#1-executive-summary--architecture)
2. [Master Page Index & Summary Table](#2-master-page-index--summary-table)
3. [Core Marketing & Company Pages](#3-core-marketing--company-pages)
   - [`index.html` — Homepage](#31-indexhtml--homepage)
   - [`about.html` — About Us / Our Story](#32-abouthtml--about-us--our-story)
   - [`contact.html` — Contact Us & Global Network](#33-contacthtml--contact-us--global-network)
   - [`automation.html` — Automations Overview](#34-automationhtml--automations-overview)
   - [`blog.html` — Calisto Insights (Blog Hub)](#35-bloghtml--calisto-insights-blog-hub)
4. [Category Pages (4 Main Product Categories)](#4-category-pages-4-main-product-categories)
   - [`gates.html` — Gate Systems](#41-gateshtml--gate-systems)
   - [`rolling-shutters.html` — Rolling Shutters](#42-rolling-shuttershtml--rolling-shutters)
   - [`automatic-doors.html` — Automatic Doors](#43-automatic-doorshtml--automatic-doors)
   - [`window-systems.html` — Window Systems](#44-window-systemshtml--window-systems)
5. [Subcategory Pages (8 Subcategories)](#5-subcategory-pages-8-subcategories)
   - [`swing-gate-operators.html`](#51-swing-gate-operatorshtml)
   - [`sliding-gate-operators.html`](#52-sliding-gate-operatorshtml)
   - [`rolling-shutter-operators.html`](#53-rolling-shutter-operatorshtml)
   - [`curtain-operators.html`](#54-curtain-operatorshtml)
   - [`sliding-door-operators.html`](#55-sliding-door-operatorshtml)
   - [`swing-door-operators.html`](#56-swing-door-operatorshtml)
   - [`window-operators.html`](#57-window-operatorshtml)
   - [`awning-operators.html`](#58-awning-operatorshtml)
6. [Product Detail Pages & Templates](#6-product-detail-pages--templates)
   - [`products/vortex-calarm-350.html` — Vortex CALARM 350](#61-productsvortex-calarm-350html--vortex-calarm-350)
   - [`products/product-template.html` — Universal Product Template](#62-productsproduct-templatehtml--universal-product-template)
   - [`products/product.html` — Dynamic Product Viewer](#63-productsproducthtml--dynamic-product-viewer)
7. [Blog Post Detail Pages (`posts/`)](#7-blog-post-detail-pages-posts)
   - [`posts/smart-automation.html`](#71-postssmart-automationhtml)
   - [`posts/industrial-motors.html`](#72-postsindustrial-motorshtml)
   - [`posts/tubular-series.html`](#73-poststubular-serieshtml)
   - [`posts/partner-training.html`](#74-postspartner-traininghtml)
8. [Admin Portal Pages (`admin/`)](#8-admin-portal-pages-admin)
   - [`admin/login.html` — Admin Authentication](#81-adminloginhtml--admin-authentication)
   - [`admin/index.html` — Management Dashboard & CMS](#82-adminindexhtml--management-dashboard--cms)
9. [Shared Components](#9-shared-components)
   - [`components/header.html`](#91-componentsheaderhtml)
   - [`components/footer.html`](#92-componentsfooterhtml)
10. [Backend APIs & Data Schema Reference](#10-backend-apis--data-schema-reference)

---

## 1. Executive Summary & Architecture

The Calisto Automation web application is structured with a high-performance **hybrid architecture**:
- **Static Pre-rendered Core**: Ultra-fast initial page loads styled with modern CSS variables, responsive design, and clean typography (`Raleway` headings + `Lato` body font).
- **Dynamic Client-Side Data Rendering**:
  - `js/products-data.js` & `js/category-renderer.js`: Powers product categories, subcategories, product specs, galleries, and download datasheets. Fetches live data from `/api/products` (Supabase backend) with a local synchronous seed fallback.
  - `js/blog-data.js` & `/api/blog`: Feeds the blog hub and links to standalone SEO-friendly article pages.
  - `/api/network`: Populates the multi-continent accordion network of dealers and authorized service centers on `contact.html`.
- **Integrated Headless Admin Portal**:
  - Located under `/admin/`, providing authenticated real-time CRUD management for the product catalog, blog posts, contact inquiries, global dealership network, SEO meta tags, and role-based access control (RBAC).

---

## 2. Master Page Index & Summary Table

| # | File Path | Route / URL | Page Title | Type / Role | Primary Data Source |
|---|---|---|---|---|---|
| 1 | `index.html` | `/` or `/index.html` | Calisto Automation \| Premium Entrance Automation | Homepage / Marketing | Static HTML + `blog-data.js` |
| 2 | `about.html` | `/about.html` | About Us \| Calisto Automation | Company Story & Heritage | Static HTML + OpenLayers Map |
| 3 | `contact.html` | `/contact.html` | Contact Us \| Calisto Automation | Contact & Global Network | Static HTML + OpenLayers + `/api/network` + `/api/enquiries` |
| 4 | `automation.html` | `/automation.html` | Calisto Automation \| Automations | Complete Systems Overview | Static HTML + Hero Carousel |
| 5 | `blog.html` | `/blog.html` | Calisto Insights \| Latest Articles | Blog Hub / Insights List | `js/blog-data.js` / `/api/blog` |
| 6 | `gates.html` | `/gates.html` | Calisto Automation \| Gate Systems | Category Hub (Gates) | `renderCategoryPage('gates')` via `products-data.js` |
| 7 | `rolling-shutters.html` | `/rolling-shutters.html` | Calisto Automation \| Rolling Shutters | Category Hub (Shutters) | `renderCategoryPage('rolling-shutters')` |
| 8 | `automatic-doors.html` | `/automatic-doors.html` | Calisto Automation \| Automatic Doors | Category Hub (Doors) | `renderCategoryPage('automatic-doors')` |
| 9 | `window-systems.html` | `/window-systems.html` | Calisto Automation \| Window Systems | Category Hub (Windows) | `renderCategoryPage('window-systems')` |
| 10 | `swing-gate-operators.html` | `/swing-gate-operators.html` | Calisto Automation \| Swing Gate Operators | Subcategory Listing | `renderSubcategoryPage('gates', 'swing-gate-operators')` |
| 11 | `sliding-gate-operators.html` | `/sliding-gate-operators.html` | Calisto Automation \| Sliding Gate Operators | Subcategory Listing | `renderSubcategoryPage('gates', 'sliding-gate-operators')` |
| 12 | `rolling-shutter-operators.html` | `/rolling-shutter-operators.html` | Calisto Automation \| Rolling Shutter Operators | Subcategory Listing | `renderSubcategoryPage('rolling-shutters', 'rolling-shutter-operators')` |
| 13 | `curtain-operators.html` | `/curtain-operators.html` | Calisto Automation \| Curtain Operators | Subcategory Listing | `renderSubcategoryPage('rolling-shutters', 'curtain-operators')` |
| 14 | `sliding-door-operators.html` | `/sliding-door-operators.html` | Calisto Automation \| Sliding Door Operators | Subcategory Listing | `renderSubcategoryPage('automatic-doors', 'sliding-door-operators')` |
| 15 | `swing-door-operators.html` | `/swing-door-operators.html` | Calisto Automation \| Swing Door Operators | Subcategory Listing | `renderSubcategoryPage('automatic-doors', 'swing-door-operators')` |
| 16 | `window-operators.html` | `/window-operators.html` | Calisto Automation \| Window Operators | Subcategory Listing | `renderSubcategoryPage('window-systems', 'window-operators')` |
| 17 | `awning-operators.html` | `/awning-operators.html` | Calisto Automation \| Awning Operators | Subcategory Listing | `renderSubcategoryPage('window-systems', 'awning-operators')` |
| 18 | `products/vortex-calarm-350.html` | `/products/vortex-calarm-350.html` | Calisto Automation \| Vortex CALARM 350 | Dedicated Product Page | `renderProductPage('gates', 'swing-gate-operators', 'vortex-calarm-350')` |
| 19 | `products/product-template.html` | `/products/product-template.html?cat=&sub=&item=` | Dynamic per item | Dynamic Product Viewer | URL Parameters `cat`, `sub`, `item` via `category-renderer.js` |
| 20 | `products/product.html` | `/products/product.html` | Calisto Automation \| Product | Dynamic Product Viewer | `products-data.js` / URL Params |
| 21 | `posts/smart-automation.html` | `/posts/smart-automation.html` | The Future of Smart Gate Automation \| Calisto Insights | Standalone Blog Post | Static Editorial HTML |
| 22 | `posts/industrial-motors.html` | `/posts/industrial-motors.html` | Choosing the Right Motor for Industrial Shutters \| Calisto Insights | Standalone Blog Post | Static Editorial HTML |
| 23 | `posts/tubular-series.html` | `/posts/tubular-series.html` | Calisto Launches New Tubular Series \| Calisto Insights | Standalone Blog Post | Static Editorial HTML |
| 24 | `posts/partner-training.html` | `/posts/partner-training.html` | Partner Training Events 2025 \| Calisto Insights | Standalone Blog Post | Static Editorial HTML |
| 25 | `admin/login.html` | `/admin/login.html` | Calisto Admin — Sign In | Portal Login | Supabase Auth API (`auth.js`) |
| 26 | `admin/index.html` | `/admin/index.html` | Calisto Admin Dashboard | Management Portal | Supabase REST APIs & Auth Session |
| 27 | `components/header.html` | Injected via JS | *(No direct title)* | Shared Header Nav | Injected via `js/common.js` |
| 28 | `components/footer.html` | Injected via JS | *(No direct title)* | Shared Footer & Links | Injected via `js/common.js` |

---

## 3. Core Marketing & Company Pages

### 3.1 `index.html` — Homepage
* **Path:** `index.html`
* **Route:** `/` or `/index.html`
* **Page Title:** `Calisto Automation | Premium Entrance Automation`
* **Meta Description:** `Calisto Automation delivers premium entrance automation systems for rolling shutters, tubular motors, and swing gates. Engineered in Taiwan for global durability and safety.`
* **Meta Keywords:** `entrance automation, rolling shutter motors, tubular motors, swing gate openers, industrial automation, residential gate systems, Calisto Tech`
* **Canonical URL:** `https://calistotech.com/`
* **Open Graph / Twitter Image:** `https://calistotech.com/assets/og-home.jpg`

#### Key Content & Data on Page:
1. **Hero Section (`#home`):**
   - **H1:** `Premium Entrance Automation`
   - **Tagline:** `Engineered in Taiwan. Trusted Worldwide.`
   - **Lead Description:** `Delivering durable, precision-engineered automation systems for gates, rolling shutters, and doors with comprehensive installation kits for professionals.`
   - **CTAs:**
     - `Explore Solutions` &rarr; Anchors to `#solutions`
     - `Become a Partner` &rarr; Anchors to `#partner`
2. **Solutions Section (`#solutions`):**
   - **H2:** `Entrance automation for every application`
   - **Subtext:** `From commercial rolling shutters to smart tubular motors and advanced swing gate openers, Calisto systems are built around secure braking, robust mechanics, and installer-friendly setup.`
   - **Category Solution Cards:**
     - **Card 1: Automation Operators** (`Shutters • Gates • Barriers`) &rarr; Links to `automation.html`
     - **Card 2: Hardware & Components** (`Springs • Slats • Guides`) &rarr; Links to `automation.html`
     - **Card 3: Controls & Accessories** (`Remotes • Sensors`) &rarr; Links to `automation.html`
3. **Value Proposition Section (`#products`):**
   - **H2:** `Why choose Calisto`
   - **Subtitle:** `The trusted choice for installers and distributors worldwide.`
   - **8 Value Cards (The "Why Calisto" Octet):**
     1. **Trust:** `A proven brand reputation built on long-term partnerships and global reliability.`
     2. **Quality:** `Certified automation solutions engineered to meet rigorous standards.`
     3. **Diversity:** `A comprehensive portfolio of products and accessories to suit varied applications and markets.`
     4. **Stock:** `Strong availability supported by ongoing investment in production, logistics, and warehousing.`
     5. **Support:** `Professional technical guidance to ensure correct installation, performance, and satisfaction.`
     6. **Training:** `Structured partner training aligned to team capability and knowledge requirements.`
     7. **Sharing:** `Access a connected partner ecosystem that unlocks collaboration and new business opportunities.`
     8. **Innovation:** `Continually advancing solutions to help you exceed expectations with modern automation.`
4. **Partner Strip (`#partner`):**
   - **H3:** `Become a Calisto Certified Partner Installer`
   - **Body:** `Join a professional network with training & technical updates, priority support channels, partner marketing resources, and stronger visibility in your territory.`
   - **CTAs:**
     - `Apply now` &rarr; Links to `contact.html`
     - `Get partner kit` &rarr; Links to `contact.html`
5. **Latest Articles (`#articles`):**
   - **H2:** `Latest Articles`
   - Displays dynamic cards with image, publication date, title, excerpt, and link to the 4 editorial articles (`smart-automation.html`, `industrial-motors.html`, `tubular-series.html`, `partner-training.html`).

---

### 3.2 `about.html` — About Us / Our Story
* **Path:** `about.html`
* **Route:** `/about.html`
* **Page Title:** `About Us | Calisto Automation`
* **Meta Description:** `Learn about Calisto Automation's 25-year history of engineering premium entrance automation systems. Proudly made in Taiwan, serving over 50 countries worldwide.`
* **Meta Keywords:** `Calisto Automation, about us, entrance automation, Taiwanese manufacturing, gate openers, rolling shutters, automation history, Lin Wei-Hsiang`
* **Canonical URL:** `https://calistotech.com/about.html`

#### Key Content & Data on Page:
1. **Hero Section:**
   - **H1:** `Our Story`
   - **Subtitle:** `25 Years of Engineering Excellence & Innovation`
2. **Introduction & Origin Badge:**
   - **Main Copy:** `At Calisto Automation, our mission is to transform how people interact with their architectural environments. Founded in Kaohsiung, Taiwan, we have dedicated over two decades to perfecting the balance between mechanical precision, uncompromising safety, and modern design.`
   - **Origin Badge:** Taiwan Flag + `Engineered & Crafted in Taiwan`
3. **Key Corporate Statistics Row:**
   - `25` &rarr; **Years Experience**
   - `+50` &rarr; **Countries**
   - `+1,000` &rarr; **Partners**
4. **Interactive Global Reach Map:**
   - Powered by OpenLayers (`ol.js` / OpenStreetMap vector tile rendering) centered on Taiwan with global partner distribution pins.
5. **Founder & CEO Story:**
   - **CEO Name:** `Lin Wei-Hsiang`
   - **Title:** `FOUNDER & CEO`
   - **Quote:** `"During all these years, we work to reach a high quality level, in order to satisfy the biggest demands of the world market."`
   - **Story Text:** `With 25 years of experience in the automation market, Calisto is already a reference in Asia and internationally, present in more than 50 countries through 1,000 distributors and professionals in the area. Focused on permanent evolution, through the search for new materials and the implementation of new production methods, to present durable and quality products at competitive prices.`
   - **Portrait:** Grayscale interactive photo (`assets/ceo.jpg`).
6. **Corporate Mission (Dark Section):**
   - **H2:** `Our Mission`
   - **Values:** Solutions, Speed, Security, Shutters, Doors, Global Reach.
   - **Pillars:**
     - Make your life more comfortable and simple
     - Constant search to make available the most sustainable materials
     - Provide durable products at competitive prices
     - Monitor retailers and resellers in their activities
     - Ensure all products support materials to our customers

---

### 3.3 `contact.html` — Contact Us & Global Network
* **Path:** `contact.html`
* **Route:** `/contact.html`
* **Page Title:** `Contact Us | Calisto Automation`
* **Meta Description:** `Contact Calisto Automation for product inquiries, technical support, and global partner information. Headquartered in Taiwan.`
* **Meta Keywords:** `contact calisto, automation support, gate opener technical support, dealer network, global partners`
* **Canonical URL:** `https://calistotech.com/contact.html`

#### Key Content & Data on Page:
1. **Interactive Global Map Header (`#map`):**
   - Full-width OpenLayers interactive map showing corporate headquarters in Kaohsiung, Taiwan with custom styled controls.
2. **Contact Methods:**
   - **Headquarters Address:** `Calisto Automation, No. 123, Zhongshan Road, Kaohsiung, Taiwan`
   - **Telephone:** `+886 2 2219 0785`
   - **Fax:** `+886 2 2219 0786`
   - **Email:** `info@calistotech.co` (also configured with fallback `info@calistotech.com`)
3. **Inquiry Contact Form:**
   - **Form Action:** Asynchronous submit via `handleSubmit(event)` calling `POST /api/enquiries`.
   - **Form Fields:**
     - `name` (Text, Required)
     - `email` (Email, Required)
     - `subject` (Text, Optional)
     - `message` (Textarea, Optional)
     - `privacy` (Checkbox, Required): `I accept the terms of the data processing (Regulation EU 2016/679 consent)`
   - **Feedback UI:** Dynamic `#form-success` confirmation block.
4. **Global Network & Authorized Dealers Directory (`#network-container`):**
   - **Data Fetch:** Real-time dynamic fetch from `GET /api/network`.
   - **Structure:** Continents &rarr; Regions/Countries &rarr; Authorized Dealers &rarr; Service Centers Accordion.
   - **Seed/Default Directory Data:**
     - **Europe:**
       - **France (Paris):** *Calisto France SAS* (`contact@calisto.fr`, `+33 1 23 45 67 89`)
       - **Germany (Munich):** *AutoTeck GmbH* (`info@autoteck.de`, `+49 89 123456`)
       - **United Kingdom (London):** *Calisto UK Ltd* (`sales@calisto.co.uk`, `+44 20 7123 4567`)
     - **Americas:**
       - **USA (New York):** *Calisto North America Inc.* (`usa@calistotech.com`, `+1 212 555 0199`)
       - **Canada (Toronto):** *Maple Automation* (`info@mapleauto.ca`)
       - **Brazil (São Paulo):** *Calisto Brasil Ltda* (`contato@calistobrasil.com.br`)
     - **Asia & Pacific:**
       - **Australia (Sydney):** *Oz Automation Pty Ltd* (`sales@ozautomation.com.au`)
       - **Japan (Tokyo):** *Calisto Japan KK* (`info@calisto.jp`, `+81 3 1234 5678`)
       - **India (Bangalore):** *Calisto India*

---

### 3.4 `automation.html` — Automations Overview
* **Path:** `automation.html`
* **Route:** `/automation.html`
* **Page Title:** `Calisto Automation | Automations`
* **Meta Description:** `Discover Calisto's full range of automation solutions for gates, rolling shutters, window systems, and automatic doors.`
* **Canonical URL:** `https://calistotech.com/automation.html`

#### Key Content & Data on Page:
1. **Hero Carousel (Multi-slide Showcase):**
   - **Slide 1:** `Advanced Gate Automation` — *"Powerful, silent, and reliable systems for every type of residential and industrial gate."* &rarr; CTA `View Systems` (`#gates`)
   - **Slide 2:** `Smart Rolling Shutters` — *"Seamless control for your windows and blinds with our cutting-edge tubular motors."* &rarr; CTA `Discover More` (`#shutters`)
   - **Slide 3:** `Automatic Door Solutions` — *"Hygienic, touch-free access for modern commercial buildings and public spaces."* &rarr; CTA `Explore Range` (`#doors`)
2. **Complete Automation Systems Header:**
   - **H2:** `Complete Automation Systems, Engineered for Ease.`
   - **Copy:** `From residential gates and garage doors to industrial rolling shutters and automatic entrances, Calisto offers a specialized solution for every application. Our products are developed to meet the rigorous demands of daily use while ensuring a seamless installation process for professionals, featuring our signature comprehensive installation kits.`
3. **Four Core Pillar Cards:**
   - **Card 1: Gates** (`gates.html`)
     - Bullet points: Swing, Sliding & Garage Systems; Sectional & Folding Doors; Traffic Barriers; Safety Accessories.
   - **Card 2: Rolling Shutters** (`rolling-shutters.html`)
     - Bullet points: Commercial & Residential Shutters; Automated Blinds; Control Systems.
   - **Card 3: Window Systems** (`window-systems.html`)
     - Bullet points: Motorized Window Actuators; Skylight & Roof Openers; Sunshade & Awning Controls; Energy Management.
   - **Card 4: Automatic Doors** (`automatic-doors.html`)
     - Bullet points: Sliding & Telescopic Operators; Low-Energy Swing Operators; Access Control & Radar Sensors; Cleanroom Solutions.

---

### 3.5 `blog.html` — Calisto Insights (Blog Hub)
* **Path:** `blog.html`
* **Route:** `/blog.html`
* **Page Title:** `Calisto Insights | Latest Articles`
* **Meta Description:** `Stay updated with the latest automation insights, product launches, and technical guides from Calisto Automation.`
* **Meta Keywords:** `automation news, gate opener installation guides, rolling shutter trends, smart home automation blog`
* **Canonical URL:** `https://calistotech.com/blog.html`

#### Key Content & Data on Page:
- **Header:** `Calisto Insights` — *"News and technical updates from the automation world."*
- **Dynamic Render Container (`#blog-posts-container`):**
  - Renders all entries from `js/blog-data.js` (and synced via `/api/blog`).
  - Cards include: Date, Clickable Title, High-Resolution Unsplash Cover Image, Summary Abstract, and "Read More &rarr;" link to standalone post pages.

---

## 4. Category Pages (4 Main Product Categories)

All 4 category pages share a standardized template driven by `js/category-renderer.js` via `renderCategoryPage(categorySlug)`. They dynamically populate:
- Hero banner (background image, title, and subtitle)
- Solutions header and descriptive copy
- Grid of subcategories belonging to that category, listing preview products and an `EXPLORE` link.

### 4.1 `gates.html` — Gate Systems
* **Path:** `gates.html`
* **Title:** `Calisto Automation | Gate Systems`
* **Meta Description:** `Explore Calisto's range of gate automation systems including swing gate operators and sliding gate operators.`
* **Renderer Call:** `renderCategoryPage('gates')`
* **Hero Image:** `https://images.unsplash.com/photo-1558002038-1091a16606f3`
* **Hero Title:** `Gate Automation Systems,`
* **Hero Subtitle:** `Engineered for Reliability.`
* **Category Description:** `Discover our specialized range of gate automation solutions designed for seamless operation and long-lasting performance.`
* **Subcategories Displayed:**
  1. **Swing Gate Operators** (`swing-gate-operators.html`) — Preview items: *Vortex CALARM 350*
  2. **Sliding Gate Operators** (`sliding-gate-operators.html`) — Status: *Coming soon*

---

### 4.2 `rolling-shutters.html` — Rolling Shutters
* **Path:** `rolling-shutters.html`
* **Title:** `Calisto Automation | Rolling Shutters`
* **Meta Description:** `Discover Calisto's advanced rolling shutter and curtain automation solutions for privacy and security.`
* **Renderer Call:** `renderCategoryPage('rolling-shutters')`
* **Hero Image:** `https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122`
* **Hero Title:** `Smart Rolling Shutters,`
* **Hero Subtitle:** `Specialized for Control.`
* **Category Description:** `Enhance your privacy and security with our advanced rolling shutter and curtain automation solutions.`
* **Subcategories Displayed:**
  1. **Rolling Shutter Operators** (`rolling-shutter-operators.html`)
  2. **Curtain Operators** (`curtain-operators.html`)

---

### 4.3 `automatic-doors.html` — Automatic Doors
* **Path:** `automatic-doors.html`
* **Title:** `Calisto Automation | Automatic Doors`
* **Meta Description:** `Discover Calisto's smart door automation systems for residential, commercial, and industrial spaces.`
* **Renderer Call:** `renderCategoryPage('automatic-doors')`
* **Hero Image:** `https://images.unsplash.com/photo-1541888946425-d81bb19240f5`
* **Hero Title:** `Automatic Door Systems,`
* **Hero Subtitle:** `Opening New Possibilities.`
* **Category Description:** `Smart door automation for residential, commercial, and industrial spaces.`
* **Subcategories Displayed:**
  1. **Sliding Door Operators** (`sliding-door-operators.html`)
  2. **Swing Door Operators** (`swing-door-operators.html`)

---

### 4.4 `window-systems.html` — Window Systems
* **Path:** `window-systems.html`
* **Title:** `Calisto Automation | Window Systems`
* **Meta Description:** `Explore Calisto's intelligent window automation systems for comfort, ventilation, and energy efficiency.`
* **Renderer Call:** `renderCategoryPage('window-systems')`
* **Hero Image:** `https://images.unsplash.com/photo-1513694203232-719a280e022f`
* **Hero Title:** `Window Automation,`
* **Hero Subtitle:** `Comfort at Your Command.`
* **Category Description:** `Intelligent window automation for comfort, ventilation, and energy efficiency.`
* **Subcategories Displayed:**
  1. **Window Operators** (`window-operators.html`)
  2. **Awning Operators** (`awning-operators.html`)

---

## 5. Subcategory Pages (8 Subcategories)

Each subcategory page is rendered by `renderSubcategoryPage(catSlug, subcatSlug)`:
- Loads category and subcategory models from `products-data.js` / `/api/products`
- Displays individual product cards with images, bullet highlights, and a `VIEW DETAILS` button pointing to `products/product-template.html?cat=...&sub=...&item=...`
- Falls back to `"No products yet. Add products via the admin panel."` if items are empty.

### 5.1 `swing-gate-operators.html`
* **Parent Category:** `gates`
* **Subcategory ID:** `swing-gate-operators`
* **Title:** `Calisto Automation | Swing Gate Operators`
* **Hero Title:** `Swing Gate Operators`
* **Hero Subtitle:** `Premium automation solutions for residential and industrial swing gates.`
* **Description:** `Choose from our wide range of operators designed to suit different gate weights, lengths, and usage frequencies.`
* **Products Active (1):**
  - **Name:** `Vortex CALARM 350`
  - **Slug:** `vortex-calarm-350`
  - **Short Desc:** `Articulated arm operator for large pillars with smooth movement.`
  - **Highlights:** `Articulated arm`, `For large pillars`, `Smooth movement`
  - **Link:** `products/product-template.html?cat=gates&sub=swing-gate-operators&item=vortex-calarm-350` (or `products/vortex-calarm-350.html`)

### 5.2 `sliding-gate-operators.html`
* **Parent Category:** `gates`
* **Subcategory ID:** `sliding-gate-operators`
* **Title:** `Calisto Automation | Sliding Gate Operators`
* **Hero Title:** `Sliding Gate Operators`
* **Hero Subtitle:** `High-performance sliding gate systems for residential and commercial applications.`
* **Description:** `Powerful sliding gate automation for any property.`
* **Products:** Catalog placeholder ready for admin uploads.

### 5.3 `rolling-shutter-operators.html`
* **Parent Category:** `rolling-shutters`
* **Subcategory ID:** `rolling-shutter-operators`
* **Title:** `Calisto Automation | Rolling Shutter Operators`
* **Hero Title:** `Rolling Shutter Operators`
* **Hero Subtitle:** `Precision tubular motors for reliable shutter control in any application.`
* **Description:** `Advanced tubular and central motor systems for rolling shutters and curtains.`
* **Products:** Catalog placeholder ready for admin uploads.

### 5.4 `curtain-operators.html`
* **Parent Category:** `rolling-shutters`
* **Subcategory ID:** `curtain-operators`
* **Title:** `Calisto Automation | Curtain Operators`
* **Hero Title:** `Curtain Operators`
* **Hero Subtitle:** `Elegant motorized curtain systems with remote and smart home control.`
* **Description:** `Motorized curtain and drapery systems with remote control.`
* **Products:** Catalog placeholder ready for admin uploads.

### 5.5 `sliding-door-operators.html`
* **Parent Category:** `automatic-doors`
* **Subcategory ID:** `sliding-door-operators`
* **Title:** `Calisto Automation | Sliding Door Operators`
* **Hero Title:** `Sliding Door Operators`
* **Hero Subtitle:** `Touch-free access with precision automatic sliding door systems.`
* **Description:** `Smooth, quiet automatic sliding door systems for commercial and residential use.`
* **Products:** Catalog placeholder ready for admin uploads.

### 5.6 `swing-door-operators.html`
* **Parent Category:** `automatic-doors`
* **Subcategory ID:** `swing-door-operators`
* **Title:** `Calisto Automation | Swing Door Operators`
* **Hero Title:** `Swing Door Operators`
* **Hero Subtitle:** `Reliable automated swing doors for every environment.`
* **Description:** `Automated swing door systems for accessible and hygienic entry points.`
* **Products:** Catalog placeholder ready for admin uploads.

### 5.7 `window-operators.html`
* **Parent Category:** `window-systems`
* **Subcategory ID:** `window-operators`
* **Title:** `Calisto Automation | Window Operators`
* **Hero Title:** `Window Operators`
* **Hero Subtitle:** `Smart window control for ventilation, comfort, and energy efficiency.`
* **Description:** `Motorized window openers for roof, awning, casement, and tilt-and-turn windows.`
* **Products:** Catalog placeholder ready for admin uploads.

### 5.8 `awning-operators.html`
* **Parent Category:** `window-systems`
* **Subcategory ID:** `awning-operators`
* **Title:** `Calisto Automation | Awning Operators`
* **Hero Title:** `Awning Operators`
* **Hero Subtitle:** `Automated awnings for shade, outdoor comfort, and style.`
* **Description:** `Motorized awning and blind systems for outdoor comfort and sun control.`
* **Products:** Catalog placeholder ready for admin uploads.

---

## 6. Product Detail Pages & Templates

### 6.1 `products/vortex-calarm-350.html` — Vortex CALARM 350
* **File Path:** `products/vortex-calarm-350.html`
* **Route:** `/products/vortex-calarm-350.html`
* **Associated Dynamic Route:** `products/product-template.html?cat=gates&sub=swing-gate-operators&item=vortex-calarm-350`
* **Product Title:** `Vortex CALARM 350`

#### Full Product Data Record:
* **Short Description:** Articulated arm operator for large pillars with smooth movement.
* **Full Description:**
  > **Vortex CALARM 350** was developed to automate swing gates, available in **230V**, **110V** and **24V**, featuring screw driven piston precision for maximum reliability.
  > 
  > With a consumption of just **2A**, this motor minimizes environmental impact, in line with the search for energy-responsible solutions.
  > 
  > In addition to being practical, safe and powerful, it features **slow start and stop** technology for smooth operation and no inertia.
* **Core Characteristics (Pill Badges with Custom Icons):**
  1. `DC motor & Backup Battery` (Battery backup resilience)
  2. `Smart Stop-on-Obstacle` (Anti-crush obstacle sensor)
  3. `Slow Start/Stop Operation` (Smooth deceleration curve)
  4. `Auto Closing Function` (Configurable timer close)
  5. `Access Control Support` (Keypad / Intercom interface)
  6. `WIFI Function (Optional)` (Smartphone automation ready)
* **Technical Specifications Table (14 Parameters):**

| Parameter | Specification Value |
|---|---|
| **Unit Model** | `SW300DC` |
| **Power Supply** | `AC220V/50Hz ; AC110V/60Hz` |
| **Maximum Loading Weight** | `300 KG / Leaf` |
| **Motor Power** | `DC24V / 50W` |
| **Driving Method** | `Screw driven piston type` |
| **Limit Switch** | `Electromechanical limit switch / hall sensor` |
| **Max Single-Leaf Length** | `3.0 m` |
| **Gate Moving Speed** | `2.5 cm/s` |
| **Remote Control Range** | `≥ 30 m` |
| **Recording of Up Remotes** | `32 remotes` |
| **Remote Frequency** | `433.92 MHz` |
| **Work Duty** | `S2, 30 min` |
| **Working Temperature** | `-20°C ~ +70°C` |
| **Package Weight** | `15 KG` |

* **High-Resolution Photo Gallery:**
  1. `assets/Vortex CALARM 350.jpeg` (Main isometric view)
  2. `assets/Vortex CALARM 350 (2).jpeg` (Detail view 1)
  3. `assets/Vortex CALARM 350 (3).jpeg` (Detail view 2)
  4. `assets/Vortex CALARM 350 (4).jpeg` (Detail view 3)
* **Datasheets & Technical Drawings:**
  1. **Product Brochure** (`type: brochure`) — Modal request trigger
  2. **Installation Manual** (`type: manual`) — Modal request trigger
  3. **Technical Drawings** (`type: drawing`, file: `assets/vortex-specs.png`) — Expands interactive in-page schematic diagram

---

### 6.2 `products/product-template.html` — Universal Product Template
* **File Path:** `products/product-template.html`
* **Query Parameters:** `?cat={categorySlug}&sub={subcategorySlug}&item={itemSlug}`
* **Engine:** Reads URL query parameters via `URLSearchParams` and calls `renderProductPage(cat, sub, item)`.
* **Dynamic Features:**
  - Auto-updates `<title>` and Open Graph tags
  - Parallax interactive image showcase
  - Split left/right pill column characteristics layout
  - Expandable / collapsible technical specs table
  - In-page modal for download inquiries and technical drawing previews

### 6.3 `products/product.html` — Dynamic Product Viewer
* **File Path:** `products/product.html`
* Dynamic template variant wired for immediate loading and fallback testing of individual catalog models.

---

## 7. Blog Post Detail Pages (`posts/`)

Each blog post is an individual, fast-loading, standalone HTML document complete with its own SEO metadata, breadcrumb navigation, and article formatting.

### 7.1 `posts/smart-automation.html`
* **Title:** `The Future of Smart Gate Automation | Calisto Insights`
* **Date Published:** `October 24, 2025`
* **Cover Image:** `https://images.unsplash.com/photo-1558002038-1091a16606f3`
* **Article Content:**
  - *"The landscape of residential access control is shifting rapidly. In 2025, homeowners demand more than just a remote control; they expect full integration with their smart home ecosystems."*
  - *"Calisto's latest generation of motors includes native Wi-Fi and Bluetooth capabilities, allowing users to control their gates via smartphone apps, voice assistants like Alexa and Google Home, and even set automated schedules."*
  - *"Security is also paramount. Our new cloud-based encryption ensures that your digital key is as secure as a physical lock, preventing unauthorized access while providing seamless entry for trusted guests."*

### 7.2 `posts/industrial-motors.html`
* **Title:** `Choosing the Right Motor for Industrial Shutters | Calisto Insights`
* **Date Published:** `September 15, 2025`
* **Cover Image:** `https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122`
* **Article Content:**
  - *"Industrial applications require robust, high-torque solutions that can withstand heavy duty cycles. When selecting a motor for a rolling shutter in a warehouse or factory, three factors are critical: weight capacity, frequency of use, and safety features."*
  - *"Our Titan Series side motors are engineered for shutters weighing up to 2000kg. They feature an integrated safety brake system that prevents free-fall in the unlikely event of gear failure, complying with the strictest EU safety standards."*
  - *"Furthermore, the built-in thermal protection ensures the motor does not overheat during peak operation hours, guaranteeing longevity and reliability for your business operations."*

### 7.3 `posts/tubular-series.html`
* **Title:** `Calisto Launches New Tubular Series | Calisto Insights`
* **Date Published:** `August 02, 2025`
* **Cover Image:** `https://images.unsplash.com/photo-1513694203232-719a280e022f`
* **Article Content:**
  - *"We are proud to announce the launch of our new 'Whisper' line of tubular motors. Designed specifically for residential blinds and awnings, these motors operate at a near-silent 35dB."*
  - *"The compact design allows for installation in smaller headboxes, maintaining the aesthetic appeal of modern window treatments. Despite their small size, they pack enough torque to lift even heavy blackout curtains comfortably."*
  - *"Available now through our partner network, the Whisper series comes with a 5-year replacement warranty, underscoring our confidence in their build quality."*

### 7.4 `posts/partner-training.html`
* **Title:** `Partner Training Events 2025 | Calisto Insights`
* **Date Published:** `July 10, 2025`
* **Cover Image:** `https://images.unsplash.com/photo-1517048676732-d65bc937f952`
* **Article Content:**
  - *"At Calisto, we believe that a great product is only as good as its installation. That's why we are expanding our Partner Certification Program this year."*
  - *"We will be hosting technical workshops in major cities across Asia and Europe. These hands-on sessions cover everything from basic motor installation to advanced control board programming and troubleshooting."*
  - *"Certified partners receive priority technical support, extended warranties on installations, and marketing materials to help grow their business. Contact your local distributor to sign up for the next session near you."*

---

## 8. Admin Portal Pages (`admin/`)

The Calisto administration suite enables full self-service content management, dealer management, and customer lead tracking.

### 8.1 `admin/login.html` — Admin Authentication
* **File Path:** `admin/login.html`
* **Route:** `/admin/login.html`
* **Page Title:** `Calisto Admin — Sign In`
* **Security & Auth:** Integrates with `admin/auth.js` via Supabase Auth (`supabase.auth.signInWithPassword`).
* **Form Inputs:**
  - Email: `id="email"`, default placeholder `admin@calistotech.co`
  - Password: `id="password"`, placeholder `••••••••`
* **Features:** Remember session token in `localStorage`, error alerts, automatic redirection to `admin/index.html` upon successful authentication.

---

### 8.2 `admin/index.html` — Management Dashboard & CMS
* **File Path:** `admin/index.html`
* **Route:** `/admin/index.html`
* **Page Title:** `Calisto Admin Dashboard`
* **Security Guard:** `admin/auth.js` checks token validity; unauthorized sessions are redirected to `admin/login.html`.
* **Sidebar Views & Managed Data:**

#### View 1: Dashboard (`pg-dashboard`)
* **KPI Metrics:**
  - Total Site Visitors (Daily, Weekly, Monthly via Chart.js)
  - New Enquiries Counter & Unread Notification Badge
  - Total Products & Active Categories tally
  - Global Network Dealer count

#### View 2: Products & Categories (`pg-products`)
* **Features:**
  - Full hierarchical tree editor (Category &rarr; Subcategory &rarr; Product)
  - Live preview & editing of product titles, slugs, descriptions, highlights
  - Characteristics builder with icon selector
  - Technical specs tabular editor (Param / Value pairs or raw HTML mode)
  - Image gallery manager (supporting direct URL and Google Drive asset translation)
  - Downloadable JSON backup of the catalog
  - Instant live publishing to Supabase via `POST /api/products`

#### View 3: Blog Posts (`pg-blog`)
* **Features:**
  - Article CRUD manager (Title, Slug, Category, Cover Image, Publish Date, Excerpt, Body)
  - Publication Status Toggle: Draft / Published
  - Synchronizes with `blog_posts` table via `/api/blog`

#### View 4: Enquiries (`pg-forms`)
* **Features:**
  - Table of all contact form submissions from `contact.html`
  - Columns: Timestamp, Name, Email, Subject, Message preview, Status (Unread / Read)
  - Filter by status, mark as read, delete submission
  - One-click `Export CSV` for CRM and sales follow-up

#### View 5: Global Network (`pg-network`)
* **Features:**
  - Continents and Regional territories management
  - Dealer contact details (Company name, city, phone, email)
  - Service centers accordion manager with address, direct support lines, and coverage areas
  - Saves to Supabase via `POST /api/network`

#### View 6: SEO Settings (`pg-seo`)
* **Features:**
  - Granular page-by-page SEO editor for all 20+ pages
  - Fields per page: Meta Title, Meta Description, Meta Keywords
  - Character counter with best-practice SEO warnings
  - Instant save to Supabase via `POST /api/seo`

#### View 7: Users & Roles (`pg-users`)
* **Role-Based Access Control (RBAC):**

| Role Name | View Enquiries | Manage Products | SEO Settings | User Admin | Export Data |
|---|:---:|:---:|:---:|:---:|:---:|
| **Super Admin** | &check; | &check; | &check; | &check; | &check; |
| **Editor** | &check; | &check; | &mdash; | &mdash; | &mdash; |
| **SEO Manager** | &check; | &mdash; | &check; | &mdash; | &mdash; |

#### View 8: My Profile (`pg-profile`)
* **Features:**
  - Personal admin info update (Name, Email, Profile Avatar)
  - Secure password reset via Supabase Auth

---

## 9. Shared Components

These component files are dynamically fetched and injected by `js/common.js` on DOM load (`fetch('components/header.html')` and `fetch('components/footer.html')`), ensuring unified header/footer behavior across all pages.

### 9.1 `components/header.html`
* **Branding:** Calisto SVG vector logo (`assets/logo-calisto.svg`), links to `index.html`.
* **Primary Navigation Menu:**
  - `Solutions` &rarr; `index.html#solutions`
  - `Partners` &rarr; `index.html#partner`
  - `About` &rarr; `about.html`
  - `Contact` &rarr; `index.html#contact` (or `contact.html`)
* **Mobile Support:** Responsive slide-out drawer with hamburger toggle button and close icon (`✕`).

### 9.2 `components/footer.html`
* **Column 1 (Identity):** Logo and brand summary: *"Premium entrance automation systems for residential and industrial applications. Engineered for durability, safety, and seamless integration."*
* **Column 2 (Quick Links):** `Home`, `Solutions`, `Partners`, `About Us`, `Contact`.
* **Column 3 (Connect & Social):**
  - Social Links: Facebook, Instagram, YouTube SVG icons
  - Direct Email: `info@calistotech.com`
  - Direct Phone: `+886 2 2219 0785`
  - HQ Location: `Kaohsiung, Taiwan`
* **Copyright Notice:** `© 2026 Calisto Automation. All rights reserved.`

---

## 10. Backend APIs & Data Schema Reference

Serverless functions located in `/api/` running on Vercel Node.js runtime and connected to Supabase:

| Endpoint | Methods | Auth Required | Description / Backing Table |
|---|---|:---:|---|
| `/api/products` | `GET`, `POST` | POST only | Manages the full product catalog. Backed by server-side file `data/products.json`. |
| `/api/network` | `GET`, `POST` | POST only | Manages continents, regions, dealers & service centers. Backed by `catalog_data` (`key = 'network'`). |
| `/api/seo` | `GET`, `POST` | POST only | Manages page meta titles, descriptions, and keywords. Backed by `catalog_data` (`key = 'seo_settings'`). |
| `/api/blog` | `GET`, `POST`, `DELETE` | POST/DELETE only | Published/draft blog articles. Backed by table `blog_posts`. |
| `/api/enquiries` | `POST`, `GET`, `PATCH`, `DELETE` | Admin for GET/PATCH/DELETE | Customer contact and partner requests. Backed by table `enquiries`. |
| `/api/analytics` | `POST`, `GET` | Admin for GET | Page view telemetry and visitor counts. |
| `/api/auth` | `POST` | Public | Authenticates admin login requests against Supabase Auth. |

---
*Documentation compiled from codebase analysis of `calisto`.*

