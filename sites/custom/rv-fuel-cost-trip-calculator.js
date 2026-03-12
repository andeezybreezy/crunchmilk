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
    var fuelPrice = parseFloat(document.getElementById('fuelPrice').value) || 0;

    // Calculation logic
    var gallons = distance / mpg; var fuelCost = gallons * fuelPrice; var costPerMile = (fuelPrice / mpg) * 100;     document.getElementById('gallons').textContent = fmt(gallons,1);
    document.getElementById('fuelCost').textContent = dollar(fuelCost);
    document.getElementById('costPerMile').textContent = fmt(costPerMile,1);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['distance', 'mpg', 'fuelPrice'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
