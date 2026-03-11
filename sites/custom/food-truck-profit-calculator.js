(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var avgTicket = parseFloat(document.getElementById('avgTicket').value) || 0;
    var customersPerDay = parseFloat(document.getElementById('customersPerDay').value) || 0;
    var foodCostPct = parseFloat(document.getElementById('foodCostPct').value) || 0;
    var daysPerWeek = parseFloat(document.getElementById('daysPerWeek').value) || 0;
    var rent = parseFloat(document.getElementById('rent').value) || 0;
    var laborDaily = parseFloat(document.getElementById('laborDaily').value) || 0;

    // Calculation logic
    var dailyRevenue = avgTicket * customersPerDay; var dailyFoodCost = dailyRevenue * (foodCostPct / 100); var dailyFuel = 25; var dailyOther = 30; var dailyProfit = dailyRevenue - dailyFoodCost - laborDaily - dailyFuel - dailyOther; var monthlyDays = daysPerWeek * 4.33; var monthlyRevenue = dailyRevenue * monthlyDays; var monthlyProfit = (dailyProfit * monthlyDays) - rent; var annualProfit = monthlyProfit * 12;     document.getElementById('dailyRevenue').textContent = dollar(dailyRevenue);
    document.getElementById('dailyProfit').textContent = dollar(dailyProfit);
    document.getElementById('monthlyProfit').textContent = dollar(monthlyProfit);
    document.getElementById('annualProfit').textContent = dollar(annualProfit);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['avgTicket', 'customersPerDay', 'foodCostPct', 'daysPerWeek', 'rent', 'laborDaily'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
