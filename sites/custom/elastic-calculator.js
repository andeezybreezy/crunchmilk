(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var measurement = parseFloat(document.getElementById('measurement').value) || 0;
    var elasticType = document.getElementById('elasticType').value;
    var elasticWidth = document.getElementById('elasticWidth').value;

    // Calculation logic
    var ratios = {waistband: 0.85, cuff: 0.80, neckline: 0.90, swimwear: 0.75}; var ratio = ratios[elasticType] || 0.85; var elastic = measurement * ratio; var withSeam = elastic + 1; document.getElementById('cutLength').textContent = fmt(elastic, 1) + ' inches (stretched)'; document.getElementById('seam').textContent = fmt(withSeam, 1) + ' inches (with 1" overlap)'; document.getElementById('tip').textContent = 'Test on scrap fabric first — elastic stretch varies by brand.';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['measurement', 'elasticType', 'elasticWidth'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
