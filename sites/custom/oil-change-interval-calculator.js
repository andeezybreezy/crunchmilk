(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var oilType = document.getElementById('oilType').value;
    var monthlyMiles = parseFloat(document.getElementById('monthlyMiles').value) || 0;
    var conditions = document.getElementById('conditions').value;

    // Calculation logic
    var intervals = {'Conventional': 5000, 'Synthetic Blend': 7500, 'Full Synthetic': 10000}; var severeMulti = {'Normal': 1, 'Severe (towing, dusty, short trips)': 0.7, 'Extreme (racing, off-road)': 0.5}; var costs = {'Conventional': 40, 'Synthetic Blend': 55, 'Full Synthetic': 75}; var intervalMiles = intervals[oilType] * (severeMulti[conditions] || 1); var intervalMonths = intervalMiles / monthlyMiles; var changesPerYear = 12 / intervalMonths; var annualCost = changesPerYear * (costs[oilType] || 50);     document.getElementById('intervalMiles').textContent = fmt(intervalMiles,0);
    document.getElementById('intervalMonths').textContent = fmt(intervalMonths,1);
    document.getElementById('changesPerYear').textContent = fmt(changesPerYear,1);
    document.getElementById('annualCost').textContent = dollar(annualCost);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['oilType', 'monthlyMiles', 'conditions'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
