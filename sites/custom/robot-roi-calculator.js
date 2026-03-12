(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var robotCost = parseFloat(document.getElementById('robotCost').value) || 0;
    var installCost = parseFloat(document.getElementById('installCost').value) || 0;
    var workersReplaced = parseFloat(document.getElementById('workersReplaced').value) || 0;
    var workerAnnualCost = parseFloat(document.getElementById('workerAnnualCost').value) || 0;
    var annualMaintenance = parseFloat(document.getElementById('annualMaintenance').value) || 0;
    var productivityGain = parseFloat(document.getElementById('productivityGain').value) || 0;

    // Calculation logic
    var totalInv = robotCost + installCost;
    var laborSavings = workersReplaced * workerAnnualCost;
    var prodGainValue = laborSavings * (productivityGain / 100);
    var annualBenefit = laborSavings + prodGainValue - annualMaintenance;
    var payback = annualBenefit > 0 ? totalInv / annualBenefit : Infinity;
    var fiveYear = (annualBenefit * 5) - totalInv;
    document.getElementById('totalInvestment').textContent = dollar(totalInv);
    document.getElementById('annualSavings').textContent = dollar(annualBenefit);
    document.getElementById('paybackPeriod').textContent = payback === Infinity ? 'Never' : fmt(payback * 12, 0) + ' months (' + fmt(payback, 1) + ' years)';
    document.getElementById('fiveYearROI').textContent = dollar(fiveYear);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['robotCost', 'installCost', 'workersReplaced', 'workerAnnualCost', 'annualMaintenance', 'productivityGain'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
