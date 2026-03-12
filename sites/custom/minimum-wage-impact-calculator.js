(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var currentWage = parseFloat(document.getElementById('currentWage').value) || 0;
    var proposedWage = parseFloat(document.getElementById('proposedWage').value) || 0;
    var numEmployees = parseFloat(document.getElementById('numEmployees').value) || 0;
    var avgHours = parseFloat(document.getElementById('avgHours').value) || 0;
    var businessRevenue = parseFloat(document.getElementById('businessRevenue').value) || 0;
    var pricePassthrough = parseFloat(document.getElementById('pricePassthrough').value) || 0;

    // Calculation logic
    var wageDiff = proposedWage - currentWage; var annualPerWorker = wageDiff * avgHours * 52; var totalIncrease = annualPerWorker * numEmployees; var payrollTaxes = totalIncrease * 0.0765; var totalCostIncrease = totalIncrease + payrollTaxes; var revPct = businessRevenue > 0 ? (totalCostIncrease / businessRevenue) * 100 : 0; var passedToCust = totalCostIncrease * (pricePassthrough / 100); var priceIncPct = businessRevenue > 0 ? (passedToCust / businessRevenue) * 100 : 0; var elasticity = -0.15; var pctIncrease = currentWage > 0 ? (wageDiff / currentWage) : 0; var jobLossPct = Math.abs(elasticity * pctIncrease) * 100; var jobsAtRisk = Math.round(numEmployees * jobLossPct / 100); document.getElementById('annualRaise').textContent = dollar(annualPerWorker) + '/year'; document.getElementById('totalLaborIncrease').textContent = dollar(totalCostIncrease) + ' (incl. payroll tax)'; document.getElementById('revenueImpact').textContent = fmt(revPct, 1) + '% of revenue'; document.getElementById('priceIncrease').textContent = fmt(priceIncPct, 1) + '% price increase needed'; document.getElementById('workerBenefit').textContent = dollar(annualPerWorker) + ' before taxes'; document.getElementById('jobRisk').textContent = fmt(jobLossPct, 1) + '% reduction (~' + jobsAtRisk + ' positions)';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['currentWage', 'proposedWage', 'numEmployees', 'avgHours', 'businessRevenue', 'pricePassthrough'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
