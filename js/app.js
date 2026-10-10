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
