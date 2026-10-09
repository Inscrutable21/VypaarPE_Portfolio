/**
 * VyaparPe - Next-Gen Bharat Fintech & Merchant Payments Platform
 * Core Application Logic, Web Audio API Sound Synthesizer,
 * Multi-Language Speech Synthesis, POS Billing Engine & Live Dashboard
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroVideo();
  initAudioSynthesizer();
  initHeroSimulator();
  initVoicePlayground();
  initProductTabs();
  initBillingEngine();
  initCalculator();
  initLiveDashboard();
  initModals();
  initChatAssistant();
  initFaqAccordion();
  initLanguageToggle();
  initScrollHeader();
});

function initHeroVideo() {
  const heroVideo = document.getElementById('heroVideo');
  if (heroVideo) {
    heroVideo.muted = true;
    heroVideo.defaultMuted = true;
    heroVideo.setAttribute('muted', '');
    const playPromise = heroVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Retry playing once user interacts if browser restricts
        document.addEventListener('click', () => {
          heroVideo.play();
        }, { once: true });
      });
    }
  }
}

/* ==========================================================================
   1. Web Audio API Sound Synthesizer (Zero External Dependencies)
   ========================================================================== */
let audioCtx = null;
let soundEnabled = true;

function initAudioSynthesizer() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (AudioContext) {
    audioCtx = new AudioContext();
  }
}

// Ensure AudioContext is resumed after user interaction
function ensureAudioContext() {
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

/**
 * Play authentic signature payment success chime
 */
function playPaymentChime() {
  if (!soundEnabled) return;
  ensureAudioContext();
  if (!audioCtx) return;

  const now = audioCtx.currentTime;

  // Primary tone (High crystal chime)
  const osc1 = audioCtx.createOscillator();
  const gain1 = audioCtx.createGain();
  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(880, now); // A5
  osc1.frequency.exponentialRampToValueAtTime(1760, now + 0.12); // A6
  gain1.gain.setValueAtTime(0.4, now);
  gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

  osc1.connect(gain1);
  gain1.connect(audioCtx.destination);
  osc1.start(now);
  osc1.stop(now + 0.7);

  // Secondary harmonic chime for rich acoustic feel
  const osc2 = audioCtx.createOscillator();
  const gain2 = audioCtx.createGain();
  osc2.type = 'triangle';
  osc2.frequency.setValueAtTime(1318.51, now + 0.08); // E6
  gain2.gain.setValueAtTime(0.3, now + 0.08);
  gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

  osc2.connect(gain2);
  gain2.connect(audioCtx.destination);
  osc2.start(now + 0.08);
  osc2.stop(now + 0.85);
}

/**
 * Play gentle click or receipt beep
 */
function playBeep() {
  if (!soundEnabled) return;
  ensureAudioContext();
  if (!audioCtx) return;

  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(1200, now);
  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(now);
  osc.stop(now + 0.1);
}

/* ==========================================================================
   2. Web Speech Synthesis for Multi-Language Soundbox Alerts
   ========================================================================== */
const soundboxPhrases = {
  hi: (amt) => `व्यापार पे पर ${amt} रुपये प्राप्त हुए!`,
  en: (amt) => `Received ${amt} rupees on VyaparPe!`,
  mr: (amt) => `व्यापार पे वर ${amt} रुपये जमा झाले!`,
  ta: (amt) => `வியாபார்பேயில் ${amt} ரூபாய் பெறப்பட்டது!`,
  te: (amt) => `వ్యాపార్‌పే లో ${amt} రూపాయలు అందాయి!`,
  gu: (amt) => `વ્યાપાર પે પર ${amt} રૂપિયા મળ્યા!`,
  bn: (amt) => `ব্যাপার পে-তে ${amt} টাকা জমা হয়েছে!`
};

function speakSoundboxAlert(amount, lang = 'hi', onStartCallback = null, onEndCallback = null) {
  playPaymentChime();

  if ('speechSynthesis' in window) {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const phraseFunc = soundboxPhrases[lang] || soundboxPhrases['hi'];
    const message = phraseFunc(amount);

    const utterance = new SpeechSynthesisUtterance(message);
    utterance.rate = 1.0;
    utterance.pitch = 1.05;

    // Set voice language if available
    const langCodes = {
      hi: 'hi-IN',
      en: 'en-IN',
      mr: 'mr-IN',
      ta: 'ta-IN',
      te: 'te-IN',
      gu: 'gu-IN',
      bn: 'bn-IN'
    };
    utterance.lang = langCodes[lang] || 'hi-IN';

    utterance.onstart = () => {
      if (onStartCallback) onStartCallback();
    };

    utterance.onend = () => {
      if (onEndCallback) onEndCallback();
    };

    utterance.onerror = () => {
      if (onEndCallback) onEndCallback();
    };

    // Small delay for chime to ring first
    setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 280);
  } else {
    if (onStartCallback) onStartCallback();
    setTimeout(() => {
      if (onEndCallback) onEndCallback();
    }, 1500);
  }
}

/* ==========================================================================
   3. Hero Interactive Soundbox Simulator
   ========================================================================== */
function initHeroSimulator() {
  const terminalDisplayVal = document.getElementById('terminalDisplayVal');
  const customAmountInput = document.getElementById('customAmountInput');
  const simulatePaymentBtn = document.getElementById('simulatePaymentBtn');
  const toastAlert = document.getElementById('heroPaymentToast');
  const toastAmount = document.getElementById('toastAmount');
  const amountPills = document.querySelectorAll('.hero-amt-pill');

  let currentAmount = 500;

  amountPills.forEach(pill => {
    pill.addEventListener('click', () => {
      amountPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentAmount = parseInt(pill.dataset.amount, 10);
      if (customAmountInput) customAmountInput.value = currentAmount;
      if (terminalDisplayVal) terminalDisplayVal.textContent = `₹${currentAmount.toLocaleString('en-IN')}`;
      playBeep();
    });
  });

  if (customAmountInput) {
    customAmountInput.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      if (!isNaN(val) && val > 0) {
        currentAmount = val;
        if (terminalDisplayVal) terminalDisplayVal.textContent = `₹${currentAmount.toLocaleString('en-IN')}`;
        amountPills.forEach(p => p.classList.remove('active'));
      }
    });
  }

  if (simulatePaymentBtn) {
    simulatePaymentBtn.addEventListener('click', () => {
      simulatePaymentBtn.disabled = true;
      simulatePaymentBtn.innerHTML = `<span>⚡ Processing Payment...</span>`;

      // Trigger voice & chime
      speakSoundboxAlert(currentAmount, 'hi', () => {
        // Show toast alert
        if (toastAlert && toastAmount) {
          toastAmount.textContent = `₹${currentAmount.toLocaleString('en-IN')}`;
          toastAlert.classList.add('show');
        }
      }, () => {
        simulatePaymentBtn.disabled = false;
        simulatePaymentBtn.innerHTML = `<span>⚡ Simulate Payment Alert</span>`;
        setTimeout(() => {
          if (toastAlert) toastAlert.classList.remove('show');
        }, 3500);
      });

      // Add to live dashboard feed
      addLiveTransaction({
        name: getRandomCustomerName(),
        amount: currentAmount,
        app: getRandomPaymentApp(),
        time: 'Just now'
      });

      // Fire confetti celebration
      triggerConfetti();
    });
  }
}

/* ==========================================================================
   4. Multi-Language Voice Playground
   ========================================================================== */
function initVoicePlayground() {
  const langPills = document.querySelectorAll('.voice-lang-pill');
  const testVoiceBtn = document.getElementById('testVoiceBtn');
  const voicePlaygroundAmt = document.getElementById('voicePlaygroundAmt');
  const voiceBubbleText = document.getElementById('voiceBubbleText');
  const waveBars = document.querySelectorAll('.waveform-anim .wave-bar');

  let selectedLang = 'hi';

  function updatePreviewText() {
    const amt = voicePlaygroundAmt ? (parseInt(voicePlaygroundAmt.value, 10) || 250) : 250;
    const phrase = soundboxPhrases[selectedLang] || soundboxPhrases['hi'];
    if (voiceBubbleText) {
      voiceBubbleText.textContent = `"${phrase(amt)}"`;
    }
  }

  langPills.forEach(pill => {
    pill.addEventListener('click', () => {
      langPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      selectedLang = pill.dataset.lang;
      updatePreviewText();
      playBeep();
    });
  });

  if (voicePlaygroundAmt) {
    voicePlaygroundAmt.addEventListener('input', updatePreviewText);
  }

  if (testVoiceBtn) {
    testVoiceBtn.addEventListener('click', () => {
      const amt = voicePlaygroundAmt ? (parseInt(voicePlaygroundAmt.value, 10) || 250) : 250;

      testVoiceBtn.disabled = true;
      testVoiceBtn.textContent = '🔊 Playing Announcement...';

      speakSoundboxAlert(amt, selectedLang, () => {
        waveBars.forEach(b => b.classList.add('speaking'));
      }, () => {
        waveBars.forEach(b => b.classList.remove('speaking'));
        testVoiceBtn.disabled = false;
        testVoiceBtn.textContent = '▶ Play Audio Alert';
      });
    });
  }

  updatePreviewText();
}

/* ==========================================================================
   5. Product Showcase Tabs
   ========================================================================== */
function initProductTabs() {
  const tabBtns = document.querySelectorAll('.eco-tab-btn');
  const tabPanes = document.querySelectorAll('.eco-tab-pane');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.tab;

      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPane = document.getElementById(targetId);
      if (targetPane) targetPane.classList.add('active');

      playBeep();
    });
  });
}

/* ==========================================================================
   6. Vyapar Instant Billing POS & GST Invoice Engine
   ========================================================================== */
let billingItems = [
  { name: 'Basmati Rice 5kg', price: 420, qty: 1, gst: 5 },
  { name: 'Desi Ghee 1L', price: 650, qty: 1, gst: 12 },
  { name: 'Masala Pack 500g', price: 180, qty: 2, gst: 5 }
];

function initBillingEngine() {
  const addItemBtn = document.getElementById('addBillingItemBtn');
  const itemNameInput = document.getElementById('billingItemName');
  const itemPriceInput = document.getElementById('billingItemPrice');
  const itemQtyInput = document.getElementById('billingItemQty');
  const itemGstSelect = document.getElementById('billingItemGst');
  const printReceiptBtn = document.getElementById('printReceiptBtn');

  if (addItemBtn) {
    addItemBtn.addEventListener('click', () => {
      const name = itemNameInput.value.trim();
      const price = parseFloat(itemPriceInput.value);
      const qty = parseInt(itemQtyInput.value, 10);
      const gst = parseInt(itemGstSelect.value, 10);

      if (!name || isNaN(price) || price <= 0 || isNaN(qty) || qty <= 0) {
        alert('Please enter valid item details.');
        return;
      }

      billingItems.push({ name, price, qty, gst });
      itemNameInput.value = '';
      itemPriceInput.value = '';
      itemQtyInput.value = '1';

      renderBillingItems();
      renderReceipt();
      playBeep();
    });
  }

  if (printReceiptBtn) {
    printReceiptBtn.addEventListener('click', () => {
      playPaymentChime();
      alert('Thermal Receipt generated successfully! Ready for 58mm POS printer or customer WhatsApp share.');
    });
  }

  renderBillingItems();
  renderReceipt();
}

function renderBillingItems() {
  const tbody = document.getElementById('billingItemsTbody');
  if (!tbody) return;

  tbody.innerHTML = '';
  billingItems.forEach((item, index) => {
    const total = item.price * item.qty;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${item.name}</strong></td>
      <td>₹${item.price}</td>
      <td>${item.qty}</td>
      <td>${item.gst}%</td>
      <td>₹${total.toFixed(2)}</td>
      <td>
        <button class="item-delete-btn" onclick="removeBillingItem(${index})" title="Delete Item">
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

window.removeBillingItem = function(index) {
  billingItems.splice(index, 1);
  renderBillingItems();
  renderReceipt();
  playBeep();
};

function renderReceipt() {
  const receiptItemsContainer = document.getElementById('receiptItemsList');
  const receiptSubtotal = document.getElementById('receiptSubtotal');
  const receiptGst = document.getElementById('receiptGst');
  const receiptGrandTotal = document.getElementById('receiptGrandTotal');
  const receiptDate = document.getElementById('receiptDate');

  if (receiptDate) {
    const d = new Date();
    receiptDate.textContent = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  let subtotal = 0;
  let totalTax = 0;

  if (receiptItemsContainer) {
    receiptItemsContainer.innerHTML = '';
    billingItems.forEach(item => {
      const lineBase = item.price * item.qty;
      const lineTax = (lineBase * item.gst) / 100;
      subtotal += lineBase;
      totalTax += lineTax;

      const div = document.createElement('div');
      div.className = 'receipt-row';
      div.innerHTML = `
        <span>${item.name} (${item.qty}x)</span>
        <span>₹${(lineBase + lineTax).toFixed(2)}</span>
      `;
      receiptItemsContainer.appendChild(div);
    });
  }

  const grandTotal = subtotal + totalTax;

  if (receiptSubtotal) receiptSubtotal.textContent = `₹${subtotal.toFixed(2)}`;
  if (receiptGst) receiptGst.textContent = `₹${totalTax.toFixed(2)}`;
  if (receiptGrandTotal) receiptGrandTotal.textContent = `₹${grandTotal.toFixed(2)}`;

  drawReceiptQr(grandTotal);
}

// Generate simple sleek QR code matrix on canvas for the receipt
function drawReceiptQr(amount) {
  const canvas = document.getElementById('receiptQrCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const size = canvas.width;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size, size);

  // Generate stylized QR matrix
  const cells = 17;
  const cellSize = Math.floor(size / cells);
  ctx.fillStyle = '#0a0d14';

  // Seeded pattern based on amount
  const seed = Math.floor(amount * 100) % 99991;

  for (let r = 0; r < cells; r++) {
    for (let c = 0; c < cells; c++) {
      // Corner positioning markers
      const isCorner = 
        (r < 5 && c < 5) || 
        (r < 5 && c >= cells - 5) || 
        (r >= cells - 5 && c < 5);

      if (isCorner) {
        if (
          (r === 0 || r === 4 || c === 0 || c === 4) ||
          (r === 0 || r === 4 || c === cells - 1 || c === cells - 5) ||
          (r === cells - 1 || r === cells - 5 || c === 0 || c === 4) ||
          (r >= 2 && r <= 2 && c >= 2 && c <= 2) ||
          (r >= 2 && r <= 2 && c >= cells - 3 && c <= cells - 3) ||
          (r >= cells - 3 && r <= cells - 3 && c >= 2 && c <= 2)
        ) {
          ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
        }
      } else {
        // Pseudo-random data blocks
        const hash = (r * 31 + c * 17 + seed) % 7;
        if (hash === 1 || hash === 3 || hash === 5) {
          ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
        }
      }
    }
  }
}

/* ==========================================================================
   7. Merchant Savings & Working Capital Loan Calculator
   ========================================================================== */
function initCalculator() {
  const rangeInput = document.getElementById('monthlyTurnoverRange');
  const displayTurnover = document.getElementById('turnoverValueDisplay');
  const traditionalFeesDisplay = document.getElementById('traditionalFeesDisplay');
  const annualSavingsDisplay = document.getElementById('annualSavingsDisplay');
  const loanLimitDisplay = document.getElementById('loanLimitDisplay');

  function calculate() {
    if (!rangeInput) return;
    const monthlyTurnover = parseInt(rangeInput.value, 10);

    // Traditional swipe card POS takes ~2.0% MDR + GST
    const monthlyFeeTraditional = (monthlyTurnover * 0.02);
    const annualSavings = monthlyFeeTraditional * 12;

    // Fast working capital credit eligibility is 2.5x to 3x monthly digital turnover (capped at ₹15 Lakhs)
    const loanEligible = Math.min(Math.round(monthlyTurnover * 2.8), 1500000);

    if (displayTurnover) displayTurnover.textContent = `₹${monthlyTurnover.toLocaleString('en-IN')}`;
    if (traditionalFeesDisplay) traditionalFeesDisplay.textContent = `₹${Math.round(monthlyFeeTraditional).toLocaleString('en-IN')}/mo`;
    if (annualSavingsDisplay) annualSavingsDisplay.textContent = `₹${Math.round(annualSavings).toLocaleString('en-IN')}`;
    if (loanLimitDisplay) loanLimitDisplay.textContent = `₹${loanEligible.toLocaleString('en-IN')}`;
  }

  if (rangeInput) {
    rangeInput.addEventListener('input', calculate);
    calculate();
  }
}

/* ==========================================================================
   8. Live Simulated Merchant Dashboard
   ========================================================================== */
const sampleCustomerNames = [
  'Aarav Sharma', 'Priya Patel', 'Rahul Verma', 'Sneha Gupta', 'Vikram Singh',
  'Anita Deshmukh', 'Mohammed Farooq', 'Rajesh Iyer', 'Pooja Reddy', 'Amit Joshi'
];

const paymentApps = [
  { name: 'GPay', class: 'feed-app-gpay' },
  { name: 'PhonePe', class: 'feed-app-phonepe' },
  { name: 'Paytm', class: 'feed-app-paytm' },
  { name: 'RuPay Card', class: 'feed-app-rupay' }
];

function getRandomCustomerName() {
  return sampleCustomerNames[Math.floor(Math.random() * sampleCustomerNames.length)];
}

function getRandomPaymentApp() {
  return paymentApps[Math.floor(Math.random() * paymentApps.length)];
}

let todayTotalSales = 48650;
let todayTxnCount = 64;

function initLiveDashboard() {
  const settleBtn = document.getElementById('dashSettleBtn');
  const toggleFeedBtn = document.getElementById('toggleFeedBtn');

  if (settleBtn) {
    settleBtn.addEventListener('click', () => {
      playPaymentChime();
      triggerConfetti();
      settleBtn.disabled = true;
      settleBtn.innerHTML = `<span>⚡ Settling ₹${todayTotalSales.toLocaleString('en-IN')}...</span>`;

      setTimeout(() => {
        alert(`Success! ₹${todayTotalSales.toLocaleString('en-IN')} transferred directly to your HDFC Bank Current A/C via IMPS Instant Payout.`);
        settleBtn.disabled = false;
        settleBtn.innerHTML = `<span>⚡ Settle to Bank (₹0 Fee)</span>`;
      }, 1200);
    });
  }

  // Periodic automatic simulated incoming payments
  let feedInterval = setInterval(() => {
    const randomAmt = [50, 120, 250, 340, 500, 850, 1200, 1850][Math.floor(Math.random() * 8)];
    addLiveTransaction({
      name: getRandomCustomerName(),
      amount: randomAmt,
      app: getRandomPaymentApp(),
      time: 'Just now'
    });
  }, 7500);

  if (toggleFeedBtn) {
    let running = true;
    toggleFeedBtn.addEventListener('click', () => {
      if (running) {
        clearInterval(feedInterval);
        toggleFeedBtn.textContent = '▶ Resume Live Feed';
        running = false;
      } else {
        feedInterval = setInterval(() => {
          const randomAmt = [50, 120, 250, 340, 500, 850, 1200, 1850][Math.floor(Math.random() * 8)];
          addLiveTransaction({
            name: getRandomCustomerName(),
            amount: randomAmt,
            app: getRandomPaymentApp(),
            time: 'Just now'
          });
        }, 7500);
        toggleFeedBtn.textContent = '⏸ Pause Live Feed';
        running = true;
      }
    });
  }
}

function addLiveTransaction(txn) {
  const feedList = document.getElementById('liveTxnFeedList');
  const totalSalesElem = document.getElementById('dashTodayTotal');
  const totalCountElem = document.getElementById('dashTodayCount');

  todayTotalSales += txn.amount;
  todayTxnCount += 1;

  if (totalSalesElem) totalSalesElem.textContent = `₹${todayTotalSales.toLocaleString('en-IN')}`;
  if (totalCountElem) totalCountElem.textContent = todayTxnCount.toString();

  if (feedList) {
    const item = document.createElement('div');
    item.className = 'feed-item';
    item.innerHTML = `
      <div style="display:flex; align-items:center; gap:0.75rem;">
        <span class="feed-app-badge ${txn.app.class}">${txn.app.name}</span>
        <div>
          <div style="font-size:0.9rem; font-weight:600; color:var(--text-main);">${txn.name}</div>
          <div style="font-size:0.75rem; color:#64748b;">${txn.time} • UPI Direct</div>
        </div>
      </div>
      <div class="feed-amt">+₹${txn.amount.toLocaleString('en-IN')}</div>
    `;

    feedList.prepend(item);

    // Keep stream size under 15
    while (feedList.children.length > 15) {
      feedList.removeChild(feedList.lastChild);
    }
  }
}

/* ==========================================================================
   9. Modals (Order Soundbox & Merchant Login)
   ========================================================================== */
function initModals() {
  const orderModal = document.getElementById('orderModal');
  const loginModal = document.getElementById('loginModal');
  const openOrderBtns = document.querySelectorAll('.open-order-modal-btn');
  const openLoginBtns = document.querySelectorAll('.open-login-modal-btn');
  const closeBtns = document.querySelectorAll('.modal-close-trigger');

  openOrderBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (orderModal) orderModal.classList.add('active');
    });
  });

  openLoginBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (loginModal) loginModal.classList.add('active');
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (orderModal) orderModal.classList.remove('active');
      if (loginModal) loginModal.classList.remove('active');
    });
  });

  // Close on outside click
  window.addEventListener('click', (e) => {
    if (e.target === orderModal) orderModal.classList.remove('active');
    if (e.target === loginModal) loginModal.classList.remove('active');
  });

  // Order Soundbox Form Submission
  const orderForm = document.getElementById('orderSoundboxForm');
  if (orderForm) {
    orderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const shopName = document.getElementById('orderShopName').value;
      const phone = document.getElementById('orderPhone').value;
      const device = document.getElementById('orderDeviceSelect').value;

      playPaymentChime();
      triggerConfetti();

      alert(`🎉 Congratulations! Your VyaparPe ${device} order has been placed for "${shopName}".\n\nTracking ID: VPE-${Math.floor(100000 + Math.random() * 900000)}\nFree delivery within 24-48 hours to your shop.`);
      orderModal.classList.remove('active');
      orderForm.reset();
    });
  }

  // Merchant Login Form Submission
  const loginForm = document.getElementById('merchantLoginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const phone = document.getElementById('loginPhone').value;
      playBeep();
      const otp = prompt(`🔐 Simulation: Enter the 4-digit OTP sent to +91 ${phone}:`, '1234');
      if (otp) {
        alert('Welcome back, Dukandaar Ji! Logged into VyaparPe Merchant Dashboard.');
        loginModal.classList.remove('active');
      }
    });
  }
}

/* ==========================================================================
   10. Interactive 24/7 AI Dukandaar Assistant Widget
   ========================================================================== */
function initChatAssistant() {
  const toggleBtn = document.getElementById('assistantToggleBtn');
  const panel = document.getElementById('assistantPanel');
  const closeBtn = document.getElementById('assistantCloseBtn');
  const chatBody = document.getElementById('assistantChatBody');
  const input = document.getElementById('assistantInput');
  const sendBtn = document.getElementById('assistantSendBtn');
  const promptChips = document.querySelectorAll('.quick-prompt-chip');

  if (toggleBtn && panel) {
    toggleBtn.addEventListener('click', () => {
      panel.classList.toggle('active');
      playBeep();
    });
  }

  if (closeBtn && panel) {
    closeBtn.addEventListener('click', () => {
      panel.classList.remove('active');
    });
  }

  const botResponses = {
    'charges': 'VyaparPe offers 100% 0% fee on all UPI and RuPay Credit Card payments! No hidden deductions or settlement charges.',
    'soundbox': 'VyaparPe 4G Smart Soundbox features dual-SIM connectivity, 7-day battery life, and crystal-clear voice alerts in 11 Indian languages.',
    'settlement': 'Settlements happen instantly within 2 seconds directly into your linked bank account (IMPS/NEFT) 24x7x365, even on bank holidays!',
    'loan': 'You can unlock instant collateral-free business loans up to ₹10 Lakhs based on your daily QR transaction history with daily easy payback.',
    'default': 'Namaste! I am your VyaparPe Assistant. You can ask me about our 0% UPI QR, 4G Soundbox, POS billing terminal, or instant loan limits.'
  };

  function sendUserMessage(text) {
    if (!text.trim()) return;

    // Append user bubble
    const userBubble = document.createElement('div');
    userBubble.className = 'chat-bubble chat-user';
    userBubble.textContent = text;
    chatBody.appendChild(userBubble);
    chatBody.scrollTop = chatBody.scrollHeight;
    playBeep();

    // Determine bot response
    const lower = text.toLowerCase();
    let reply = botResponses['default'];
    if (lower.includes('fee') || lower.includes('charge') || lower.includes('cost') || lower.includes('0%')) {
      reply = botResponses['charges'];
    } else if (lower.includes('soundbox') || lower.includes('voice') || lower.includes('speaker')) {
      reply = botResponses['soundbox'];
    } else if (lower.includes('settle') || lower.includes('time') || lower.includes('payout')) {
      reply = botResponses['settlement'];
    } else if (lower.includes('loan') || lower.includes('credit') || lower.includes('udhar')) {
      reply = botResponses['loan'];
    }

    // Bot response after short typing delay
    setTimeout(() => {
      const botBubble = document.createElement('div');
      botBubble.className = 'chat-bubble chat-bot';
      botBubble.textContent = reply;
      chatBody.appendChild(botBubble);
      chatBody.scrollTop = chatBody.scrollHeight;
      playBeep();
    }, 600);
  }

  if (sendBtn && input) {
    sendBtn.addEventListener('click', () => {
      sendUserMessage(input.value);
      input.value = '';
    });

    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendUserMessage(input.value);
        input.value = '';
      }
    });
  }

  promptChips.forEach(chip => {
    chip.addEventListener('click', () => {
      sendUserMessage(chip.textContent);
    });
  });
}

/* ==========================================================================
   11. FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close other items
      faqItems.forEach(i => i.classList.remove('open'));

      if (!isOpen) {
        item.classList.add('open');
      }
      playBeep();
    });
  });
}

/* ==========================================================================
   12. Language Toggle (English <-> Hindi)
   ========================================================================== */
const siteTranslations = {
  en: {
    heroTitle: `0% Fees. Instant Payouts. India's Most Loved Merchant Soundbox & QR.`,
    heroSubtitle: `Accept payments from GPay, PhonePe, Paytm, RuPay Credit Cards, and NFC cards. Get instant voice alerts in 11 Indian languages with zero monthly rental lock-in.`,
    orderBtn: `Order Smart Soundbox & QR`,
    demoBtn: `⚡ Try Live Simulator`
  },
  hi: {
    heroTitle: `0% फीस। तुरंत बैंक सेटलमेंट। भारत का सबसे भरोसेमंद मर्चेंट साउंडबॉक्स और QR.`,
    heroSubtitle: `गूगल पे, फोनपे, पेटीएम और रूपे क्रेडिट कार्ड से बिना किसी चार्ज के पेमेंट लें। 11 भारतीय भाषाओं में लाउड और क्लियर वॉयस अलर्ट्स पाएं।`,
    orderBtn: `मुफ्त साउंडबॉक्स और QR ऑर्डर करें`,
    demoBtn: `⚡ लाइव साउंडबॉक्स चलाकर देखें`
  }
};

let currentLang = 'en';

function initLanguageToggle() {
  const langToggleBtn = document.getElementById('langToggleBtn');
  const heroTitleElem = document.getElementById('heroTitle');
  const heroSubtitleElem = document.getElementById('heroSubtitle');
  const heroOrderBtn = document.getElementById('heroOrderBtn');
  const heroDemoBtn = document.getElementById('heroDemoBtn');

  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
      currentLang = currentLang === 'en' ? 'hi' : 'en';
      langToggleBtn.innerHTML = currentLang === 'en' ? '<span>🌐 English</span>' : '<span>🌐 हिंदी</span>';

      const t = siteTranslations[currentLang];
      if (heroTitleElem) heroTitleElem.innerHTML = currentLang === 'en' ? 
        `0% Fees. Instant Payouts. <span class="gradient-text">India's Most Loved</span> Merchant Soundbox & QR.` :
        `0% फीस। तुरंत सेटलमेंट। <span class="gradient-text">भारत का सबसे पसंदीदा</span> मर्चेंट साउंडबॉक्स।`;
      
      if (heroSubtitleElem) heroSubtitleElem.textContent = t.heroSubtitle;
      if (heroOrderBtn) heroOrderBtn.textContent = t.orderBtn;
      if (heroDemoBtn) heroDemoBtn.textContent = t.demoBtn;

      playBeep();
    });
  }
}

/* ==========================================================================
   13. Scroll Header Effect
   ========================================================================== */
function initScrollHeader() {
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

/* ==========================================================================
   14. High Performance Canvas Confetti Animation
   ========================================================================== */
function triggerConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const colors = ['#00f59b', '#00d2ff', '#ffffff', '#f59e0b', '#8b5cf6'];

  for (let i = 0; i < 90; i++) {
    particles.push({
      x: canvas.width / 2 + (Math.random() - 0.5) * 200,
      y: canvas.height * 0.45,
      vx: (Math.random() - 0.5) * 14,
      vy: (Math.random() - 1.2) * 16,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 12,
      opacity: 1
    });
  }

  let animationFrame;

  function updateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.4; // gravity
      p.rotation += p.vRot;
      p.opacity -= 0.012;

      if (p.opacity > 0) {
        alive = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.5);
        ctx.restore();
      }
    });

    if (alive) {
      animationFrame = requestAnimationFrame(updateConfetti);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cancelAnimationFrame(animationFrame);
    }
  }

  updateConfetti();
}
