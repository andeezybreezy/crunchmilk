(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var loadRate = parseFloat(document.getElementById('loadRate').value) || 0;
    var loadMiles = parseFloat(document.getElementById('loadMiles').value) || 0;
    var deadheadMiles = parseFloat(document.getElementById('deadheadMiles').value) || 0;
    var fuelCostMile = parseFloat(document.getElementById('fuelCostMile').value) || 0;
    var tolls = parseFloat(document.getElementById('tolls').value) || 0;
    var fixedCostMile = parseFloat(document.getElementById('fixedCostMile').value) || 0;

    // Calculation logic
    var totalM = loadMiles + deadheadMiles; var rpm = loadRate / totalM; var fuel = totalM * fuelCostMile; var fixed = totalM * fixedCostMile; var totalExpense = fuel + fixed + tolls; var profit = loadRate - totalExpense; var ppm = profit / totalM; document.getElementById('totalMiles').textContent = fmt(totalM, 0) + ' mi'; document.getElementById('ratePerMile').textContent = '$' + rpm.toFixed(2) + '/mi'; document.getElementById('fuelCost').textContent = dollar(fuel); document.getElementById('fixedCost').textContent = dollar(fixed); document.getElementById('netProfit').textContent = dollar(profit); document.getElementById('profitPerMile').textContent = '$' + ppm.toFixed(2) + '/mi';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['loadRate', 'loadMiles', 'deadheadMiles', 'fuelCostMile', 'tolls', 'fixedCostMile'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
