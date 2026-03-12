(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var distance = parseFloat(document.getElementById('distance').value) || 0;
    var mpg = parseFloat(document.getElementById('mpg').value) || 0;
    var gasPrice = parseFloat(document.getElementById('gasPrice').value) || 0;
    var passengers = parseFloat(document.getElementById('passengers').value) || 0;
    var tolls = parseFloat(document.getElementById('tolls').value) || 0;

    // Calculation logic
    var roundTripMiles = distance * 2; var gallonsUsed = roundTripMiles / mpg; var totalFuelCost = gallonsUsed * gasPrice + tolls; var costPerPerson = totalFuelCost / passengers;     document.getElementById('roundTripMiles').textContent = fmt(roundTripMiles, 0);
    document.getElementById('gallonsUsed').textContent = fmt(gallonsUsed, 1);
    document.getElementById('totalFuelCost').textContent = dollar(totalFuelCost);
    document.getElementById('costPerPerson').textContent = dollar(costPerPerson);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['distance', 'mpg', 'gasPrice', 'passengers', 'tolls'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
