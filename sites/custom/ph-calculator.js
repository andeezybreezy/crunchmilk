(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var hConc = parseFloat(document.getElementById('hConc').value) || 0;

    // Calculation logic
    if (hConc <= 0) return; var ph = -Math.log10(hConc); var poh = 14 - ph; var ohConc2 = Math.pow(10, -poh); var cls = ph < 6.5 ? 'Acidic' : ph > 7.5 ? 'Basic (Alkaline)' : 'Neutral'; document.getElementById('ph').textContent = fmt(ph, 2); document.getElementById('poh').textContent = fmt(poh, 2); document.getElementById('ohConc').textContent = ohConc2.toExponential(2) + ' mol/L'; document.getElementById('acidBase').textContent = cls;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['hConc'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
