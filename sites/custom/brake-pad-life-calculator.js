(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var thickness = parseFloat(document.getElementById('thickness').value) || 0;
    var minThickness = parseFloat(document.getElementById('minThickness').value) || 0;
    var monthlyMiles = parseFloat(document.getElementById('monthlyMiles').value) || 0;
    var driving = document.getElementById('driving').value;

    // Calculation logic
    var wearRates = {'Highway (light braking)': 0.00008, 'Mixed': 0.00012, 'City (heavy braking)': 0.00020}; var wearPerMile = wearRates[driving] || 0.00012; var remaining = thickness - minThickness; var milesLeft = remaining / wearPerMile; var monthsLeft = milesLeft / monthlyMiles;     document.getElementById('milesLeft').textContent = fmt(milesLeft,0);
    document.getElementById('monthsLeft').textContent = fmt(monthsLeft,0);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['thickness', 'minThickness', 'monthlyMiles', 'driving'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
