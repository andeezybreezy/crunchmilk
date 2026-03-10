/**
 * Universal share/virality system for all tool pages.
 * Injected into every page by the build system.
 * Vanilla JS, no dependencies, lightweight.
 */

const SHARE_SYSTEM_JS = `
(function() {
  'use strict';

  var TOOL_NAME = '{{toolNameEsc}}';
  var TOOL_SLUG = '{{slug}}';
  var DOMAIN = '{{domain}}';
  var BASE_URL = 'https://' + DOMAIN + '/' + TOOL_SLUG + '/';
  var IS_EMOTIONAL = {{isEmotional}};

  // --- Shareable URL with params ---
  function getShareUrl() {
    var inputs = document.querySelectorAll('.calc-card input, .calc-card select');
    var params = [];
    inputs.forEach(function(el) {
      if (el.id && el.value) {
        params.push(encodeURIComponent(el.id) + '=' + encodeURIComponent(el.value));
      }
    });
    return BASE_URL + (params.length ? '?' + params.join('&') : '');
  }

  // --- Restore inputs from URL params ---
  function restoreFromUrl() {
    var search = window.location.search;
    if (!search) return;
    var params = new URLSearchParams(search);
    params.forEach(function(value, key) {
      var el = document.getElementById(key);
      if (el) {
        el.value = value;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    // Auto-calculate after restoring
    var btn = document.querySelector('.convert-btn');
    if (btn) setTimeout(function() { btn.click(); }, 200);
  }

  // --- Get result text for sharing ---
  function getResultText() {
    var resultEl = document.querySelector('.result');
    if (!resultEl) return TOOL_NAME + ' — check your result';
    var values = resultEl.querySelectorAll('.result-value');
    var labels = resultEl.querySelectorAll('.result-label');
    var lines = [];
    for (var i = 0; i < values.length && i < labels.length; i++) {
      var label = labels[i].textContent.trim();
      var value = values[i].textContent.trim();
      if (value && value !== '—') lines.push(label + ': ' + value);
    }
    return lines.length > 0 ? lines.join(' | ') : TOOL_NAME;
  }

  // --- Build share bar HTML ---
  function buildShareBar() {
    var resultEl = document.querySelector('.result');
    if (!resultEl) return;

    // Check if share bar already exists
    if (document.getElementById('shareBar')) return;

    var bar = document.createElement('div');
    bar.id = 'shareBar';
    bar.className = 'share-bar';

    var html = '';

    // Emotional CTA for top emotional tools
    if (IS_EMOTIONAL) {
      html += '<div class="share-cta">You need to share this. Tag someone who should see their number.</div>';
    }

    // Comparison placeholder (populated by tool-specific JS)
    html += '<div id="shareComparison" class="share-comparison" style="display:none"></div>';

    // Share buttons
    html += '<div class="share-buttons">';
    html += '<button class="share-btn share-btn-x" data-share="x" title="Share on X">𝕏 Share</button>';
    html += '<button class="share-btn share-btn-fb" data-share="fb" title="Share on Facebook">f Share</button>';
    html += '<button class="share-btn share-btn-reddit" data-share="reddit" title="Share on Reddit">↗ Reddit</button>';
    html += '<button class="share-btn share-btn-copy" data-share="copy" title="Copy result">📋 Copy Result</button>';
    html += '<button class="share-btn share-btn-download" data-share="download" title="Download result image">⬇ Download Image</button>';
    html += '</div>';


    bar.innerHTML = html;
    resultEl.appendChild(bar);

    // Event listeners
    bar.querySelectorAll('[data-share]').forEach(function(btn) {
      btn.addEventListener('click', handleShare);
    });

  }

  // --- Handle share button clicks ---
  function handleShare(e) {
    var type = e.currentTarget.getAttribute('data-share');
    var text = getResultText();
    var url = getShareUrl();

    switch (type) {
      case 'x':
        window.open('https://x.com/intent/tweet?text=' + encodeURIComponent(text + ' ' + url), '_blank', 'width=550,height=420');
        break;
      case 'fb':
        window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url), '_blank', 'width=550,height=420');
        break;
      case 'reddit':
        window.open('https://www.reddit.com/submit?url=' + encodeURIComponent(url) + '&title=' + encodeURIComponent(TOOL_NAME + ' — ' + text), '_blank');
        break;
      case 'copy':
        var copyText = TOOL_NAME + '\\n' + text + '\\n' + url;
        navigator.clipboard.writeText(copyText).then(function() {
          e.currentTarget.textContent = '✓ Copied!';
          setTimeout(function() { e.currentTarget.textContent = '📋 Copy Result'; }, 2000);
        });
        break;
      case 'download':
        generateResultImage(text);
        break;
    }
  }

  // --- Generate shareable result image with Canvas ---
  function generateResultImage(text) {
    var canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 630;
    var ctx = canvas.getContext('2d');

    // Background
    var style = getComputedStyle(document.documentElement);
    var primary = style.getPropertyValue('--primary').trim() || '#e85d04';
    ctx.fillStyle = primary;
    ctx.fillRect(0, 0, 1200, 630);

    // White card
    ctx.fillStyle = '#ffffff';
    roundRect(ctx, 40, 40, 1120, 550, 20);
    ctx.fill();

    // Tool name
    ctx.fillStyle = primary;
    ctx.font = 'bold 36px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(TOOL_NAME, 80, 110);

    // Result lines
    ctx.fillStyle = '#1a1a1a';
    ctx.font = 'bold 48px -apple-system, BlinkMacSystemFont, sans-serif';
    var lines = text.split(' | ');
    var y = 200;
    lines.forEach(function(line) {
      if (y < 480) {
        ctx.fillText(line, 80, y);
        y += 70;
      }
    });

    // URL footer
    ctx.fillStyle = '#999';
    ctx.font = '24px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(BASE_URL, 80, 550);

    // Download
    var link = document.createElement('a');
    link.download = TOOL_SLUG + '-result.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  // --- Show share bar when result is visible ---
  function observeResult() {
    var resultEl = document.querySelector('.result');
    if (!resultEl) return;

    var observer = new MutationObserver(function() {
      if (resultEl.classList.contains('visible') || resultEl.style.display === 'block') {
        buildShareBar();
        var bar = document.getElementById('shareBar');
        if (bar) bar.classList.add('visible');
      }
    });
    observer.observe(resultEl, { attributes: true, attributeFilter: ['class', 'style'] });
  }

  // --- Comparison data (can be overridden by tool-specific JS) ---
  window._setShareComparison = function(html) {
    var el = document.getElementById('shareComparison');
    if (el) {
      el.innerHTML = html;
      el.style.display = 'block';
    }
  };

  // Init
  restoreFromUrl();
  observeResult();
})();
`;

module.exports = { SHARE_SYSTEM_JS };
