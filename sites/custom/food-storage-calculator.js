(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var numPeople = parseFloat(document.getElementById('numPeople').value) || 0;
    var numDays = parseFloat(document.getElementById('numDays').value) || 0;
    var caloriesPerDay = parseFloat(document.getElementById('caloriesPerDay').value) || 0;
    var storageType = document.getElementById('storageType').value;

    // Calculation logic
    var totalCal = numPeople * numDays * caloriesPerDay;
    var costPerCal = {freeze: 0.06, canned: 0.01, bulk: 0.004, mixed: 0.02};
    var calPerLb = {freeze: 1800, canned: 600, bulk: 1600, mixed: 1000};
    var shelfYrs = {freeze: '25-30 years', canned: '2-5 years', bulk: '20-30 years', mixed: '5-15 years'};
    var cost = totalCal * (costPerCal[storageType] / 1);
    var weightLbs = totalCal / calPerLb[storageType];
    document.getElementById('totalCalories').textContent = fmt(totalCal, 0) + ' calories';
    document.getElementById('estimatedWeight').textContent = fmt(weightLbs, 0) + ' lbs (' + fmt(weightLbs * 0.454, 0) + ' kg)';
    document.getElementById('estimatedCost').textContent = dollar(cost);
    document.getElementById('shelfLife').textContent = shelfYrs[storageType];

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['numPeople', 'numDays', 'caloriesPerDay', 'storageType'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
