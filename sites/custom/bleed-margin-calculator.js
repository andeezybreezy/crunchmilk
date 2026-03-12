(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var docWidth = parseFloat(document.getElementById('docWidth').value) || 0;
    var docHeight = parseFloat(document.getElementById('docHeight').value) || 0;
    var bleed = parseFloat(document.getElementById('bleed').value) || 0;
    var safeMargin = parseFloat(document.getElementById('safeMargin').value) || 0;

    // Calculation logic
    var bleedW = docWidth + 2 * bleed;
    var bleedH = docHeight + 2 * bleed;
    var safeW = docWidth - 2 * safeMargin;
    var safeH = docHeight - 2 * safeMargin;
    document.getElementById('bleedSize').textContent = fmt(bleedW, 3) + '" × ' + fmt(bleedH, 3) + '"';
    document.getElementById('safeZone').textContent = fmt(safeW, 3) + '" × ' + fmt(safeH, 3) + '"';
    document.getElementById('bleedSizeMM').textContent = fmt(bleedW * 25.4, 1) + ' × ' + fmt(bleedH * 25.4, 1) + ' mm';
    document.getElementById('safeZoneMM').textContent = fmt(safeW * 25.4, 1) + ' × ' + fmt(safeH * 25.4, 1) + ' mm';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['docWidth', 'docHeight', 'bleed', 'safeMargin'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
