(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var acres = parseFloat(document.getElementById('acres').value) || 0;
    var grossRevenue = parseFloat(document.getElementById('grossRevenue').value) || 0;
    var seedCost = parseFloat(document.getElementById('seedCost').value) || 0;
    var fertCost = parseFloat(document.getElementById('fertCost').value) || 0;
    var chemCost = parseFloat(document.getElementById('chemCost').value) || 0;
    var machineCost = parseFloat(document.getElementById('machineCost').value) || 0;
    var landCost = parseFloat(document.getElementById('landCost').value) || 0;
    var insuranceCost = parseFloat(document.getElementById('insuranceCost').value) || 0;

    // Calculation logic
    var revenue = grossRevenue * acres;
    var costsPerAcre = seedCost + fertCost + chemCost + machineCost + landCost + insuranceCost;
    var totalCosts = costsPerAcre * acres;
    var profit = revenue - totalCosts;
    var profitPA = profit / acres;
    var breakEvenYield = costsPerAcre / 4.5;
    document.getElementById('totalRevenue').textContent = dollar(revenue);
    document.getElementById('totalCosts').textContent = dollar(totalCosts) + ' (' + dollar(costsPerAcre) + '/acre)';
    document.getElementById('netProfit').textContent = (profit >= 0 ? '' : '-') + dollar(Math.abs(profit));
    document.getElementById('profitPerAcre').textContent = (profitPA >= 0 ? '' : '-') + dollar(Math.abs(profitPA)) + '/acre';
    document.getElementById('breakeven').textContent = fmt(breakEvenYield, 0) + ' bu/acre';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['acres', 'grossRevenue', 'seedCost', 'fertCost', 'chemCost', 'machineCost', 'landCost', 'insuranceCost'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
