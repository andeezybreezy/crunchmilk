(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var routeDistance = parseFloat(document.getElementById('routeDistance').value) || 0;
    var mpg = parseFloat(document.getElementById('mpg').value) || 0;
    var fuelPrice = parseFloat(document.getElementById('fuelPrice').value) || 0;
    var loadWeight = parseFloat(document.getElementById('loadWeight').value) || 0;
    var terrain = document.getElementById('terrain').value;

    // Calculation logic
    var terrainFactor = terrain === 'flat' ? 1.0 : terrain === 'mixed' ? 0.92 : 0.82; var weightPenalty = loadWeight > 30000 ? (loadWeight - 30000) / 50000 * 0.15 : 0; var adjMpg = mpg * terrainFactor * (1 - weightPenalty); adjMpg = Math.max(adjMpg, 2); var gallons = routeDistance / adjMpg; var totalCost = gallons * fuelPrice; var costPerMile = totalCost / routeDistance; document.getElementById('fuelCostMile').textContent = '$' + costPerMile.toFixed(3); document.getElementById('totalFuel').textContent = dollar(totalCost); document.getElementById('gallonsNeeded').textContent = fmt(gallons, 1) + ' gal'; document.getElementById('adjustedMpg').textContent = fmt(adjMpg, 1) + ' MPG'; document.getElementById('costPer100').textContent = dollar(costPerMile * 100);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['routeDistance', 'mpg', 'fuelPrice', 'loadWeight', 'terrain'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
