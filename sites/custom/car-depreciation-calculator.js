(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var purchasePrice = parseFloat(document.getElementById('purchasePrice').value) || 0;
    var age = parseFloat(document.getElementById('age').value) || 0;
    var mileage = parseFloat(document.getElementById('mileage').value) || 0;

    // Calculation logic
    var depRates = [0.20, 0.15, 0.13, 0.12, 0.11, 0.10, 0.09, 0.08, 0.07, 0.06]; var value = purchasePrice; for (var i = 0; i < Math.min(age, 10); i++) { value *= (1 - (depRates[i] || 0.05)); } var mileAdj = 1 - ((mileage - 12000) * 0.000005 * age); value *= Math.max(mileAdj, 0.5); var totalLoss = purchasePrice - value; var annualLoss = age > 0 ? totalLoss / age : 0;     document.getElementById('currentValue').textContent = dollar(value);
    document.getElementById('totalLoss').textContent = dollar(totalLoss);
    document.getElementById('annualLoss').textContent = dollar(annualLoss);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['purchasePrice', 'age', 'mileage'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
