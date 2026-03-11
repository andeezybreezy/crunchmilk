(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var originalSize = parseFloat(document.getElementById('originalSize').value) || 0;
    var targetSize = parseFloat(document.getElementById('targetSize').value) || 0;

    // Calculation logic
    var diff = targetSize - originalSize; var bustAdj = diff * 1; var waistAdj = diff * 1; var hipAdj = diff * 1; var scale = 100 + (diff * 2); document.getElementById('scalePct').textContent = fmt(scale, 0) + '%'; document.getElementById('bustChange').textContent = (bustAdj >= 0 ? '+' : '') + fmt(bustAdj, 0) + '" total (' + fmt(bustAdj/2, 1) + '" per side)'; document.getElementById('waistChange').textContent = (waistAdj >= 0 ? '+' : '') + fmt(waistAdj, 0) + '" total'; document.getElementById('hipChange').textContent = (hipAdj >= 0 ? '+' : '') + fmt(hipAdj, 0) + '" total';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['originalSize', 'targetSize'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
