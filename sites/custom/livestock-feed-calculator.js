(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var animal = document.getElementById('animal').value;
    var headCount = parseFloat(document.getElementById('headCount').value) || 0;
    var feedCost = parseFloat(document.getElementById('feedCost').value) || 0;
    var numDays = parseFloat(document.getElementById('numDays').value) || 0;

    // Calculation logic
    var dailyLbs = {beef: 26, dairy: 45, hog: 7, chicken: 0.25, sheep: 4};
    var daily = dailyLbs[animal];
    var dailyTotal = daily * headCount;
    var totalLbs = dailyTotal * numDays;
    var totalTons = totalLbs / 2000;
    var cost = totalTons * feedCost;
    var costPerHead = cost / headCount;
    document.getElementById('dailyPerHead').textContent = fmt(daily, 2) + ' lbs/day';
    document.getElementById('dailyTotal').textContent = fmt(dailyTotal, 0) + ' lbs/day (' + fmt(dailyTotal / 2000, 2) + ' tons)';
    document.getElementById('totalFeed').textContent = fmt(totalTons, 1) + ' tons (' + fmt(totalLbs, 0) + ' lbs)';
    document.getElementById('totalCost').textContent = dollar(cost) + ' total (' + dollar(costPerHead) + '/head)';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['animal', 'headCount', 'feedCost', 'numDays'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
