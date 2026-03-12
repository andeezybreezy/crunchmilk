(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var watts = parseFloat(document.getElementById('watts').value) || 0;
    var hoursDay = parseFloat(document.getElementById('hoursDay').value) || 0;
    var rate = parseFloat(document.getElementById('rate').value) || 0;

    // Calculation logic
    var dailyKwh = (watts * hoursDay) / 1000; var monthly = dailyKwh * 30; var daily = dailyKwh * rate; document.getElementById('dailyCost').textContent = dollar(daily); document.getElementById('monthlyCost').textContent = dollar(daily * 30); document.getElementById('annualCost').textContent = dollar(daily * 365); document.getElementById('kwhMonth').textContent = fmt(monthly, 1) + ' kWh';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['watts', 'hoursDay', 'rate'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
