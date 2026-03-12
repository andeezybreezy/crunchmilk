(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var homeSqft = parseFloat(document.getElementById('homeSqft').value) || 0;
    var oilPrice = parseFloat(document.getElementById('oilPrice').value) || 0;
    var climate = document.getElementById('climate').value;
    var insulation = document.getElementById('insulation').value;

    // Calculation logic
    var climateMultiplier = {mild: 0.7, cold: 1.0, severe: 1.35}; var insulationMultiplier = {poor: 1.3, average: 1.0, good: 0.75}; var baseGallons = homeSqft * 0.45; var gallons = Math.round(baseGallons * climateMultiplier[climate] * insulationMultiplier[insulation]); var cost = gallons * oilPrice;     document.getElementById('gallonsPerSeason').textContent = gallons.toLocaleString() + ' gal';
    document.getElementById('seasonCost').textContent = '$' + Math.round(cost).toLocaleString();
    document.getElementById('monthlyCost').textContent = '$' + Math.round(cost / 6) + '/mo';
    document.getElementById('costPerSqft').textContent = '$' + (cost / homeSqft).toFixed(2) + '/sqft';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['homeSqft', 'oilPrice', 'climate', 'insulation'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
