(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var trimW = parseFloat(document.getElementById('trimW').value) || 0;
    var trimH = parseFloat(document.getElementById('trimH').value) || 0;
    var bleed = parseFloat(document.getElementById('bleed').value) || 0;
    var safeMargin = parseFloat(document.getElementById('safeMargin').value) || 0;

    // Calculation logic
    var dw = trimW + (bleed * 2); var dh = trimH + (bleed * 2); var sw = trimW - (safeMargin * 2); var sh = trimH - (safeMargin * 2); var bleedArea = (dw * dh) - (trimW * trimH); document.getElementById('docW').textContent = fmt(dw, 2) + ' in'; document.getElementById('docH').textContent = fmt(dh, 2) + ' in'; document.getElementById('safeW').textContent = fmt(sw, 2) + ' in'; document.getElementById('safeH').textContent = fmt(sh, 2) + ' in'; document.getElementById('bleedArea').textContent = fmt(bleedArea, 2) + ' sq in';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['trimW', 'trimH', 'bleed', 'safeMargin'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
