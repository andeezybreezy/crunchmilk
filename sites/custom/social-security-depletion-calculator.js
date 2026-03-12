(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var trustBalance = parseFloat(document.getElementById('trustBalance').value) || 0;
    var annualDeficit = parseFloat(document.getElementById('annualDeficit').value) || 0;
    var deficitGrowth = parseFloat(document.getElementById('deficitGrowth').value) || 0;
    var monthlyBenefit = parseFloat(document.getElementById('monthlyBenefit').value) || 0;
    var currentAge = parseFloat(document.getElementById('currentAge').value) || 0;
    var retireAge = parseFloat(document.getElementById('retireAge').value) || 0;

    // Calculation logic
    var balance = trustBalance * 1e12; var deficit = annualDeficit * 1e9; var growth = deficitGrowth / 100; var year = 2024; var yearsToDepletion = 0; while (balance > 0 && yearsToDepletion < 50) { yearsToDepletion++; deficit = deficit * (1 + growth); balance -= deficit; year++; } var depYear = 2024 + yearsToDepletion; var ageAtDepletion = currentAge + yearsToDepletion; var payableRatio = 0.77; var reducedBen = monthlyBenefit * payableRatio; var loss = monthlyBenefit - reducedBen; var yearsRetired = Math.max(0, 85 - retireAge); var yearsAffected = Math.max(0, 85 - Math.max(retireAge, ageAtDepletion)); var lifetimeLoss = loss * 12 * yearsAffected; document.getElementById('depletionYear').textContent = depYear; document.getElementById('yearsLeft').textContent = yearsToDepletion + ' years from 2024'; document.getElementById('yourAge').textContent = ageAtDepletion + ' years old'; document.getElementById('reducedBenefit').textContent = dollar(reducedBen) + '/mo (77% of full)'; document.getElementById('monthlyLoss').textContent = '-' + dollar(loss) + '/mo'; document.getElementById('lifetimeLoss').textContent = '-' + dollar(lifetimeLoss) + ' (to age 85)';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['trustBalance', 'annualDeficit', 'deficitGrowth', 'monthlyBenefit', 'currentAge', 'retireAge'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
