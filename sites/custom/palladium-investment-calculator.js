(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var weight = parseFloat(document.getElementById('weight').value) || 0;
    var weightUnit = document.getElementById('weightUnit').value;
    var spotPrice = parseFloat(document.getElementById('spotPrice').value) || 0;
    var premium = parseFloat(document.getElementById('premium').value) || 0;
    var purchasePrice = parseFloat(document.getElementById('purchasePrice').value) || 0;

    // Calculation logic
    var ozConvert = {'Troy Ounces': 1, 'Grams': 0.03215, 'Kilograms': 32.15}; var troyOz = weight * (ozConvert[weightUnit] || 1); var currentValue = troyOz * spotPrice; var totalWithPremium = troyOz * spotPrice * (1 + premium / 100); var costBasis = troyOz * purchasePrice; var gainLoss = currentValue - costBasis; var returnPct = costBasis > 0 ? (gainLoss / costBasis) * 100 : 0;     document.getElementById('currentValue').textContent = dollar(currentValue);
    document.getElementById('totalWithPremium').textContent = dollar(totalWithPremium);
    document.getElementById('gainLoss').textContent = dollar(gainLoss);
    document.getElementById('returnPct').textContent = fmt(returnPct, 2);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['weight', 'weightUnit', 'spotPrice', 'premium', 'purchasePrice'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
