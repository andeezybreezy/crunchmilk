(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var batchSize = parseFloat(document.getElementById('batchSize').value) || 0;
    var waterRatio = parseFloat(document.getElementById('waterRatio').value) || 0;
    var pots = parseFloat(document.getElementById('pots').value) || 0;

    // Calculation logic
    var perPot = 150; var totalNeeded = pots * perPot; var dryWeight = Math.max(batchSize, totalNeeded * 0.5); var waterWeight = dryWeight * (waterRatio / 100); var totalVolume = dryWeight * 0.4 + waterWeight;     document.getElementById('dryWeight').textContent = fmt(dryWeight,0);
    document.getElementById('waterWeight').textContent = fmt(waterWeight,0);
    document.getElementById('totalVolume').textContent = fmt(totalVolume,0);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['batchSize', 'waterRatio', 'pots'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
