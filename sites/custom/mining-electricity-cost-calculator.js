(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var hashRate = parseFloat(document.getElementById('hashRate').value) || 0;
    var powerDraw = parseFloat(document.getElementById('powerDraw').value) || 0;
    var electricityRate = parseFloat(document.getElementById('electricityRate').value) || 0;
    var btcPrice = parseFloat(document.getElementById('btcPrice').value) || 0;
    var dailyBTC = parseFloat(document.getElementById('dailyBTC').value) || 0;

    // Calculation logic
    var dailyKWh = powerDraw * 24 / 1000; var dailyCost = dailyKWh * electricityRate; var monthlyCost = dailyCost * 30; var dailyRev = dailyBTC * btcPrice; var monthlyRev = dailyRev * 30; var monthlyProfit = monthlyRev - monthlyCost; document.getElementById('dailyPower').textContent = dollar(dailyCost); document.getElementById('monthlyPower').textContent = dollar(monthlyCost); document.getElementById('dailyRevenue').textContent = dollar(dailyRev); document.getElementById('monthlyProfit').textContent = dollar(monthlyProfit);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['hashRate', 'powerDraw', 'electricityRate', 'btcPrice', 'dailyBTC'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
