# VyaparPe & Clay-Inspired GTM Platform Showcase

An interactive, pixel-perfect frontend showcase built with pure HTML5, CSS3, and JavaScript. Inspired by modern SaaS design systems (Clay, Stripe, Linear), featuring scroll-driven animations, an interactive workflow engine, 3D media showcases, and an asymmetric Bento Grid.

---

## ✨ Features & Architecture

### 1. 🔔 Floating Announcement Bar & Glassmorphic Navbar
- **Top Notification Banner**: Keynote announcement bar with dynamic action links.
- **Floating Island Navbar**: Frosted glassmorphism (`backdrop-filter: blur(16px)`), keyboard search shortcut (`⌘ K`), and responsive mobile drawer.

### 2. 🎬 3K Master Hero Section
- **High-Definition Video Backdrop**: Autoplaying, muted loop video with smooth faststart streaming.
- **Layered Hero Copy**: Modern typography with dual CTA action buttons and single-click CLI install triggers for Claude and OpenAI integrations.

### 3. ♾️ Seamless Infinite Logo Ticker
- **Dynamic Marquee**: CSS-animated infinite carousel displaying marquee partner logos with smooth pause-on-hover interaction.

### 4. ⚡ Interactive GTM Engineering Workflow Studio
- **Centered Workflow Carousel**: Dynamic category selection tabs with centered auto-scroll physics and responsive active indicator states.
- **Live Interactive Data Grid**: Dynamic company lead spreadsheet with custom badge chips, phone numbers, and status indicators.
- **Floating Demo Request Form**: Interactive input controls with real-time state synchronization.
- **Live AI Personalized Email Generator**: Paginated lead inspector with real-time token highlighting and tabbed data view.

### 5. 🎴 Scroll-Driven Sticky Stacking Cards
- **Scroll Timeline Animations**: CSS-native `view-timeline` scroll-driven stacking effects where cards dynamically stack and scale.
- **3D Precision Imagery**: Custom color-themed cards with accent tags, callouts, and 3D geometric mechanisms.

### 6. 🚀 Reps Productivity 3D Contraptions Showcase
- **Modern 2-Column Header**: Electric cyan typography accent (`#0090ff`), underlined link, and dual-logo social proof pill (Pendo & Hex).
- **3D Canvas Card**: Custom 1240px container matching the stacking card dimensions, containing high-resolution looping contraptions media.

### 7. 🍱 Asymmetric 9-Column Bento Grid ("Learn More About GTM Engineering")
- **80% Proportional Container**: Elegant centered grid layout.
- **6 Integrated Resource Cards**:
  - **Sculpt Conference**: Deep purple graphic banner with conference details.
  - **Get Started with Clay**: 6-column wide card featuring 3D University steps illustration.
  - **Live ABM Livestream**: Full-bleed background media with high-contrast text overlay.
  - **Graduate Community Story**: Vertical card featuring Pakistani mountain graduation portrait.
  - **Lagos Community Story**: Horizontal split card with Sandra in Lagos thumbnail.
  - **Company Careers**: Ballroom team photo background with "See open roles" CTA.

---

## 📁 Project Directory Structure

```text
vypaarpe/
├── index.html                   # Main application markup & semantic SEO structure
├── README.md                    # Comprehensive documentation & developer guide
├── .gitignore                   # Standard OS & editor ignore rules
│
├── css/                         # Modular CSS Architecture
│   ├── style.css                # Global tokens, typography, reset & theme variables
│   ├── logo-section.css         # Infinite logo marquee & ticker animations
│   ├── gtm-section.css          # GTM interactive table & workflow studio styles
│   ├── stacking-cards.css       # Scroll-driven sticky stacking cards experience
│   ├── reps-section.css         # Reps more productive showcase section
│   └── gtm-engineering.css      # 9-column asymmetric Bento Grid styles (80% width)
│
├── js/                          # Application Scripts
│   └── app.js                   # Interactive tabs, carousel physics & form logic
│
└── assets/                      # Media & Graphic Assets
    ├── images/                  # SVGs, AVIFs, PNGs, and responsive thumbnails
    └── videos/                  # Faststart 3K hero video & 3D WebM loops
```

---

## 🚀 Getting Started

No build tools, bundlers, or package installations are required. The project runs natively in all modern web browsers.

### Quick Start with Live Server

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Inscrutable21/VypaarPE_Portfolio.git
   cd VypaarPE_Portfolio
   ```

2. **Serve locally:**
   - **Using VS Code / IDE Live Server**: Right-click `index.html` and click **"Open with Live Server"**.
   - **Using Python**:
     ```bash
     python -m http.server 5500
     ```
   - **Using Node.js**:
     ```bash
     npx serve .
     ```

3. **Open in browser:**
   ```text
   http://localhost:5500
   ```

---

## 🎨 Design System & Color Palette

| Token / Usage | Value | Description |
| :--- | :--- | :--- |
| **Primary White** | `#ffffff` | Clean background base |
| **Slate Dark** | `#0c131f` | Headings & high-contrast typography |
| **Muted Slate** | `#4b5563` | Subtitles & body descriptions |
| **Electric Cyan** | `#0090ff` | Highlight accents & active states |
| **Card Border** | `rgba(0, 0, 0, 0.06)` | Subtle modern container borders |
| **Card Shadow** | `0 16px 48px rgba(0, 0, 0, 0.07)` | Elevation & depth |
| **Border Radius** | `28px` / `20px` | Rounded showcase cards |

---

## 🌐 Browser Compatibility

- **Google Chrome / Chromium**: Full support (WebM, AVIF, CSS Scroll-Driven Timelines)
- **Microsoft Edge**: Full support
- **Mozilla Firefox**: Full support
- **Apple Safari**: Full support (with AVIF and picture fallbacks)

---

## 📄 License

Created by **Inscrutable21** for the VyaparPe Platform Portfolio. All rights reserved.
