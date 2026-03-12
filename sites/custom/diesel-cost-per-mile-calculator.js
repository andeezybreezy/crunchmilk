(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var dieselPrice = parseFloat(document.getElementById('dieselPrice').value) || 0;
    var mpg = parseFloat(document.getElementById('mpg').value) || 0;
    var dailyMiles = parseFloat(document.getElementById('dailyMiles').value) || 0;
    var daysPerWeek = parseFloat(document.getElementById('daysPerWeek').value) || 0;

    // Calculation logic
    var cpm = dieselPrice / mpg; var daily = cpm * dailyMiles; var weekly = daily * daysPerWeek; var monthly = weekly * 4.33; var annual = weekly * 52;     document.getElementById('costPerMile').textContent = '$' + cpm.toFixed(3);
    document.getElementById('dailyCost').textContent = '$' + Math.round(daily).toLocaleString();
    document.getElementById('weeklyCost').textContent = '$' + Math.round(weekly).toLocaleString();
    document.getElementById('monthlyCost').textContent = '$' + Math.round(monthly).toLocaleString();
    document.getElementById('annualCost').textContent = '$' + Math.round(annual).toLocaleString();

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['dieselPrice', 'mpg', 'dailyMiles', 'daysPerWeek'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
