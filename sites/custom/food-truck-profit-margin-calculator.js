(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var daysPerWeek = parseFloat(document.getElementById('daysPerWeek').value) || 0;
    var dailySales = parseFloat(document.getElementById('dailySales').value) || 0;
    var foodCostPct = parseFloat(document.getElementById('foodCostPct').value) || 0;
    var monthlyFixed = parseFloat(document.getElementById('monthlyFixed').value) || 0;

    // Calculation logic
    var monthlyRevenue = dailySales * daysPerWeek * 4.33; var foodCost = monthlyRevenue * (foodCostPct/100); var monthlyProfit = monthlyRevenue - foodCost - monthlyFixed; var profitMargin = (monthlyProfit / monthlyRevenue) * 100;     document.getElementById('monthlyRevenue').textContent = dollar(monthlyRevenue);
    document.getElementById('monthlyProfit').textContent = dollar(monthlyProfit);
    document.getElementById('profitMargin').textContent = fmt(profitMargin,1);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['daysPerWeek', 'dailySales', 'foodCostPct', 'monthlyFixed'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
