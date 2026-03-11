(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var annualMiles = parseFloat(document.getElementById('annualMiles').value) || 0;
    var flights = parseFloat(document.getElementById('flights').value) || 0;
    var homeKwh = parseFloat(document.getElementById('homeKwh').value) || 0;

    // Calculation logic
    var drivingTons = annualMiles * 0.000404; var flightTons = flights * 1.6; var electricTons = homeKwh * 12 * 0.000417; var totalTons = drivingTons + flightTons + electricTons; var offsetCost = totalTons * 15; var premiumCost = totalTons * 30;     document.getElementById('totalTons').textContent = fmt(totalTons,1);
    document.getElementById('offsetCost').textContent = dollar(offsetCost);
    document.getElementById('premiumCost').textContent = dollar(premiumCost);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['annualMiles', 'flights', 'homeKwh'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
