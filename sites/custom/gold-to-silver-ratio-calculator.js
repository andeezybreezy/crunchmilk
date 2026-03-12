(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var goldPrice = parseFloat(document.getElementById('goldPrice').value) || 0;
    var silverPrice = parseFloat(document.getElementById('silverPrice').value) || 0;

    // Calculation logic
    var ratio=goldPrice/silverPrice; var meaning; if(ratio>80){meaning='Silver appears undervalued vs gold (ratio above 80)';}else if(ratio>60){meaning='Ratio is in normal range (60-80)';}else{meaning='Silver appears overvalued vs gold (ratio below 60)';}     document.getElementById('ratio').textContent = fmt(ratio,1)+':1';
    document.getElementById('meaning').textContent = meaning;
    document.getElementById('silverToMatchGold').textContent = fmt(ratio,1)+' oz silver = 1 oz gold';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['goldPrice', 'silverPrice'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
