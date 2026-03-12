(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var surfaceType = document.getElementById('surfaceType').value;
    var length = parseFloat(document.getElementById('length').value) || 0;
    var width = parseFloat(document.getElementById('width').value) || 0;
    var soilType = document.getElementById('soilType').value;

    // Calculation logic
    var baseDepths = {patio:{good:4,average:6,poor:8},driveway:{good:6,average:8,poor:10},parking:{good:8,average:10,poor:12},foundation:{good:6,average:8,poor:10},shed:{good:4,average:6,poor:8}}; var depth = baseDepths[surfaceType] ? baseDepths[surfaceType][soilType] || 6 : 6; var area = length * width; var cubicFt = area * (depth / 12); var cy = cubicFt / 27; var tons = cy * 1.4; tons = Math.ceil(tons * 10) / 10; var cost = tons * 35; document.getElementById('recDepth').textContent = fmt(depth, 0); document.getElementById('cubicYards').textContent = fmt(cy, 1); document.getElementById('tons').textContent = fmt(tons, 1); document.getElementById('estCost').textContent = dollar(cost);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['surfaceType', 'length', 'width', 'soilType'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
