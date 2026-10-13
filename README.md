# VyaparPe - AI E-Commerce & 10-Minute Quick Commerce Platform

[![Live Demo](https://img.shields.io/badge/Demo-Live_Website-0090ff?style=for-the-badge&logo=googlechrome&logoColor=white)](https://inscrutable21.github.io/VypaarPE_Portfolio/)
[![Tech Stack](https://img.shields.io/badge/Stack-HTML5_•_CSS3_•_Vanilla_ES6+-f59e0b?style=for-the-badge&logo=javascript&logoColor=white)](https://github.com/Inscrutable21/VypaarPE_Portfolio)
[![Assets](https://img.shields.io/badge/Images-100%25_WebP_Optimized-00f59b?style=for-the-badge&logo=webassembly&logoColor=black)](https://github.com/Inscrutable21/VypaarPE_Portfolio)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero_External_Runtimes-10b981?style=for-the-badge&logo=speedtest&logoColor=white)](https://github.com/Inscrutable21/VypaarPE_Portfolio)
[![License](https://img.shields.io/badge/License-Proprietary-6366f1?style=for-the-badge)](https://github.com/Inscrutable21/VypaarPE_Portfolio)

A high-performance, responsive frontend showcase engineered with standard **HTML5**, **modular Vanilla CSS3**, and **modern ES6+ JavaScript**. VyaparPe empowers merchants, D2C brands, and dark-store operators to launch lightning-fast digital storefronts and autonomous 10-minute quick commerce engines—combining Shopify simplicity with sub-second edge speeds, autonomous WhatsApp sales copilots, real-time rider telemetry, and responsive mobile architecture.

---

## 1. Overview and Core Capabilities

VyaparPe delivers an end-to-end commerce operating system designed with **zero runtime dependencies**, instant client-side rendering, complete mobile responsiveness, and micro-animations inspired by modern benchmarks like Clay.com and Linear.

### Key Highlights
- **AI Storefront Builder**: Prompt-to-live storefront in 60 seconds with auto-generated product photography, schema markup, and SEO descriptions.
- **10-Minute Quick Commerce Engine**: Real-time dark store inventory sync, picker apps, and autonomous rider dispatch across Dunzo, Shadowfax, and Porter.
- **Sub-Second Edge Infrastructure**: Global edge delivery yielding sub-500ms page loads and high checkout conversions.
- **WhatsApp Autonomous Sales Agent**: 24/7 conversational commerce, abandoned cart recovery via 1-tap UPI, and live rider GPS tracking.
- **1-Click UPI & Frictionless Checkout Engine**: 0% MDR UPI QR payments, pre-filled address auto-fill via VyaparPe Network ID, and instantaneous bank settlements.
- **Centered Glide Carousel**: Clay-inspired interactive workflow tabs centered dynamically in the viewport with gradient fade masks and inertia drag support.
- **100% WebP Image Optimization**: All raster graphics converted to WebP format for optimal compression, minimal bundle payload, and instant image decode times.
- **Responsive Mobile Navigation**: Fixed header container with animated announcement strip, Cmd+K search trigger, and expandable mobile drawer with quick action buttons.
- **Zero Runtime Dependencies**: Native browser execution without bundlers, compilation steps, or heavy virtual DOM overhead.

---

## 2. Section Architecture & Interactive Features

```text
┌─────────────────────────────────────────────────────────────────┐
│ 1. Dynamic Announcement Bar & Glassmorphic Floating Header      │
├─────────────────────────────────────────────────────────────────┤
│ 2. Hero Section (HTML5 Looping Video + Ecosystem Chips)         │
├─────────────────────────────────────────────────────────────────┤
│ 3. Social Proof Infinite Marquee (Fast-Growing Brands)          │
├─────────────────────────────────────────────────────────────────┤
│ 4. Autonomous Commerce Engine Studio (Centered Glide Tabs)      │
│    • 7 Dynamic Workflow Categories & Theme Shifts               │
│    • Live Spreadsheet Grid + Real-Time Telemetry Preview        │
├─────────────────────────────────────────────────────────────────┤
│ 5. What We Offer (Sticky Scroll-Driven Stacking Cards)          │
├─────────────────────────────────────────────────────────────────┤
│ 6. Merchant Profitability & 3D Mechanical Contraption Loop      │
├─────────────────────────────────────────────────────────────────┤
│ 7. 9-Column Asymmetric Modern Commerce Bento Grid               │
├─────────────────────────────────────────────────────────────────┤
│ 8. VyaparPe 2.0 Official Pricing & Add-ons Engine (vyaparpe.in) │
├─────────────────────────────────────────────────────────────────┤
│ 9. Growth Ideas Call to Action (CTA Banner)                     │
├─────────────────────────────────────────────────────────────────┤
│ 10. Multi-Column Elevated Footer with 3D Geometric Backdrop     │
├─────────────────────────────────────────────────────────────────┤
│ 11. Interactive Modals (Plan Details, Onboarding Wizard, Cmd+K) │
└─────────────────────────────────────────────────────────────────┘
```

### 2.1 Top Announcement Bar & Glassmorphic Navigation
- **Dynamic Top Announcement**:
  - Live status indicator badge (`.announcement-badge`) featuring an animated pulsing emerald dot (`.badge-dot`) and clean `Outfit` / `Plus Jakarta Sans` typography.
  - **Responsive Dual-Copy Rendering**:
    - **Desktop**: *"Launch an AI-powered E-Commerce store & 10-Min Quick Commerce engine in 60 seconds"*
    - **Mobile ($\le$ 680px)**: *"Launch your AI Store & 10-Min Quick Commerce in 60s"*
  - **Interactive CTA Link**: High-contrast gold button (`TRY AI BUILDER →`) linking to store creation modal.
  - **Smooth Scroll Collapse**: Seamlessly transitions to zero height (`.top-announcement-bar.is-hidden`) on user scroll.
- **Floating Island Header**:
  - Branded logo with multi-tiered SVG rainbow arch.
  - Desktop navigation items: Storefronts, Quick Commerce, AI Copilot, Integrations, and Pricing.
  - Quick Search shortcut pill (`⌘K` / `Ctrl+K`) triggering instant search.
  - Action buttons: "Log in", "Get a demo", and "Start free store".
- **Mobile Drawer & Touch UX**:
  - Hamburger menu button (`.mobile-nav-toggle`) animating into an "X" state.
  - Slide-down glassmorphic drawer containing navigation links and full-width drawer action buttons (`Log in`, `Get a demo`, `Start free store →`).

### 2.2 Hero Showcase
- **High-Definition Looping Video Mechanism**:
  - HTML5 `<video id="heroVideo">` streaming `assets/videos/hero-section.mp4` with `autoplay`, `loop`, `muted`, `playsinline`, and `webkit-playsinline`.
  - Fallback WebP poster (`assets/images/hero-section.webp`) and touch-start auto-play listener ensuring uninterrupted playback across mobile Safari and Chromium browsers.
- **Hero Messaging**:
  - **Headline**: `Build AI stores made` / `for instant commerce` formatted with whitespace-protected line spans.
  - **Subheading**: `The modern platform for E-commerce & 10-minute Quick Commerce. Shopify simplicity with autonomous AI, sub-second speed, and instant hyperlocal delivery.`
  - **Dual CTAs**: High-contrast "Start free store" and "Get a demo" buttons triggering order flow modals.
- **Native Ecosystem Chips**: 1-click integrations for Shopify catalog import, ChatGPT & Claude AI Store Copilot, and WhatsApp Commerce.

### 2.3 Brand Marquee & Social Proof
- **Infinite Marquee**: Linear CSS keyframe ticker showcasing customer proof and logos from high-growth D2C brands (Stripe, OpenAI, Snapchat, Figma, Notion, Google, etc.).
- **Interactive Testimonial Cards**: Stat callouts, customer quotes, and team avatars with subtle hover transitions.

### 2.4 Autonomous Commerce Engine Studio (GTM Showcase)
Inspired by Clay.com's interactive workflow demonstration:
- **Centered Glide Carousel**:
  - Max-width contained (`1060px`) and centered in the viewport with smooth gradient edge fade masks (`linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)`).
  - Active pill automatically glides into the horizontal dead center on click with smooth bezier physics (`cubic-bezier(0.22, 1, 0.36, 1)`).
  - 5-set buffer architecture with silent re-anchoring on `transitionend` for seamless infinite scrolling in both directions.
  - Touch-pan and mouse-drag inertia with snap-to-closest-pill on release.
- **Dynamic Theming**: 7 canonical commerce workflow categories dynamically shifting the entire canvas accent palette:
  1. `AI Store Builder` → Electric Lime (`#eaf872`)
  2. `10-Min Quick Commerce` → Sky Cyan Blue (`#7dd3fc`)
  3. `Dark Store Sync` → Warm Sunset Orange (`#fdba74`)
  4. `WhatsApp Sales Agent` → Mint Emerald Green (`#6ee7b7`)
  5. `1-Click UPI Checkout` → Soft Lilac Lavender (`#c4b5fd`)
  6. `AI Catalog Studio` → Vibrant Rose Pink (`#f9a8d4`)
  7. `Hyperlocal Routing` → Warm Golden Amber (`#fde047`)
- **Interactive Live Data Grid**: Real-time spreadsheet table showing brands, categories, orders/day, SLAs, and order dispatches with active row click highlighting.
- **Live Preview Drawer**: Connected preview card showing instant customer confirmation cards and dark store telemetry.

### 2.5 What We Offer (Sticky Stacking Cards)
- **Scroll-Driven Stacking Execution**: Cards stack sequentially as the user scrolls through the section, powered by `initStackingCards()` in `js/app.js` with `overflow-x: clip` on `html` and `body`.
- **Four Core Pillars**:
  1. **AI Storefront Builder**: Prompt to live store in 60 seconds with automated photography.
  2. **Hyperlocal Quick Commerce**: Transform retail dark stores into 10-minute dispatch engines.
  3. **Sub-Second Edge Infrastructure**: Shopify simplicity with 5x loading speed (sub-500ms).
  4. **WhatsApp & AI Sales Agents**: Autonomous sales copilot recovering abandoned carts 24/7.

### 2.6 Merchant Profitability Showcase
- **Asymmetric Header**: Highlights how retail brands scale 10x faster with AI automation and customer proof callouts.
- **3D Mechanical Loop**: High-framerate looping contraption illustrating continuous catalog processing (`assets/videos/reps-contraption.webm`).

### 2.7 Modern Commerce Resource Bento Grid
- **9-Column Asymmetric Bento Grid**:
  - **Quick Commerce Blueprint**: Architecture breakdown for sub-10-minute grocery and retail delivery.
  - **VyaparPe Commerce Academy**: Video tutorials on AI photography and catalog optimization.
  - **FreshRoot Case Study**: Scaling from a single location to 45 dark stores.
  - **Merchant Spotlight**: Transitioning from offline retail to ₹2.4 Cr/month online D2C.
  - **Dark Store Operations Tech**: Picker app barcode scanning and dispatch workflows.
  - **Partner Ecosystem**: Certified agency network and theme developers.

### 2.8 VyaparPe 2.0 Official Pricing & Add-ons Engine (Extracted from vyaparpe.in)
- **Official 4-Tier Pricing Grid**:
  - **Free Tier** (`₹0/mo`): Free `.vyaparpe.in` subdomain, 50 Products limit, 5% Commission, Unlimited orders, Email support.
  - **Growth Plan** (`₹999/mo`): Custom `.com` domain connection, 1,000 Products limit, reduced 2% Commission, 3 Staff accounts, AI Analytics reports.
  - **Ad-Spend Partner** (`₹0/mo` + Min ₹1,000/day Ad Spend): Fully Managed store & ads, 500 Products limit, 3% Revenue share, Dedicated WhatsApp group & account manager, Ad creatives provided, ₹0 setup fee.
  - **Lifetime Ownership** (`₹50,000` one-time / was ~~₹1L~~): Coming Soon license, Unlimited products, Lowest 1% gateway markup, ₹2,000/yr server & DB maintenance, custom UI/UX requests, Full Headless API access.
- **Professional Add-ons & Store Setup**:
  - **One-Time Setup** (`₹2,499`): Complete store setup, About Us, branding, theme, and first 50 Products / 150 SKUs.
  - **Extra Listings** (`₹499/block`): Catalog upload per 50 Products / 150 SKUs.
  - **Custom UX Theme** (`₹9,999`): Bespoke handcrafted premium storefront design.

### 2.9 Interactive Modals & Onboarding Wizard (Extracted from vyaparpe.in/start)
- **Plan Details Modal (`#plan-details-modal`)**: Dynamic side-by-side specification modal comparing Starter, Growth, Partner, and Lifetime plans with 1-click transition to store builder.
- **Store Builder Wizard (`#store-builder-modal`)**: Multi-step onboarding simulator:
  - Step 1: Business Profile & category.
  - Step 2: Instant subdomain slug generator (`yourbrand.vyaparpe.in`) with edge SSL indicator.
  - Step 3: Interactive plan selection.
  - Step 4: Real-time provisioning progress simulator with progress bar and success dashboard link.
- **Command Palette (`#search-modal`)**: `Cmd+K` / `Ctrl+K` quick-launcher to search sections, launch wizard, or navigate.

### 2.10 Growth Ideas Call to Action (CTA)
- High-contrast conversion banner with primary "Start free store" and secondary "Book a demo" action points.

### 2.11 Multi-Column Elevated Footer
- **Vibrant 3D Geometric Backdrop**: Full-width dense ocean of glossy candy-coated 3D shapes with soft ambient lighting (`assets/videos/footer-ballpit.mp4` / `assets/images/footer-ballpit.webp`).
- **Floating Elevated Card**: High-contrast white card (`border-top-left-radius: 28px; border-top-right-radius: 28px`) with structured columns covering E-Commerce, Quick Commerce, Integrations, Resources, Company, and RBI Compliance/Legal links.

---

## 3. Directory Structure

```text
vypaarpe/
├── index.html                   # Primary document markup, SEO meta tags, and structured schema
├── README.md                    # Project documentation and specifications
├── .gitignore                   # Version control exclusion rules
│
├── css/                         # Modular CSS Architecture
│   ├── style.css                # Base reset, typography tokens, header/announcement, responsive rules
│   ├── logo-section.css         # Infinite marquee animations and brand ticker styles
│   ├── gtm-section.css          # Interactive workflow studio, centered glide carousel, data grid
│   ├── stacking-cards.css       # Sticky scroll-driven stacking card styles
│   ├── reps-section.css         # Reps productivity showcase & profitability contraption styles
│   ├── gtm-engineering.css      # 9-column asymmetric Bento Grid styles (80% width container)
│   ├── pricing-section.css      # Official pricing grid & add-ons styles (vyaparpe.in)
│   ├── modals.css               # Plan details, onboarding wizard & command palette modal styles
│   ├── cta-section.css          # Growth ideas call-to-action banner styles
│   └── footer-section.css       # Multi-column footer styles with vibrant 3D backdrop
│
├── js/                          # Application Logic (Vanilla ES6+)
│   └── app.js                   # Header scroll, mobile drawer, glide carousel, stacking cards, modals, onboarding wizard
│
└── assets/                      # Static Media
    ├── images/                  # 100% WebP optimized graphics, cards, bento previews, SVG marks
    └── videos/                  # High-framerate looping MP4/WebM contraptions and 3D animations
        ├── hero-section.mp4     # Hero mechanism video background
        ├── reps-contraption.webm # Catalog processing 3D mechanism loop
        └── footer-ballpit.mp4   # 3D geometric ballpit backdrop loop
```

---

## 4. Design System Tokens

The user interface follows a strict design token system defined via CSS Custom Properties:

| Token Category | Value | Application |
| :--- | :--- | :--- |
| **Primary Background** | `#ffffff` | Page body, primary cards, and bento section base |
| **Surface Elevated** | `#f8fafc` / `#f1f5f9` | Pill buttons, drawer background, card hover fills |
| **Brand Plum** | `#45012e` | Top announcement bar, high-contrast banner strip |
| **Emerald Accent** | `#00f59b` / `#10b981` | Live status dots, active highlight rings, success badges |
| **Electric Cyan** | `#38bdf8` / `#0090ff` | Rainbow logo middle arch, interactive link accents |
| **Vibrant Yellow** | `#fde047` / `#facc15` | Announcement CTA, rainbow logo inner arch |
| **Lavender Tint** | `#c4b5fd` / `#e9d5ff` | Announcement bar copy, subtitle highlights |
| **Dark Heading Text** | `#0f172a` | Display titles, hero headlines, card titles |
| **Muted Body Text** | `#475569` | Subtitles, descriptions, secondary copy |
| **Subtle Metadata** | `#94a3b8` | Captions, small indicators, search pill borders |
| **Border Radii** | `9999px` / `20px` / `14px` | Standard rounded radii for pills, cards, and buttons |

---

## 5. Local Setup and Deployment

This project requires **no compilation, build step, or package installations**. It runs natively in any modern browser.

### Option A: VS Code / IDE Live Server
1. Open the project folder in VS Code or Antigravity IDE.
2. Right-click on `index.html` and select **Open with Live Server**.

### Option B: Python Simple HTTP Server
```bash
python -m http.server 5500
```
Open `http://localhost:5500` in your web browser.

### Option C: Node.js Serve
```bash
npx serve .
```

---

## 6. Browser Support & Performance

| Browser | Version Support | Features Utilized |
| :--- | :--- | :--- |
| **Google Chrome / Chromium** | Latest | Hardware video acceleration, WebP, CSS masks, flexbox |
| **Microsoft Edge** | Latest | Full support across all interactive animations |
| **Mozilla Firefox** | Latest | Native CSS Grid, WebP decode, and smooth transform animations |
| **Apple Safari** | iOS 16+ / macOS 13+ | `-webkit-mask-image`, playsinline video, backdrop-filter |

---

## 7. Author and Attribution

Crafted by **[Inscrutable21](https://github.com/Inscrutable21)** for the **VyaparPe Platform Portfolio**.  
All assets, branding, and interactive components are developed for high-conversion web performance.
