(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var length = parseFloat(document.getElementById('length').value) || 0;
    var width = parseFloat(document.getElementById('width').value) || 0;
    var depth = parseFloat(document.getElementById('depth').value) || 0;
    var soilType = document.getElementById('soilType').value;
    var hauling = document.getElementById('hauling').value;

    // Calculation logic
    var vol = length * width * depth; var cy = vol / 27; var bulkFactor = 1.25; var cyHaul = cy * bulkFactor; var loads = Math.ceil(cyHaul / 10); var ratePerYard = soilType === 'rock' ? 25 : soilType === 'clay' ? 12 : 8; var digCost = cy * ratePerYard; var haulRate = hauling === 'yes' ? loads * 350 : 0; var total = digCost + haulRate; document.getElementById('cubicYards').textContent = fmt(cy, 1); document.getElementById('truckLoads').textContent = fmt(loads, 0); document.getElementById('digCost').textContent = dollar(digCost); document.getElementById('haulCost').textContent = hauling === 'yes' ? dollar(haulRate) : 'N/A (on-site)'; document.getElementById('totalCost').textContent = dollar(total);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['length', 'width', 'depth', 'soilType', 'hauling'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
