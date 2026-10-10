# VyaparPe Platform & GTM Infrastructure Showcase

A high-performance, interactive frontend showcase built using standard HTML5, CSS3, and modern JavaScript (ES6+). Implements modern SaaS product UI/UX architectures, including scroll-driven timeline animations, interactive workflow dashboards, responsive bento grids, and modular CSS design tokens.

---

## 1. Overview and Core Capabilities

This project delivers a responsive web application highlighting product workflows, customer testimonials, and GTM operations infrastructure. It is designed with zero external runtime dependencies and optimized for fast page loads and cross-browser rendering.

### Key Highlights
- **Zero Runtime Dependencies**: Native browser execution without bundlers or third-party frameworks.
- **Scroll-Driven Animation**: Uses standard CSS `view-timeline` specifications for sticky stacked card progressions.
- **Interactive Data Engine**: Real-time tab filtering, dynamic preview panels, and custom-styled data grids.
- **Responsive Layout System**: Asymmetric 9-column CSS Grid and Flexbox layouts calibrated across mobile, tablet, and desktop viewports.

---

## 2. Section Breakdown

### 2.1 Announcement Bar and Navigation
- **Top Announcement Bar**: Persistent promotional notification banner with deep-linked call-to-actions.
- **Floating Header**: Glassmorphic frosted navigation container (`backdrop-filter: blur(16px)`) with search shortcut triggers (`Cmd+K`), branded iconography, and mobile navigation drawer.

### 2.2 Hero Showcase
- **Video Background**: High-definition autoplaying looping video with faststart streaming attributes (`playsinline`, `muted`, `loop`).
- **Interactive CTAs**: Conversion-oriented action triggers and terminal command prompts for direct developer tool integrations (OpenAI, Anthropic Claude).

### 2.3 Logo Ticker
- **Infinite Marquee**: Linear infinite CSS keyframe animation showcasing verified client and technology partner marks with pause-on-hover capability.

### 2.4 GTM Engineering Workflow Studio
- **Dynamic Workflow Tabs**: Centered category selectors with synchronized horizontal scroll physics and active highlight indicator bars.
- **Lead Data Grid**: Tabular dataset rendering custom attribute badges, contact metadata, and pipeline statuses.
- **Modal Demo Form**: Client-side validated input controls with real-time field state synchronization.
- **Personalized Email Inspector**: Multi-tab drawer switching between raw lead properties and context-aware outbound message drafts.

### 2.5 Sticky Stacking Cards
- **Scroll Timeline Execution**: Card sequence stacking automatically as viewport scrolls down.
- **Color Systems**: Dedicated per-card CSS variables for thematic backgrounds, tag badges, and borders.
- **Visual Assets**: Paired with 3D mechanical contraption graphics and responsive action links.

### 2.6 Sales Rep Productivity Showcase
- **Two-Column Header**: Asymmetric layout with prominent electric cyan typography accent (`#0090ff`), secondary description, and customer proof callouts (Pendo and Hex).
- **Contraptions Media Card**: Container with 28px border-radius and soft drop shadow, displaying a 3D looping animation.

### 2.7 GTM Engineering Resource Bento Grid
- **Container Sizing**: Constrained to 80% viewport width for balanced white-space composition.
- **Nine-Column Asymmetric Layout**:
  - **Sculpt Conference**: Deep purple accent card spanning 3 columns and 2 rows.
  - **University Documentation**: Horizontal split card spanning 6 columns with 3D illustration.
  - **Livestream Case Study**: Full-bleed background media card with text overlay.
  - **Community Story (Javeria Shah)**: Vertical portrait card spanning 3 columns and 2 rows.
  - **Community Story (Sandra Uche)**: Horizontal split thumbnail card spanning 4 columns.
  - **Careers and Team**: Group portrait card with direct recruitment call-to-action.

---

## 3. Directory Structure

```text
vypaarpe/
├── index.html                   # Primary document markup and SEO metadata
├── README.md                    # Project documentation and specifications
├── .gitignore                   # Version control exclusion rules
│
├── css/                         # Modular CSS Architecture
│   ├── style.css                # Base reset, typography tokens, global theme variables
│   ├── logo-section.css         # Infinite marquee animations and brand ticker styles
│   ├── gtm-section.css          # Interactive workflow studio and data grid styles
│   ├── stacking-cards.css       # Sticky scroll-driven stacking card styles
│   ├── reps-section.css         # Reps productivity showcase styles
│   └── gtm-engineering.css      # 9-column asymmetric Bento Grid styles (80% width)
│
├── js/                          # Application Logic
│   └── app.js                   # Tab switching, carousel physics, and form handlers
│
└── assets/                      # Static Media
    ├── images/                  # SVGs, AVIFs, PNGs, and responsive thumbnails
    └── videos/                  # Faststart hero and 3D demonstration video files
```

---

## 4. Design System Tokens

The user interface follows a strict design token system defined via CSS Custom Properties:

| Token Category | Value | Application |
| :--- | :--- | :--- |
| **Primary Background** | `#ffffff` | Page body, primary cards, and bento section base |
| **Surface Elevated** | `#f6f5f1` | Secondary bento card fills and oat tints |
| **Dark Heading Text** | `#0c131f` | Display titles, hero headlines, card titles |
| **Muted Body Text** | `#4b5563` | Subtitles, descriptions, secondary copy |
| **Subtle Metadata** | `#8c95a6` | Testimonial quotes and caption elements |
| **Electric Cyan** | `#0090ff` | Highlight phrases, active focus states, hyperlinks |
| **Container Border** | `rgba(0, 0, 0, 0.06)` | Border definition on elevated cards |
| **Card Drop Shadow** | `0 16px 48px rgba(0, 0, 0, 0.07)` | Elevation for stacking cards and showcase cards |
| **Border Radii** | `28px` / `20px` / `14px` | Standard rounded radii for cards and media |

---

## 5. Local Setup and Deployment

This repository requires no compilation step and can be served using any static HTTP file server.

### Option A: VS Code Live Server
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

## 6. Browser Support

| Browser | Version Support | Notes |
| :--- | :--- | :--- |
| **Chromium (Chrome, Edge, Brave)** | Current / Latest | Supports all CSS features including `view-timeline` and WebM |
| **Mozilla Firefox** | Current / Latest | Native AVIF, CSS Grid, and video playback support |
| **Apple Safari** | iOS 16+ / macOS 13+ | AVIF and responsive picture element support |

---

## 7. License and Attribution

Developed by **Inscrutable21** for the VyaparPe Platform Portfolio. All rights reserved.
