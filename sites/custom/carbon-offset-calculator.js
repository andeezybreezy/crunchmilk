(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var driving = parseFloat(document.getElementById('driving').value) || 0;
    var mpg = parseFloat(document.getElementById('mpg').value) || 0;
    var flights = parseFloat(document.getElementById('flights').value) || 0;
    var homeKwh = parseFloat(document.getElementById('homeKwh').value) || 0;

    // Calculation logic
    var driveCO2 = (driving / mpg) * 8.887 / 1000; var flightCO2 = flights * 1.6; var elecCO2 = (homeKwh * 12 * 0.855) / 2205; var total = driveCO2 + flightCO2 + elecCO2; var cost = total * 15; document.getElementById('totalTons').textContent = fmt(total, 1) + ' tons'; document.getElementById('offsetCost').textContent = dollar(cost) + ' at ~$15/ton'; document.getElementById('driving_co2').textContent = fmt(driveCO2, 1) + ' tons'; document.getElementById('flight_co2').textContent = fmt(flightCO2, 1) + ' tons';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['driving', 'mpg', 'flights', 'homeKwh'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
