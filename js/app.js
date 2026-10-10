/**
 * VyaparPe - Hero Video & Brand Marquee Experience
 * Handles hero contraption video playback, synchronized continuous logo scroll,
 * interactive card cursor preview, and navigation controls.
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroVideo();
  initLogoMarquee();
  initNavFeatures();
  initScrollHeader();
  initGtmSection();
});

/**
 * Ensures background contraption videos autoplay and loop seamlessly
 */
function initHeroVideo() {
  const videos = [document.getElementById('heroVideo'), document.getElementById('repsVideo')].filter(Boolean);
  videos.forEach(video => {
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute('muted', '');
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Fallback retry on first user click if browser policy restricts autoplay
        document.addEventListener('click', () => {
          video.play();
        }, { once: true });
      });
    }
  });
}

/**
 * Navigation features & responsive mobile drawer toggle
 */
function initNavFeatures() {
  const mobileNavToggle = document.getElementById('mobileNavToggle');
  const mainNavLinksWrap = document.querySelector('.main-nav-links-wrap');
  if (mobileNavToggle && mainNavLinksWrap) {
    mobileNavToggle.addEventListener('click', () => {
      mainNavLinksWrap.classList.toggle('mobile-open');
    });
  }

  // Close mobile nav on click outside
  document.addEventListener('click', (e) => {
    if (mainNavLinksWrap && mainNavLinksWrap.classList.contains('mobile-open')) {
      if (!mainNavLinksWrap.contains(e.target) && !mobileNavToggle.contains(e.target)) {
        mainNavLinksWrap.classList.remove('mobile-open');
      }
    }
  });
}

/**
 * Header background opacity on scroll
 */
function initScrollHeader() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });
}

/**
 * Customer Logos Bento Grid Marquee
 * Perfectly synchronized with hero contraption video playback progress
 */
function initLogoMarquee() {
  const wrap = document.querySelector('.home-logo_wrap');
  const base = document.querySelector('.home-logo_base');
  const heroVideo = document.getElementById('heroVideo');
  if (!wrap || !base) return;

  // Build the track structure for seamless infinite scrolling
  let track = wrap.querySelector('.home-logo_track');
  if (!track) {
    track = document.createElement('div');
    track.className = 'home-logo_track';
    base.parentNode.insertBefore(track, base);
    track.appendChild(base);

    // Duplicate grid for completely seamless looping
    const clone = base.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.classList.add('home-logo_clone');
    clone.querySelectorAll('a, button').forEach(el => el.setAttribute('tabindex', '-1'));
    track.appendChild(clone);
  }

  // Calculate single set width
  let singleWidth = base.offsetWidth || 2700;
  function updateDimensions() {
    if (base.offsetWidth > 0) {
      singleWidth = base.offsetWidth;
    }
  }
  window.addEventListener('resize', updateDimensions);
  setTimeout(updateDimensions, 500);

  // Initial offset to showcase key logos (column 7 - Anthropic/Perplexity)
  let initialOffset = 0;
  const cardCol7 = base.querySelector('[data-col="7"]');
  if (cardCol7) {
    initialOffset = Math.max(0, cardCol7.offsetLeft - 60);
  }

  let currentScroll = initialOffset;
  wrap.scrollLeft = currentScroll;

  let isHovered = false;
  let isDown = false;
  let startX = 0;
  let dragStartScroll = 0;

  wrap.addEventListener('mouseenter', () => { isHovered = true; });
  wrap.addEventListener('mouseleave', () => { isHovered = false; isDown = false; });
  wrap.addEventListener('touchstart', () => { isHovered = true; }, { passive: true });
  wrap.addEventListener('touchend', () => { isHovered = false; isDown = false; }, { passive: true });

  // Mouse drag to scroll
  wrap.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - wrap.offsetLeft;
    dragStartScroll = wrap.scrollLeft;
  });

  window.addEventListener('mouseup', () => {
    if (isDown) {
      isDown = false;
      currentScroll = wrap.scrollLeft;
    }
  });

  wrap.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - wrap.offsetLeft;
    const walk = (x - startX) * 1.5;
    wrap.scrollLeft = (dragStartScroll - walk + singleWidth * 10) % singleWidth;
    currentScroll = wrap.scrollLeft;
  });

  // Continuous loop in sync with heroVideo playback
  function syncWithVideo() {
    if (!isDown && singleWidth > 0) {
      if (heroVideo && heroVideo.duration > 0 && !isNaN(heroVideo.duration)) {
        // Exact video progress: 0.0 to 1.0 matching the video contraption scene
        const progress = (heroVideo.currentTime / heroVideo.duration) % 1;
        const targetScroll = (initialOffset + progress * singleWidth) % singleWidth;

        if (!isHovered) {
          // Wrap-boundary aware lerp so it never jumps backwards
          let diff = targetScroll - currentScroll;
          if (diff < -singleWidth / 2) diff += singleWidth;
          else if (diff > singleWidth / 2) diff -= singleWidth;

          currentScroll += diff * 0.12;
          if (currentScroll >= singleWidth) currentScroll -= singleWidth;
          if (currentScroll < 0) currentScroll += singleWidth;

          wrap.scrollLeft = currentScroll;
        }
      } else if (!isHovered) {
        // Fallback smooth linear glide if video is buffering or unavailable
        currentScroll = (currentScroll + 0.65) % singleWidth;
        wrap.scrollLeft = currentScroll;
      }
    }
    requestAnimationFrame(syncWithVideo);
  }
  requestAnimationFrame(syncWithVideo);

  // Setup floating quote cursor follower
  initLogoCursor();
}

/**
 * Interactive floating cursor showing customer avatar and quote attribution
 */
function initLogoCursor() {
  const cursor = document.querySelector('[data-logo="cursor"]');
  if (!cursor) return;

  const cursorAvatar = cursor.querySelector('[data-logo-cursor="avatar"]');
  const cursorName = cursor.querySelector('[data-logo-cursor="name"]');
  const cursorTitle = cursor.querySelector('[data-logo-cursor="title"]');

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  let activeCard = null;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function updateCursor() {
    if (activeCard) {
      cursorX += (mouseX - cursorX) * 0.22;
      cursorY += (mouseY - cursorY) * 0.22;
      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -125%)`;
    }
    requestAnimationFrame(updateCursor);
  }
  requestAnimationFrame(updateCursor);

  document.addEventListener('mouseover', (e) => {
    const card = e.target.closest('.logo-card');
    if (card && card.querySelector('[data-logo="name"]')) {
      const nameEl = card.querySelector('[data-logo="name"]');
      const titleEl = card.querySelector('[data-logo="title"]');
      const avatarEl = card.querySelector('[data-logo="avatar"]');
      const name = nameEl ? nameEl.textContent.trim() : '';

      if (name) {
        activeCard = card;
        if (cursorName) cursorName.textContent = name;
        if (cursorTitle) cursorTitle.textContent = titleEl ? titleEl.textContent.trim() : '';
        if (cursorAvatar && avatarEl && avatarEl.src) {
          cursorAvatar.src = avatarEl.src;
        }
        cursor.classList.add('is-active');
        cursorX = mouseX;
        cursorY = mouseY;
      }
    }
  });

  document.addEventListener('mouseout', (e) => {
    const card = e.target.closest('.logo-card');
    if (card && (!e.relatedTarget || !card.contains(e.relatedTarget))) {
      activeCard = null;
      cursor.classList.remove('is-active');
    }
  });
}

/**
 * GTM Engineers Build on Clay - Interactive Experience
 * Handles workflow tab switching, interactive form demo submissions,
 * real-time email preview updates, and panel toggling.
 */
function initGtmSection() {
  const section = document.querySelector('.section_gtm-engineers');
  const tabsWrapper = document.querySelector('.gtm-tabs-wrapper');
  const tabsList = document.querySelector('.gtm-tabs-list');
  const tableTitle = document.getElementById('gtmTableTitle');
  const tableBody = document.getElementById('gtmTableBody');
  const limeBackdrop = document.querySelector('.gtm-lime-backdrop');
  const form = document.getElementById('gtmDemoForm');
  const inputFirstName = document.getElementById('gtmFirstName');
  const inputLastName = document.getElementById('gtmLastName');
  const inputCompany = document.getElementById('gtmCompany');
  const submitBtn = document.getElementById('gtmSubmitBtn');

  // Preview elements
  const emailTabBtn = document.getElementById('gtmEmailTabBtn');
  const leadTabBtn = document.getElementById('gtmLeadTabBtn');
  const emailViewPanel = document.getElementById('gtmEmailViewPanel');
  const leadViewPanel = document.getElementById('gtmLeadViewPanel');
  const subjectText = document.getElementById('gtmSubjectText');
  const greetingName = document.getElementById('gtmGreetingName');
  const companyName = document.getElementById('gtmCompanyName');
  const emailBodyContent = document.getElementById('gtmEmailBodyContent');
  const pageIndicator = document.getElementById('gtmPageIndicator');
  const prevLeadBtn = document.getElementById('gtmPrevLeadBtn');
  const nextLeadBtn = document.getElementById('gtmNextLeadBtn');

  // Helper function: Smoothly glide track so clicked button is positioned in the exact dead center
  function centerPill(pill, smooth = true) {
    if (!pill || !tabsWrapper || !tabsList) return;
    const wrapperWidth = tabsWrapper.clientWidth;
    const pillOffsetLeft = pill.offsetLeft;
    const pillWidth = pill.offsetWidth;
    const targetX = (wrapperWidth / 2) - (pillOffsetLeft + pillWidth / 2);

    if (smooth) {
      tabsList.style.transition = 'transform 0.45s cubic-bezier(0.2, 0.9, 0.3, 1)';
    } else {
      tabsList.style.transition = 'none';
    }
    tabsList.style.transform = `translateX(${Math.round(targetX)}px)`;
  }

  // Helper function: Apply dynamic theme colors to the section, box backdrop, and accents
  function applyTheme(theme) {
    if (!theme) return;
    if (section) {
      section.style.setProperty('--gtm-theme-color', theme.color);
      section.style.setProperty('--gtm-theme-text', theme.text);
      section.style.setProperty('--gtm-theme-glow', theme.glow);
      section.style.setProperty('--gtm-theme-highlight', theme.highlight);
      section.style.setProperty('--gtm-theme-highlight-border', theme.highlightBorder);
      section.style.setProperty('--gtm-theme-btn', theme.btnColor);
      section.style.setProperty('--gtm-theme-badge-bg', theme.badgeBg);
      section.style.setProperty('--gtm-theme-badge-color', theme.badgeColor);
    }
    if (limeBackdrop) {
      limeBackdrop.style.backgroundColor = theme.color;
      limeBackdrop.style.boxShadow = `0 24px 65px -15px ${theme.glow}`;
    }
  }

  // Workflows data repository with unique color schemes per button
  const workflowDatasets = {
    'ai-storefront': {
      title: 'Live Storefront & Delivery Stream',
      theme: {
        color: '#eaf872',           // Electric Lime
        text: '#141f08',
        glow: 'rgba(234, 248, 114, 0.55)',
        highlight: '#fef47a',
        highlightBorder: '#f7eb65',
        btnColor: '#647017',
        badgeBg: '#e2f4db',
        badgeColor: '#1e6324'
      },
      preview: {
        subject: 'Kavya Organics · Quick Commerce Order #VP-9042',
        greeting: 'Order Confirmed: #VP-9042',
        company: 'Kavya Organics',
        token: '2x Glow Serum + 1x Rose Mist',
        textLine: 'AI Action: Stock reserved at Dark Store Hub-2. Dunzo rider dispatched with 9-minute delivery guarantee. ₹1,490 received via UPI 1-Click.'
      },
      rows: [
        { check: 1, name: 'Kavya Organics', employees: 'Beauty & Care', rev: '1,240 / day', qual: '10 Mins', phone: '+91 98201 54...', k10: 'Auto-Dispatched', territory: 'Indiranagar', rep: 'Quick Comm', draft: 'Rider En Route', isHighlighted: true },
        { check: 2, name: 'BeanCrafters', employees: 'Artisan Coffee', rev: '860 / day', qual: 'Same Day', phone: '+91 99302 11...', k10: 'Order Packed', territory: 'Bandra West', rep: 'D2C Web', draft: 'Ready for Pickup', isHighlighted: false },
        { check: 3, name: 'DailyMunch Groceries', employees: 'Instant Mart', rev: '3,450 / day', qual: '12 Mins', phone: '+91 97110 88...', k10: 'Inventory Synced', territory: 'Koramangala', rep: 'Quick Comm', draft: 'Delivered (9m)', isHighlighted: false },
        { check: 4, name: 'Silk & Thread', employees: 'Apparel / D2C', rev: '540 / day', qual: 'Express 2-Day', phone: '+91 98450 33...', k10: 'WhatsApp Upsell', territory: 'Gurgaon Sec 29', rep: 'D2C Store', draft: 'Shipped', isHighlighted: false },
        { check: 5, name: 'The NutriBowl', employees: 'Healthy Foods', rev: '1,820 / day', qual: '15 Mins', phone: '+91 90041 22...', k10: 'Stock Reserved', territory: 'HSR Layout', rep: 'Quick Comm', draft: 'Rider Assigned', isHighlighted: false },
        { check: 6, name: 'Volt Gadgets', employees: 'Electronics', rev: '720 / day', qual: 'Next Day', phone: '+91 98190 77...', k10: 'Cart Recovered', territory: 'Andheri East', rep: 'D2C Web', draft: 'UPI Paid', isHighlighted: false }
      ]
    },
    'quick-commerce': {
      title: '10-Minute Dark Store Fulfillment Stream',
      theme: {
        color: '#7dd3fc',           // Sky Cyan Blue
        text: '#0c4a6e',
        glow: 'rgba(56, 189, 248, 0.55)',
        highlight: '#e0f2fe',
        highlightBorder: '#7dd3fc',
        btnColor: '#0284c7',
        badgeBg: '#bae6fd',
        badgeColor: '#0369a1'
      },
      preview: {
        subject: 'BlinkIt / Zepto Dark Store Picker Sync',
        greeting: 'Dispatch Hub #04:',
        company: 'DailyMunch Groceries',
        token: '12 Items Packed in 68 Seconds',
        textLine: 'Automated barcode scanner verified 12 SKUs. Autonomous handoff to Shadowfax express rider.'
      },
      rows: [
        { check: 1, name: 'DailyMunch', employees: 'Grocery', rev: '3,450 / day', qual: '8 Mins Avg', phone: 'Picker App', k10: 'Batch #419', territory: 'Koramangala Hub', rep: 'Quick Comm', draft: 'Handed to Rider', isHighlighted: true },
        { check: 2, name: 'FreshGreens', employees: 'Produce', rev: '2,100 / day', qual: '10 Mins Avg', phone: 'Picker App', k10: 'Batch #420', territory: 'Whitefield Hub', rep: 'Quick Comm', draft: 'Packing (45s)', isHighlighted: false },
        { check: 3, name: 'BakeCraft', employees: 'Bakery', rev: '680 / day', qual: '14 Mins Avg', phone: 'Picker App', k10: 'Hot Dispatch', territory: 'Saket Hub', rep: 'Quick Comm', draft: 'En Route', isHighlighted: false }
      ]
    },
    'dark-store-sync': {
      title: 'Dark Store Multi-Warehouse Inventory Sync',
      theme: {
        color: '#fdba74',           // Warm Sunset Orange
        text: '#7c2d12',
        glow: 'rgba(251, 146, 60, 0.55)',
        highlight: '#ffedd5',
        highlightBorder: '#fed7aa',
        btnColor: '#ea580c',
        badgeBg: '#fed7aa',
        badgeColor: '#c2410c'
      },
      preview: {
        subject: 'Real-Time Stock Threshold Auto-Replenish',
        greeting: 'Inventory Alert:',
        company: 'Silk & Thread D2C',
        token: 'Low Stock Auto-PO Generated',
        textLine: 'Dark Store South inventory dipped below 15 units. PO #892 auto-routed to central factory.'
      },
      rows: [
        { check: 1, name: 'Silk & Thread', employees: 'Apparel', rev: '450 SKUs', qual: '99.4% Sync', phone: 'RFID / Barcode', k10: 'Auto-Replenish', territory: 'Delhi NCR Hub', rep: 'Inventory AI', draft: 'PO Generated', isHighlighted: true },
        { check: 2, name: 'Volt Gadgets', employees: 'Tech', rev: '120 SKUs', qual: '100% Sync', phone: 'API Sync', k10: 'Surge Protected', territory: 'Mumbai Hub', rep: 'Inventory AI', draft: 'Synced', isHighlighted: false },
        { check: 3, name: 'NutriBowl', employees: 'FMCG', rev: '340 SKUs', qual: '99.8% Sync', phone: 'Weigh Scale API', k10: 'Batch Tracked', territory: 'Bengaluru Hub', rep: 'Inventory AI', draft: 'Ready', isHighlighted: false }
      ]
    },
    'whatsapp-agent': {
      title: 'WhatsApp Conversational Commerce Bot',
      theme: {
        color: '#6ee7b7',           // Mint Emerald Green
        text: '#064e3b',
        glow: 'rgba(52, 211, 153, 0.55)',
        highlight: '#d1fae5',
        highlightBorder: '#a7f3d0',
        btnColor: '#059669',
        badgeBg: '#a7f3d0',
        badgeColor: '#047857'
      },
      preview: {
        subject: 'Aarav, your cart items are selling fast!',
        greeting: 'WhatsApp Bot Session:',
        company: 'Kavya Organics',
        token: 'Abandoned Cart Recovered (₹1,890)',
        textLine: 'Customer tapped 1-Click UPI button on WhatsApp. Order placed and receipt sent in 12 seconds.'
      },
      rows: [
        { check: 1, name: 'Aarav Mehta', employees: 'Indiranagar', rev: '₹1,890 Cart', qual: 'Recovered', phone: '+91 98450 12...', k10: '1-Tap UPI Link', territory: 'WhatsApp Bot', rep: 'AI Sales Agent', draft: 'Order Placed', isHighlighted: true },
        { check: 2, name: 'Simran Kaur', employees: 'Bandra', rev: '₹2,450 Cart', qual: 'Upsold +1 SKU', phone: '+91 98200 88...', k10: 'AI Recommendation', territory: 'WhatsApp Bot', rep: 'AI Sales Agent', draft: 'UPI Paid', isHighlighted: false },
        { check: 3, name: 'Rohan Gupta', employees: 'Gurgaon', rev: '₹990 Order', qual: 'Live Tracking', phone: '+91 97110 55...', k10: 'Rider GPS Shared', territory: 'WhatsApp Bot', rep: 'Support AI', draft: 'Delivered', isHighlighted: false }
      ]
    },
    'instant-checkout': {
      title: '1-Click UPI & Frictionless Checkout Engine',
      theme: {
        color: '#c4b5fd',           // Soft Lilac Lavender
        text: '#4c1d95',
        glow: 'rgba(167, 139, 250, 0.55)',
        highlight: '#f3e8ff',
        highlightBorder: '#ddd6fe',
        btnColor: '#7c3aed',
        badgeBg: '#ede9fe',
        badgeColor: '#6d28d9'
      },
      preview: {
        subject: '1-Tap Checkout · 74% Higher Conversion',
        greeting: 'Payment Session:',
        company: 'BeanCrafters D2C',
        token: 'PhonePe / GPay Instant Intent',
        textLine: 'No OTP, no address re-typing. Pre-filled Indian customer addresses via VyaparPe Network ID.'
      },
      rows: [
        { check: 1, name: 'BeanCrafters', employees: 'Coffee', rev: '₹840 / order', qual: '1-Tap UPI', phone: 'PhonePe Intent', k10: 'Auto Address', territory: 'Pan India', rep: 'Checkout OS', draft: '0% MDR Settled', isHighlighted: true },
        { check: 2, name: 'Kavya Organics', employees: 'Beauty', rev: '₹1,490 / order', qual: '1-Tap GPay', phone: 'GPay Intent', k10: 'Pre-filled KYC', territory: 'Metro Cities', rep: 'Checkout OS', draft: 'Instant Bank Sync', isHighlighted: false },
        { check: 3, name: 'Silk & Thread', employees: 'Fashion', rev: '₹3,200 / order', qual: 'Cards + EMI', phone: 'Razorpay PG', k10: '3D Secure Auto', territory: 'Tier 1 & 2', rep: 'Checkout OS', draft: 'Captured', isHighlighted: false }
      ]
    },
    'ai-catalogue': {
      title: 'AI Product Photography & Catalog Studio',
      theme: {
        color: '#f9a8d4',           // Vibrant Rose Pink
        text: '#831843',
        glow: 'rgba(244, 114, 182, 0.55)',
        highlight: '#ffe4e6',
        highlightBorder: '#fbcfe8',
        btnColor: '#db2777',
        badgeBg: '#fce7f3',
        badgeColor: '#be185d'
      },
      preview: {
        subject: '40 Raw Smartphone Photos Converted to Studio 4K',
        greeting: 'Studio Generation:',
        company: 'The NutriBowl',
        token: '4K Studio Model Lighting & Shadows',
        textLine: 'AI generated 40 lifestyle studio angles, nutrition labels, and Google Merchant SEO descriptions in 90 seconds.'
      },
      rows: [
        { check: 1, name: 'The NutriBowl', employees: 'Health Food', rev: '40 New SKUs', qual: '4K Rendered', phone: 'AI Studio', k10: 'SEO Generated', territory: 'E-Comm Web', rep: 'Catalog AI', draft: 'Published Live', isHighlighted: true },
        { check: 2, name: 'Aura Decor', employees: 'Handicrafts', rev: '65 New SKUs', qual: '3D Augmented', phone: 'AI Studio', k10: 'AR Preview Ready', territory: 'D2C Store', rep: 'Catalog AI', draft: 'Published Live', isHighlighted: false },
        { check: 3, name: 'Pawfect Care', employees: 'Pets', rev: '28 New SKUs', qual: 'Clean White Bg', phone: 'AI Studio', k10: 'Barcode Mapped', territory: 'Quick Comm', rep: 'Catalog AI', draft: 'Published Live', isHighlighted: false }
      ]
    },
    'fleet-routing': {
      title: 'Hyperlocal Rider Fleet Dispatch Engine',
      theme: {
        color: '#fde047',           // Warm Golden Amber
        text: '#713f12',
        glow: 'rgba(250, 204, 21, 0.55)',
        highlight: '#fef08a',
        highlightBorder: '#fde047',
        btnColor: '#ca8a04',
        badgeBg: '#fef9c3',
        badgeColor: '#a16207'
      },
      preview: {
        subject: 'Autonomous Rider Matching · Sub-3 Min Pickup',
        greeting: 'Fleet Allocation:',
        company: 'DailyMunch Quick Mart',
        token: 'Dunzo + Shadowfax Smart Router',
        textLine: 'AI route optimizer combined 3 neighbouring orders in Koramangala into a single 14-minute multi-drop run.'
      },
      rows: [
        { check: 1, name: 'Koramangala Hub #02', employees: '18 Active Riders', rev: '11 Min Avg ETA', qual: '3-Order Batch', phone: 'Dunzo Fleet API', k10: 'Optimal Route', territory: 'Zone A', rep: 'Fleet AI', draft: 'Dispatched', isHighlighted: true },
        { check: 2, name: 'Indiranagar Hub #01', employees: '24 Active Riders', rev: '9 Min Avg ETA', qual: 'Single Drop', phone: 'Shadowfax API', k10: 'Express Priority', territory: 'Zone B', rep: 'Fleet AI', draft: 'En Route', isHighlighted: false },
        { check: 3, name: 'HSR Layout Hub #05', employees: '15 Active Riders', rev: '12 Min Avg ETA', qual: '2-Order Batch', phone: 'Porter Hyperlocal', k10: 'Traffic Avoided', territory: 'Zone C', rep: 'Fleet AI', draft: 'Dispatched', isHighlighted: false }
      ]
    }
  };

  // 1. Tab Switching & Centering via Event Delegation
  tabsList.addEventListener('click', (e) => {
    const pill = e.target.closest('.gtm-tab-pill');
    if (!pill) return;

    const tabId = pill.dataset.tab;
    const dataset = workflowDatasets[tabId] || workflowDatasets['ai-storefront'];

    // Update active pill state
    tabsList.querySelectorAll('.gtm-tab-pill').forEach(p => p.classList.remove('is-active'));
    pill.classList.add('is-active');

    // 1a. Move clicked button smoothly to the dead center
    centerPill(pill, true);

    // 1b. Change box color and button active color to this button's theme
    if (dataset.theme) {
      applyTheme(dataset.theme);
    }

    // 1c. Update table title
    if (tableTitle) {
      tableTitle.textContent = dataset.title;
    }

    // 1d. Update spreadsheet table rows
    if (tableBody && dataset.rows) {
      tableBody.innerHTML = dataset.rows.map(row => `
        <tr class="${row.isHighlighted ? 'is-highlighted' : ''}">
          <td class="col-check"><span class="gtm-checkbox-box"></span> ${row.check}</td>
          <td class="cell-name">${row.name}</td>
          <td>${row.employees}</td>
          <td>${row.rev}</td>
          <td>${row.qual}</td>
          <td>${row.phone}</td>
          <td>${row.k10}</td>
          <td>${row.territory}</td>
          <td>${row.rep}</td>
          <td>${row.draft}</td>
        </tr>
      `).join('');

      tableBody.querySelectorAll('tr').forEach(r => {
        r.addEventListener('click', () => {
          tableBody.querySelectorAll('tr').forEach(row => row.classList.remove('is-highlighted'));
          r.classList.add('is-highlighted');
          const rowName = r.querySelector('.cell-name')?.textContent || 'Store';
          if (subjectText) subjectText.textContent = `${rowName} · Live Order Processed`;
          if (greetingName) greetingName.textContent = `Order Confirmed: ${rowName}`;
        });
      });
    }

    // 1e. Update preview card content
    if (dataset.preview) {
      if (subjectText) subjectText.textContent = dataset.preview.subject;
      if (greetingName) greetingName.textContent = dataset.preview.greeting;
      if (companyName) companyName.textContent = dataset.preview.company;
      if (emailBodyContent) {
        emailBodyContent.innerHTML = `
          <p><span>${dataset.preview.greeting}</span></p>
          <p>Store: <span>${dataset.preview.company}</span></p>
          <p>Items: <span class="gtm-token-pill"><span class="gtm-token-icon">★</span> ${dataset.preview.token} <span class="gtm-token-close">&times;</span></span></p>
          <p>${dataset.preview.textLine}</p>
        `;
      }
    }
  });

  // Center initial active button on load
  const initialActive = tabsList.querySelector('.gtm-tab-pill.is-active') || tabsList.querySelector('.gtm-tab-pill[data-tab="ai-storefront"]');
  if (initialActive) {
    const initialDataset = workflowDatasets[initialActive.dataset.tab] || workflowDatasets['ai-storefront'];
    if (initialDataset.theme) {
      applyTheme(initialDataset.theme);
    }
    centerPill(initialActive, false);
    requestAnimationFrame(() => centerPill(initialActive, false));
    setTimeout(() => centerPill(initialActive, false), 120);
    setTimeout(() => centerPill(initialActive, false), 350);
  }

  // Ensure centering remains exact once web fonts load
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      const currentActive = tabsList.querySelector('.gtm-tab-pill.is-active');
      if (currentActive) centerPill(currentActive, false);
    });
  }

  // Keep active button centered on window resize
  window.addEventListener('resize', () => {
    const currentActive = tabsList.querySelector('.gtm-tab-pill.is-active');
    if (currentActive) {
      centerPill(currentActive, false);
    }
  });

  // 2. Interactive Form Submission
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const first = inputFirstName?.value.trim() || 'Kavya Organics';
      const last = inputLastName?.value.trim() || 'Beauty & Wellness';
      const comp = inputCompany?.value.trim() || '10-Min Quick Commerce';

      // Update Highlighted row in table
      const firstRow = document.getElementById('row-justin') || tableBody?.querySelector('tr');
      if (firstRow) {
        const nameCell = firstRow.querySelector('.cell-name');
        if (nameCell) nameCell.textContent = first;
        firstRow.classList.add('is-highlighted');
      }

      // Update Preview Card
      if (subjectText) subjectText.textContent = `${first} · AI Storefront Ready`;
      if (greetingName) greetingName.textContent = `Store Launched: ${first}`;
      if (companyName) companyName.textContent = first;

      // Button feedback
      if (submitBtn) {
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Store Created!';
        submitBtn.style.filter = 'brightness(1.2)';
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.style.filter = '';
        }, 1200);
      }
    });

    // Real-time typing sync
    inputFirstName?.addEventListener('input', () => {
      const val = inputFirstName.value.trim() || 'Kavya Organics';
      if (greetingName) greetingName.textContent = `Store Launched: ${val}`;
      if (subjectText) subjectText.textContent = `${val} · Quick Commerce Order`;
      const firstRow = document.getElementById('row-justin') || tableBody?.querySelector('tr');
      if (firstRow) {
        const nameCell = firstRow.querySelector('.cell-name');
        if (nameCell) nameCell.textContent = val;
      }
    });

    inputCompany?.addEventListener('input', () => {
      const val = inputCompany.value.trim() || '10-Min Quick Commerce';
      if (companyName) companyName.textContent = val;
    });
  }

  // 3. Email Preview vs Lead Data Panel Toggle
  if (emailTabBtn && leadTabBtn && emailViewPanel && leadViewPanel) {
    emailTabBtn.addEventListener('click', () => {
      emailTabBtn.classList.add('is-active');
      leadTabBtn.classList.remove('is-active');
      emailViewPanel.style.display = 'block';
      leadViewPanel.style.display = 'none';
    });

    leadTabBtn.addEventListener('click', () => {
      leadTabBtn.classList.add('is-active');
      emailTabBtn.classList.remove('is-active');
      emailViewPanel.style.display = 'none';
      leadViewPanel.style.display = 'block';
    });
  }

  // 4. Pagination Buttons
  let currentLeadIdx = 1;
  const totalLeads = 1240;
  const sampleLeads = [
    { first: 'Kavya Organics', last: 'Beauty', company: 'Indiranagar Hub #02' },
    { first: 'BeanCrafters', last: 'Coffee', company: 'Bandra West Hub #01' },
    { first: 'DailyMunch', last: 'Grocery', company: 'Koramangala Hub #04' },
    { first: 'Silk & Thread', last: 'Fashion', company: 'Gurgaon Hub #07' }
  ];

  function updateLeadDisplay() {
    if (pageIndicator) pageIndicator.textContent = `${currentLeadIdx} of ${totalLeads}`;
    const lead = sampleLeads[(currentLeadIdx - 1) % sampleLeads.length];
    if (lead) {
      if (subjectText) subjectText.textContent = `${lead.first} · Quick Commerce Order`;
      if (greetingName) greetingName.textContent = `Order Confirmed: ${lead.first}`;
      if (companyName) companyName.textContent = lead.company;
      if (inputFirstName) inputFirstName.value = lead.first;
      if (inputLastName) inputLastName.value = lead.last;
      if (inputCompany) inputCompany.value = lead.company;

      // Update row selection
      if (tableBody) {
        const rows = tableBody.querySelectorAll('tr');
        rows.forEach((r, idx) => {
          if (idx === (currentLeadIdx - 1) % rows.length) {
            r.classList.add('is-highlighted');
          } else {
            r.classList.remove('is-highlighted');
          }
        });
      }
    }
  }

  if (prevLeadBtn) {
    prevLeadBtn.addEventListener('click', () => {
      if (currentLeadIdx > 1) {
        currentLeadIdx--;
        updateLeadDisplay();
      }
    });
  }

  if (nextLeadBtn) {
    nextLeadBtn.addEventListener('click', () => {
      if (currentLeadIdx < totalLeads) {
        currentLeadIdx++;
        updateLeadDisplay();
      }
    });
  }
}
