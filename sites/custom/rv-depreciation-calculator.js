(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var purchasePrice = parseFloat(document.getElementById('purchasePrice').value) || 0;
    var years = parseFloat(document.getElementById('years').value) || 0;
    var rvType = document.getElementById('rvType').value;

    // Calculation logic
    var rates = {classA: 0.15, classC: 0.14, travel: 0.12, fifth: 0.13}; var rate = rates[rvType] || 0.14; var firstYearRate = rate + 0.05; var value = purchasePrice; if (years >= 1) value *= (1 - firstYearRate); for (var i = 1; i < years; i++) value *= (1 - rate); var loss = purchasePrice - value; document.getElementById('currentValue').textContent = dollar(value); document.getElementById('totalLoss').textContent = dollar(loss); document.getElementById('yearlyLoss').textContent = dollar(loss / years) + '/yr'; document.getElementById('retainedPct').textContent = pct(value / purchasePrice * 100, 1); document.getElementById('resultTip').textContent = 'RVs typically lose 20% in the first year and 12-15% per year after.';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['purchasePrice', 'years', 'rvType'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
