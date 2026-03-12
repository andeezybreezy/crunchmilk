(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var declaredValue = parseFloat(document.getElementById('declaredValue').value) || 0;
    var carrier = document.getElementById('carrier').value;
    var numPackages = parseFloat(document.getElementById('numPackages').value) || 0;

    // Calculation logic
    var rate; if (carrier === 'ups') { rate = declaredValue <= 100 ? 0 : (declaredValue - 100) * 0.029 + 3.45; } else if (carrier === 'fedex') { rate = declaredValue <= 100 ? 0 : (declaredValue - 100) * 0.028 + 3.40; } else if (carrier === 'usps') { rate = declaredValue <= 50 ? 0 : declaredValue <= 100 ? 2.70 : declaredValue <= 200 ? 3.30 : declaredValue * 0.018; } else { rate = declaredValue * 0.012; } var total = rate * numPackages; var ratio = (rate / declaredValue) * 100; var breakeven = ratio; document.getElementById('perPackage').textContent = dollar(rate); document.getElementById('totalInsurance').textContent = dollar(total); document.getElementById('coverageRatio').textContent = fmt(ratio, 2) + '%'; document.getElementById('breakeven').textContent = '1 in ' + fmt(100/ratio, 0) + ' packages';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['declaredValue', 'carrier', 'numPackages'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
