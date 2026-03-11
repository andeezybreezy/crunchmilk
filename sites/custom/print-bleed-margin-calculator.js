(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var trimW = parseFloat(document.getElementById('trimW').value) || 0;
    var trimH = parseFloat(document.getElementById('trimH').value) || 0;
    var bleed = parseFloat(document.getElementById('bleed').value) || 0;
    var safeMargin = parseFloat(document.getElementById('safeMargin').value) || 0;

    // Calculation logic
    var dw = trimW + (bleed * 2); var dh = trimH + (bleed * 2); var sw = trimW - (safeMargin * 2); var sh = trimH - (safeMargin * 2); var bleedArea = (dw * dh) - (trimW * trimH); document.getElementById('docW').textContent = fmt(dw, 3) + ' in'; document.getElementById('docH').textContent = fmt(dh, 3) + ' in'; document.getElementById('safeW').textContent = fmt(sw, 3) + ' in'; document.getElementById('safeH').textContent = fmt(sh, 3) + ' in'; document.getElementById('bleedArea').textContent = fmt(bleedArea, 3) + ' sq in';

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
