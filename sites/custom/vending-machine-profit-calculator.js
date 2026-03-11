(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var machineCount = parseFloat(document.getElementById('machineCount').value) || 0;
    var avgSalesDay = parseFloat(document.getElementById('avgSalesDay').value) || 0;
    var avgPrice = parseFloat(document.getElementById('avgPrice').value) || 0;
    var cogs = parseFloat(document.getElementById('cogs').value) || 0;
    var machineCost = parseFloat(document.getElementById('machineCost').value) || 0;

    // Calculation logic
    var dailyRevenue = machineCount * avgSalesDay * avgPrice; var monthlyRevenue = dailyRevenue * 30; var monthlyCogs = monthlyRevenue * (cogs/100); var monthlyProfit = monthlyRevenue - monthlyCogs; var totalInvestment = machineCount * machineCost; var roiMonths = totalInvestment / monthlyProfit;     document.getElementById('monthlyRevenue').textContent = dollar(monthlyRevenue);
    document.getElementById('monthlyProfit').textContent = dollar(monthlyProfit);
    document.getElementById('roiMonths').textContent = fmt(roiMonths,1);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['machineCount', 'avgSalesDay', 'avgPrice', 'cogs', 'machineCost'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
