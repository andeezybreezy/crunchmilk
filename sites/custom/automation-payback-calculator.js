(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var implementationCost = parseFloat(document.getElementById('implementationCost').value) || 0;
    var monthlyMaintenance = parseFloat(document.getElementById('monthlyMaintenance').value) || 0;
    var hoursAutoPerMonth = parseFloat(document.getElementById('hoursAutoPerMonth').value) || 0;
    var laborRate = parseFloat(document.getElementById('laborRate').value) || 0;
    var errorReduction = parseFloat(document.getElementById('errorReduction').value) || 0;

    // Calculation logic
    var laborSaving = hoursAutoPerMonth * laborRate;
    var grossSaving = laborSaving + errorReduction;
    var netSaving = grossSaving - monthlyMaintenance;
    var payback = netSaving > 0 ? implementationCost / netSaving : Infinity;
    var threeYearBenefit = (netSaving * 36) - implementationCost;
    document.getElementById('monthlySavings').textContent = dollar(grossSaving);
    document.getElementById('netMonthlySavings').textContent = dollar(netSaving);
    document.getElementById('paybackMonths').textContent = payback === Infinity ? 'Never' : fmt(payback, 1) + ' months';
    document.getElementById('threeYearROI').textContent = dollar(threeYearBenefit);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['implementationCost', 'monthlyMaintenance', 'hoursAutoPerMonth', 'laborRate', 'errorReduction'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
