(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var hashrate = parseFloat(document.getElementById('hashrate').value) || 0;
    var power = parseFloat(document.getElementById('power').value) || 0;
    var electricRate = parseFloat(document.getElementById('electricRate').value) || 0;
    var coinPerDay = parseFloat(document.getElementById('coinPerDay').value) || 0;
    var coinPrice = parseFloat(document.getElementById('coinPrice').value) || 0;
    var hardwareCost = parseFloat(document.getElementById('hardwareCost').value) || 0;

    // Calculation logic
    var dailyCoins = hashrate * coinPerDay;
    var revenue = dailyCoins * coinPrice;
    var dailyKWH = (power / 1000) * 24;
    var dailyElec = dailyKWH * electricRate;
    var dailyProf = revenue - dailyElec;
    var monthlyProf = dailyProf * 30;
    var breakDays = dailyProf > 0 ? hardwareCost / dailyProf : Infinity;
    var breakStr = breakDays === Infinity ? 'Never (unprofitable)' : fmt(breakDays, 0) + ' days (' + fmt(breakDays / 30, 1) + ' months)';
    document.getElementById('dailyRevenue').textContent = dollar(revenue);
    document.getElementById('dailyElectricity').textContent = dollar(dailyElec);
    document.getElementById('dailyProfit').textContent = (dailyProf >= 0 ? '+' : '') + dollar(dailyProf);
    document.getElementById('monthlyProfit').textContent = (monthlyProf >= 0 ? '+' : '') + dollar(monthlyProf);
    document.getElementById('breakeven').textContent = breakStr;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['hashrate', 'power', 'electricRate', 'coinPerDay', 'coinPrice', 'hardwareCost'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
