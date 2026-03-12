(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var pastaOz = parseFloat(document.getElementById('pastaOz').value) || 0;
    var pastaType = document.getElementById('pastaType').value;
    var servings = parseFloat(document.getElementById('servings').value) || 0;

    // Calculation logic
    var waterPerOz = pastaType === 'stuffed' ? 0.375 : pastaType === 'fresh' ? 0.25 : 0.25; var waterQt = Math.max(2, Math.ceil(pastaOz * waterPerOz)); var waterL = Math.round(waterQt * 0.946 * 10) / 10; var saltTbsp = Math.round(waterQt * 0.5 * 10) / 10; var perServing = Math.round(pastaOz / servings * 10) / 10; var cookedMult = pastaType === 'fresh' ? 1.5 : pastaType === 'stuffed' ? 1.3 : 2.0; var cooked = Math.round(pastaOz * cookedMult); document.getElementById('waterQt').textContent = waterQt + ' qt (' + (waterQt * 4) + ' cups)'; document.getElementById('waterL').textContent = fmt(waterL, 1) + ' L'; document.getElementById('salt').textContent = fmt(saltTbsp, 1) + ' tbsp'; document.getElementById('perServing').textContent = fmt(perServing, 1) + ' oz dry'; document.getElementById('cookedWeight').textContent = cooked + ' oz';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['pastaOz', 'pastaType', 'servings'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
