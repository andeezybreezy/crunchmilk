(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var monthlySpend = parseFloat(document.getElementById('monthlySpend').value) || 0;
    var tokenReduction = parseFloat(document.getElementById('tokenReduction').value) || 0;
    var qualityImprovement = parseFloat(document.getElementById('qualityImprovement').value) || 0;
    var engineeringHours = parseFloat(document.getElementById('engineeringHours').value) || 0;
    var hourlyRate = parseFloat(document.getElementById('hourlyRate').value) || 0;

    // Calculation logic
    var monthlySavings=monthlySpend*(tokenReduction/100); var engineeringCost=engineeringHours*hourlyRate; var paybackMonths=monthlySavings>0?engineeringCost/monthlySavings:999; var annualSavings=monthlySavings*12; var yearOneSavings=annualSavings-engineeringCost; var annualROI=engineeringCost>0?((yearOneSavings/engineeringCost)*100):0;     document.getElementById('monthlySavings').textContent = dollar(monthlySavings);
    document.getElementById('engineeringCost').textContent = dollar(engineeringCost);
    document.getElementById('paybackMonths').textContent = fmt(paybackMonths,1)+' months';
    document.getElementById('annualROI').textContent = fmt(annualROI,0)+'%';
    document.getElementById('yearOneSavings').textContent = dollar(yearOneSavings);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['monthlySpend', 'tokenReduction', 'qualityImprovement', 'engineeringHours', 'hourlyRate'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
