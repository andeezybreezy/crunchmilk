(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var distance = parseFloat(document.getElementById('distance').value) || 0;
    var mpg = parseFloat(document.getElementById('mpg').value) || 0;
    var gasPrice = parseFloat(document.getElementById('gasPrice').value) || 0;
    var passengers = parseFloat(document.getElementById('passengers').value) || 0;
    var tolls = parseFloat(document.getElementById('tolls').value) || 0;

    // Calculation logic
    var roundTripMiles = distance * 2; var gallonsUsed = roundTripMiles / mpg; var totalFuelCost = gallonsUsed * gasPrice + tolls; var costPerPerson = totalFuelCost / passengers; return {roundTripMiles: fmt(roundTripMiles, 0), gallonsUsed: fmt(gallonsUsed, 1), totalFuelCost: dollar(totalFuelCost), costPerPerson: dollar(costPerPerson)};

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
