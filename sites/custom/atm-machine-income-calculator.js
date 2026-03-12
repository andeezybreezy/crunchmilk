(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var transPerDay = parseFloat(document.getElementById('transPerDay').value) || 0;
    var surcharge = parseFloat(document.getElementById('surcharge').value) || 0;
    var atmCost = parseFloat(document.getElementById('atmCost').value) || 0;
    var monthlyExpenses = parseFloat(document.getElementById('monthlyExpenses').value) || 0;

    // Calculation logic
    var monthlyRevenue = transPerDay * surcharge * 30; var monthlyProfit = monthlyRevenue - monthlyExpenses; var roiMonths = atmCost / Math.max(monthlyProfit, 1);     document.getElementById('monthlyRevenue').textContent = dollar(monthlyRevenue);
    document.getElementById('monthlyProfit').textContent = dollar(monthlyProfit);
    document.getElementById('roiMonths').textContent = fmt(roiMonths,1);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['transPerDay', 'surcharge', 'atmCost', 'monthlyExpenses'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
