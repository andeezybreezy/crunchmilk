(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var dieselPrice = parseFloat(document.getElementById('dieselPrice').value) || 0;
    var mpg = parseFloat(document.getElementById('mpg').value) || 0;
    var dailyMiles = parseFloat(document.getElementById('dailyMiles').value) || 0;
    var daysPerWeek = parseFloat(document.getElementById('daysPerWeek').value) || 0;

    // Calculation logic
    var cpm = v.dieselPrice / v.mpg; var daily = cpm * v.dailyMiles; var weekly = daily * v.daysPerWeek; var monthly = weekly * 4.33; var annual = weekly * 52; return {costPerMile: '$' + cpm.toFixed(3), dailyCost: '$' + Math.round(daily).toLocaleString(), weeklyCost: '$' + Math.round(weekly).toLocaleString(), monthlyCost: '$' + Math.round(monthly).toLocaleString(), annualCost: '$' + Math.round(annual).toLocaleString()};

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
