/**
 * Lightweight email capture slide-up for all tool pages.
 * Shows after user gets a result. Non-intrusive, dismissable.
 * Remembers dismissal for 30 days via localStorage.
 * Vanilla JS, no dependencies.
 */

const EMAIL_CAPTURE_JS = `
(function() {
  'use strict';

  var CATEGORY = '{{category}}';
  var TOOL_SLUG = '{{slug}}';
  var DISMISS_KEY = 'cm_email_dismissed';
  var SIGNUP_KEY = 'cm_email_signed_up';
  var DISMISS_DAYS = 30;

  // Don't show if already signed up or recently dismissed
  function shouldShow() {
    if (localStorage.getItem(SIGNUP_KEY)) return false;
    var dismissed = localStorage.getItem(DISMISS_KEY);
    if (dismissed) {
      var ts = parseInt(dismissed, 10);
      if (Date.now() - ts < DISMISS_DAYS * 86400000) return false;
    }
    return true;
  }

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, Date.now().toString());
    var el = document.getElementById('emailCapture');
    if (el) {
      el.classList.remove('ec-visible');
      setTimeout(function() { el.remove(); }, 400);
    }
  }

  function buildCapture() {
    if (!shouldShow()) return;
    if (document.getElementById('emailCapture')) return;

    var el = document.createElement('div');
    el.id = 'emailCapture';
    el.className = 'ec-slideup';
    el.innerHTML =
      '<button class="ec-close" aria-label="Close">&times;</button>' +
      '<p class="ec-headline">Get free calculator tips & updates</p>' +
      '<p class="ec-sub">Join 2,000+ people who use our tools weekly. No spam, unsubscribe anytime.</p>' +
      '<form class="ec-form" autocomplete="on">' +
        '<input type="email" name="email" class="ec-input" placeholder="your@email.com" required autocomplete="email">' +
        '<button type="submit" class="ec-submit">Subscribe</button>' +
      '</form>' +
      '<p class="ec-privacy">We respect your privacy. <a href="/privacy/">Privacy Policy</a></p>';

    document.body.appendChild(el);

    // Animate in after append
    setTimeout(function() { el.classList.add('ec-visible'); }, 50);

    // Close button
    el.querySelector('.ec-close').addEventListener('click', dismiss);

    // Form submit
    el.querySelector('.ec-form').addEventListener('submit', function(e) {
      e.preventDefault();
      var email = el.querySelector('.ec-input').value.trim();
      if (!email) return;

      // Store locally (backend integration point)
      try {
        var subs = JSON.parse(localStorage.getItem('cm_subscribers') || '[]');
        subs.push({ email: email, category: CATEGORY, tool: TOOL_SLUG, ts: Date.now() });
        localStorage.setItem('cm_subscribers', JSON.stringify(subs));
      } catch(ex) {}

      localStorage.setItem(SIGNUP_KEY, '1');

      // Success state
      el.querySelector('.ec-form').innerHTML =
        '<p style="color:var(--primary);font-weight:600;font-size:0.9rem;padding:8px 0">Thanks! You\\u2019re subscribed.</p>';
      setTimeout(function() {
        el.classList.remove('ec-visible');
        setTimeout(function() { el.remove(); }, 400);
      }, 2500);
    });
  }

  // Observe result visibility — show capture 3s after result appears
  function observeForCapture() {
    var resultEl = document.querySelector('.result');
    if (!resultEl) return;

    var shown = false;
    var observer = new MutationObserver(function() {
      if (shown) return;
      if (resultEl.classList.contains('visible') || resultEl.style.display === 'block') {
        shown = true;
        setTimeout(buildCapture, 3000);
      }
    });
    observer.observe(resultEl, { attributes: true, attributeFilter: ['class', 'style'] });
  }

  observeForCapture();
})();
`;

module.exports = { EMAIL_CAPTURE_JS };
