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
 * Ensures hero contraption background video autoplays and loops seamlessly
 */
function initHeroVideo() {
  const heroVideo = document.getElementById('heroVideo');
  if (heroVideo) {
    heroVideo.muted = true;
    heroVideo.defaultMuted = true;
    heroVideo.setAttribute('muted', '');
    const playPromise = heroVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Fallback retry on first user click if browser policy restricts autoplay
        document.addEventListener('click', () => {
          heroVideo.play();
        }, { once: true });
      });
    }
  }
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
  const tabPills = document.querySelectorAll('.gtm-tab-pill');
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

  // Helper function: Smoothly scroll clicked button into the center of the tabs wrapper
  function centerPill(pill) {
    if (!pill || !tabsWrapper) return;
    const pillRect = pill.getBoundingClientRect();
    const wrapperRect = tabsWrapper.getBoundingClientRect();
    const currentScroll = tabsWrapper.scrollLeft;
    const targetScroll = currentScroll + (pillRect.left - wrapperRect.left) - (wrapperRect.width / 2) + (pillRect.width / 2);

    tabsWrapper.scrollTo({
      left: Math.max(0, targetScroll),
      behavior: 'smooth'
    });
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
    'automated-inbound': {
      title: 'Demo form submissions',
      theme: {
        color: '#eaf872',           // Clay Electric Lime
        text: '#141f08',
        glow: 'rgba(234, 248, 114, 0.55)',
        highlight: '#fef47a',
        highlightBorder: '#f7eb65',
        btnColor: '#647017',
        badgeBg: '#e2f4db',
        badgeColor: '#1e6324'
      },
      preview: {
        subject: 'Justin, saw your demo request',
        greeting: 'Hi Justin,',
        company: 'Acme Corp',
        token: 'relevant priority from 10-K',
        textLine: 'Is that the project that made you reach out?'
      },
      rows: [
        { check: 1, name: 'Justin', employees: '12,400', rev: 'High expans...', qual: 'Yes', phone: '(415) 555-21...', k10: 'Yes', territory: 'SMB', rep: 'Marcus DeL...', draft: 'Hey John, I n...', isHighlighted: true },
        { check: 2, name: 'Marcus', employees: '87,300', rev: 'Plan upgrad...', qual: 'Yes', phone: '(212) 555-03...', k10: 'Yes', territory: 'Enterprise', rep: 'Sarah Jenkins', draft: 'Hi Marcus, saw...', isHighlighted: false },
        { check: 3, name: 'Sarah', employees: 'Spend decr...', rev: 'No', qual: '(503) 555-7...', phone: 'Yes', k10: 'Mid-Market', territory: 'Alex Rivera', rep: 'Great chatting...', draft: '...', isHighlighted: false },
        { check: 4, name: 'David', employees: 'Plan upgrad...', rev: 'Yes', qual: '(617) 555-41...', phone: 'Yes', k10: 'Enterprise', territory: 'Elena Rostova', rep: 'Following up...', draft: '...', isHighlighted: false },
        { check: 5, name: 'Rachel', employees: 'Expansion d...', rev: 'Yes', qual: '(312) 555-90...', phone: 'Yes', k10: 'SMB', territory: 'Liam Smith', rep: 'Quick question...', draft: '...', isHighlighted: false },
        { check: 6, name: 'Christopher', employees: 'Spend decr...', rev: 'Yes', qual: '(208) 555-3...', phone: 'Yes', k10: 'Mid-Market', territory: 'Sarah Jenkins', rep: 'Checking in...', draft: '...', isHighlighted: false },
        { check: 7, name: 'Amanda', employees: 'Spend decr...', rev: 'No', qual: '(646) 555-12...', phone: 'Yes', k10: 'SMB', territory: 'Marcus DeL...', rep: 'Resource for you...', draft: '...', isHighlighted: false },
        { check: 8, name: 'Brandon', employees: 'Leadership...', rev: 'Yes', qual: '(720) 555-6...', phone: 'Yes', k10: 'Strategic', territory: 'Alex Rivera', rep: 'Congratulations on...', draft: '...', isHighlighted: false },
        { check: 9, name: 'Chloe', employees: 'Team chang...', rev: 'Yes', qual: '(404) 555-2...', phone: 'Yes', k10: 'Enterprise', territory: 'Elena Rostova', rep: 'Intro note...', draft: '...', isHighlighted: false },
        { check: 10, name: 'Devon', employees: 'No recent r...', rev: 'Yes', qual: '(818) 555-45...', phone: 'Yes', k10: 'Mid-Market', territory: 'Liam Smith', rep: 'Reconnecting...', draft: '...', isHighlighted: false }
      ]
    },
    'launch-ads': {
      title: 'LinkedIn Matched Audience Engine',
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
        subject: 'OpenAI Audience Match · 94% coverage',
        greeting: 'Campaign Synced:',
        company: 'OpenAI',
        token: 'AI Engineers Segment (Matched)',
        textLine: '14 custom buyer intent signals triggered audience push to LinkedIn Ads API.'
      },
      rows: [
        { check: 1, name: 'OpenAI', employees: '2,000', rev: 'Matched: 94%', qual: 'Active Campaign', phone: 'LI Ads API', k10: 'B2B Targeted', territory: 'AI Segment', rep: 'Growth Pod', draft: 'Ad set: GTM Automation...', isHighlighted: true },
        { check: 2, name: 'Anthropic', employees: '1,100', rev: 'Matched: 91%', qual: 'Active Campaign', phone: 'LI Ads API', k10: 'B2B Targeted', territory: 'AI Segment', rep: 'Growth Pod', draft: 'Ad set: Claude API users...', isHighlighted: false },
        { check: 3, name: 'Perplexity', employees: '450', rev: 'Matched: 88%', qual: 'Active Campaign', phone: 'LI Ads API', k10: 'Search Engine', territory: 'AI Segment', rep: 'Growth Pod', draft: 'Ad set: Product Growth...', isHighlighted: false },
        { check: 4, name: 'Mistral AI', employees: '320', rev: 'Matched: 95%', qual: 'Active Campaign', phone: 'LI Ads API', k10: 'Enterprise LLM', territory: 'EMEA Pod', rep: 'Growth Pod', draft: 'Ad set: Developer API...', isHighlighted: false }
      ]
    },
    'rep-productivity': {
      title: 'Daily Rep Routing & Slack Alerts',
      theme: {
        color: '#fdba74',           // Warm Sunset Coral / Orange
        text: '#7c2d12',
        glow: 'rgba(251, 146, 60, 0.55)',
        highlight: '#ffedd5',
        highlightBorder: '#fed7aa',
        btnColor: '#ea580c',
        badgeBg: '#fed7aa',
        badgeColor: '#c2410c'
      },
      preview: {
        subject: 'Justin Turner · Meeting Scheduled Alert',
        greeting: 'Lead Alerted:',
        company: 'Acme Corp',
        token: 'Meeting Brief Generated',
        textLine: 'Slack channel #gtm-inbound notified. Calendar invite sent to Marcus DeLorenzo.'
      },
      rows: [
        { check: 1, name: 'Justin', employees: '12,400', rev: 'Slack Alerted', qual: 'Booked', phone: 'Calendar sync', k10: 'Meeting Scheduled', territory: 'SMB', rep: 'Marcus DeL...', draft: 'Meeting prep brief sent...', isHighlighted: true },
        { check: 2, name: 'Chloe', employees: '3,200', rev: 'Slack Alerted', qual: 'Follow-up', phone: 'Task queued', k10: 'Deck downloaded', territory: 'Mid-Market', rep: 'Elena Rostova', draft: 'Follow-up sequence active...', isHighlighted: false },
        { check: 3, name: 'Sarah', employees: '8,500', rev: 'Slack Alerted', qual: 'Qualified', phone: 'Routing rule', k10: 'Security 10-K', territory: 'Enterprise', rep: 'Sarah Jenkins', draft: 'Prep packet delivered...', isHighlighted: false }
      ]
    },
    'tam-sourcing': {
      title: 'Target Account Universe (TAM)',
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
        subject: 'Stripe · Enriched Firmographics Profile',
        greeting: 'Account Intel:',
        company: 'Stripe',
        token: 'Fintech Tier-1 ICP',
        textLine: '8,200 verified employees, $14.2B ARR, 45 engineering headcount openings tracked.'
      },
      rows: [
        { check: 1, name: 'Stripe', employees: '8,200', rev: '$14.2B ARR', qual: 'Tier 1 ICP', phone: '+1 415 555-010', k10: 'Fintech Hub', territory: 'Enterprise', rep: 'Marcus DeL...', draft: 'Customized API playbook...', isHighlighted: true },
        { check: 2, name: 'Ramp', employees: '1,500', rev: '$500M ARR', qual: 'Tier 1 ICP', phone: '+1 212 555-019', k10: 'Series D', territory: 'Commercial', rep: 'Sarah Jenkins', draft: 'Corporate card alignment...', isHighlighted: false },
        { check: 3, name: 'Brex', employees: '2,100', rev: '$620M ARR', qual: 'Tier 1 ICP', phone: '+1 415 555-014', k10: 'Fintech', territory: 'Strategic', rep: 'Alex Rivera', draft: 'Scaling GTM engines...', isHighlighted: false },
        { check: 4, name: 'Vanta', employees: '650', rev: '$120M ARR', qual: 'Fast Growth', phone: '+1 415 555-022', k10: 'Security', territory: 'SMB', rep: 'Liam Smith', draft: 'Compliance integration...', isHighlighted: false }
      ]
    },
    'lead-scoring': {
      title: 'Product Qualified Leads (PQLs)',
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
        subject: 'Elena · PQL Intent Score: 99/100',
        greeting: 'Propensity Signal:',
        company: 'Enterprise AI Corp',
        token: 'High Propensity PQL',
        textLine: 'Exceeded workspace monthly credit limit 3x this week and checked enterprise pricing.'
      },
      rows: [
        { check: 1, name: 'Elena', employees: '4,500', rev: 'Fit: 99/100', qual: 'High Intent', phone: '+1 617 555-018', k10: 'Trigger: Pricing view', territory: 'Enterprise', rep: 'Sarah Jenkins', draft: 'Ready for enterprise plan...', isHighlighted: true },
        { check: 2, name: 'Marcus', employees: '12,000', rev: 'Fit: 95/100', qual: 'High Intent', phone: '+1 212 555-031', k10: 'Trigger: 10 seats add', territory: 'Enterprise', rep: 'Marcus DeL...', draft: 'Seat expansion demo...', isHighlighted: false },
        { check: 3, name: 'Devon', employees: '800', rev: 'Fit: 88/100', qual: 'Medium', phone: '+1 818 555-045', k10: 'Trigger: API limits', territory: 'Mid-Market', rep: 'Liam Smith', draft: 'Upgraded rate limits...', isHighlighted: false }
      ]
    },
    'automated-outbound': {
      title: 'Outbound Personalization Matrix',
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
        subject: 'Michael, congratulations on hiring 40 SDRs',
        greeting: 'Hi Michael,',
        company: 'CloudScale Inc',
        token: '10-K Cloud AI Expansion',
        textLine: 'Noticed your team is scaling outbound plays across North America.'
      },
      rows: [
        { check: 1, name: 'Michael', employees: '6,200', rev: 'Hiring 40 reps', qual: 'Priority A', phone: '+1 206 555-012', k10: 'AI SDR adoption', territory: 'Strategic', rep: 'Alex Rivera', draft: 'Scaling outbound pipeline...', isHighlighted: true },
        { check: 2, name: 'Sophie', employees: '1,400', rev: 'Series C raised', qual: 'Priority A', phone: '+1 415 555-018', k10: 'New CRO onboarded', territory: 'Mid-Market', rep: 'Elena Rostova', draft: 'Congrats on new funding...', isHighlighted: false },
        { check: 3, name: 'Brandon', employees: '3,800', rev: 'New CRM rollout', qual: 'Priority A', phone: '+1 720 555-061', k10: 'Salesforce migration', territory: 'Enterprise', rep: 'Marcus DeL...', draft: 'CRM enrichment playbook...', isHighlighted: false }
      ]
    },
    'crm-enrichment': {
      title: 'Salesforce & HubSpot Auto-Sync',
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
        subject: 'Linear · 18 CRM Fields Auto-Updated',
        greeting: 'CRM Integration:',
        company: 'Linear',
        token: 'Salesforce Bi-directional Sync',
        textLine: 'All account executives, phone numbers, and revenue projections refreshed automatically.'
      },
      rows: [
        { check: 1, name: 'Linear', employees: '120', rev: 'Enriched 100%', qual: 'Updated', phone: 'SFDC synced', k10: 'Tech stack verified', territory: 'Tech Pod', rep: 'Marcus DeL...', draft: 'Synced 18 fields...', isHighlighted: true },
        { check: 2, name: 'Notion', employees: '850', rev: 'Enriched 100%', qual: 'Updated', phone: 'SFDC synced', k10: 'Domain verified', territory: 'Enterprise', rep: 'Sarah Jenkins', draft: 'Synced 24 fields...', isHighlighted: false },
        { check: 3, name: 'Figma', employees: '1,300', rev: 'Enriched 100%', qual: 'Updated', phone: 'HubSpot synced', k10: 'Product data live', territory: 'Design Systems', rep: 'Alex Rivera', draft: 'Synced 32 fields...', isHighlighted: false }
      ]
    }
  };

  // 1. Tab Switching & Centering
  tabPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const tabId = pill.dataset.tab;
      const dataset = workflowDatasets[tabId] || workflowDatasets['automated-inbound'];

      // Update active pill state
      tabPills.forEach(p => p.classList.remove('is-active'));
      pill.classList.add('is-active');

      // 1a. Scroll clicked button into the center of the viewport
      centerPill(pill);

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

        // Attach click listeners to rows to allow highlighting
        tableBody.querySelectorAll('tr').forEach(r => {
          r.addEventListener('click', () => {
            tableBody.querySelectorAll('tr').forEach(row => row.classList.remove('is-highlighted'));
            r.classList.add('is-highlighted');
            const rowName = r.querySelector('.cell-name')?.textContent || 'Lead';
            if (subjectText) subjectText.textContent = `${rowName}, saw your demo request`;
            if (greetingName) greetingName.textContent = `Hi ${rowName},`;
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
            <p>I know <span>${dataset.preview.company}</span> is focused on <span class="gtm-token-pill"><span class="gtm-token-icon">T</span> ${dataset.preview.token} <span class="gtm-token-close">&times;</span></span>.</p>
            <p>${dataset.preview.textLine}</p>
            <p>Let me know if there's any additional context I should have before we meet.</p>
          `;
        }
      }
    });
  });

  // On initial load: center the initial active pill and apply its theme
  const initialActivePill = document.querySelector('.gtm-tab-pill.is-active');
  if (initialActivePill) {
    const initialDataset = workflowDatasets[initialActivePill.dataset.tab] || workflowDatasets['automated-inbound'];
    if (initialDataset.theme) {
      applyTheme(initialDataset.theme);
    }
    setTimeout(() => centerPill(initialActivePill), 150);
  }

  // 2. Interactive Form Submission
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const first = inputFirstName?.value.trim() || 'Justin';
      const last = inputLastName?.value.trim() || 'Turner';
      const comp = inputCompany?.value.trim() || 'Acme Corp';

      // Update Highlighted row in table
      const firstRow = document.getElementById('row-justin') || tableBody?.querySelector('tr');
      if (firstRow) {
        const nameCell = firstRow.querySelector('.cell-name');
        if (nameCell) nameCell.textContent = first;
        firstRow.classList.add('is-highlighted');
      }

      // Update Email Preview Card
      if (subjectText) subjectText.textContent = `${first}, saw your demo request`;
      if (greetingName) greetingName.textContent = `Hi ${first},`;
      if (companyName) companyName.textContent = comp;

      // Button feedback
      if (submitBtn) {
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Updated!';
        submitBtn.style.filter = 'brightness(1.2)';
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.style.filter = '';
        }, 1200);
      }
    });

    // Real-time typing sync
    inputFirstName?.addEventListener('input', () => {
      const val = inputFirstName.value.trim() || 'Justin';
      if (greetingName) greetingName.textContent = `Hi ${val},`;
      if (subjectText) subjectText.textContent = `${val}, saw your demo request`;
      const firstRow = document.getElementById('row-justin') || tableBody?.querySelector('tr');
      if (firstRow) {
        const nameCell = firstRow.querySelector('.cell-name');
        if (nameCell) nameCell.textContent = val;
      }
    });

    inputCompany?.addEventListener('input', () => {
      const val = inputCompany.value.trim() || 'Acme Corp';
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
  const totalLeads = 554;
  const sampleLeads = [
    { first: 'Justin', last: 'Turner', company: 'Acme Corp', rep: 'Marcus DeLorenzo' },
    { first: 'Marcus', last: 'Vance', company: 'Enterprise AI Corp', rep: 'Sarah Jenkins' },
    { first: 'Sarah', last: 'Connor', company: 'Cyberdyne Systems', rep: 'Alex Rivera' },
    { first: 'David', last: 'Hassel', company: 'Knight Industries', rep: 'Elena Rostova' }
  ];

  function updateLeadDisplay() {
    if (pageIndicator) pageIndicator.textContent = `${currentLeadIdx} of ${totalLeads}`;
    const lead = sampleLeads[(currentLeadIdx - 1) % sampleLeads.length];
    if (lead) {
      if (subjectText) subjectText.textContent = `${lead.first}, saw your demo request`;
      if (greetingName) greetingName.textContent = `Hi ${lead.first},`;
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
