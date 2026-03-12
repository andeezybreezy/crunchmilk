(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var material = document.getElementById('material').value;
    var bedType = document.getElementById('bedType').value;
    var partSize = document.getElementById('partSize').value;

    // Calculation logic
    var temps = {'PLA': 60, 'PETG': 80, 'ABS': 100, 'Nylon': 80, 'TPU': 50}; var bedTemp = temps[material] || 60; var sizeAdj = {'Small (<50mm)': 0, 'Medium (50-150mm)': 0, 'Large (>150mm)': 5}; bedTemp += sizeAdj[partSize] || 0; var adhesionType = material === 'ABS' ? 'Brim + ABS slurry' : material === 'Nylon' ? 'Brim + glue stick' : partSize === 'Large (>150mm)' ? 'Brim recommended' : 'Skirt only'; var firstLayerSpeed = 20;     document.getElementById('bedTemp').textContent = fmt(bedTemp,0);
    document.getElementById('adhesionType').textContent = adhesionType;
    document.getElementById('firstLayerSpeed').textContent = fmt(firstLayerSpeed,0);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['material', 'bedType', 'partSize'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
