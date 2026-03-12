(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var fridge = parseFloat(document.getElementById('fridge').value) || 0;
    var freezer = parseFloat(document.getElementById('freezer').value) || 0;
    var lights = parseFloat(document.getElementById('lights').value) || 0;
    var medical = parseFloat(document.getElementById('medical').value) || 0;
    var other = parseFloat(document.getElementById('other').value) || 0;
    var outageHours = parseFloat(document.getElementById('outageHours').value) || 0;
    var fuelType = document.getElementById('fuelType').value;

    // Calculation logic
    var total = fridge + freezer + lights + medical + other;
    var startingWatts = total * 2.5;
    var genSize = Math.ceil(startingWatts / 500) * 500;
    var loadRatio = total / genSize;
    var galPerHour;
    if (fuelType === 'gas' || fuelType === 'dual') galPerHour = (genSize / 3500) * 0.75 * loadRatio;
    else galPerHour = (genSize / 3500) * 1.5 * loadRatio;
    var totalFuel = galPerHour * outageHours;
    var fuelPrice = fuelType === 'propane' ? 3.5 : 3.5;
    var dailyCost = galPerHour * 24 * fuelPrice;
    document.getElementById('totalWatts').textContent = fmt(total, 0) + 'W running / ' + fmt(startingWatts, 0) + 'W starting';
    document.getElementById('generatorSize').textContent = fmt(genSize, 0) + ' watts minimum';
    document.getElementById('fuelNeeded').textContent = fmt(totalFuel, 1) + ' gallons of ' + (fuelType === 'propane' ? 'propane' : 'gasoline');
    document.getElementById('dailyCost').textContent = dollar(dailyCost) + '/day';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['fridge', 'freezer', 'lights', 'medical', 'other', 'outageHours', 'fuelType'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
