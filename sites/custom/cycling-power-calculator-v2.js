(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var weight = parseFloat(document.getElementById('weight').value) || 0;
    var ftp = parseFloat(document.getElementById('ftp').value) || 0;
    var gradient = parseFloat(document.getElementById('gradient').value) || 0;
    var effort = document.getElementById('effort').value;

    // Calculation logic
    var effort = parseFloat(effort);
    var watts = ftp * effort;
    var weightKg = weight * 0.4536;
    var riderKg = weightKg * 0.88;
    var wpk = watts / riderKg;
    var gravForce = weightKg * 9.81 * (gradient / 100);
    var rollingR = weightKg * 9.81 * 0.005;
    var speedMs = watts / (gravForce + rollingR);
    var speedKmh = speedMs * 3.6;
    var speedMph = speedKmh / 1.609;
    var cat;
    if (wpk >= 5.5) cat = 'Professional / World Tour level';
    else if (wpk >= 4.5) cat = 'Cat 1 / Elite amateur';
    else if (wpk >= 3.8) cat = 'Cat 2 / Strong amateur';
    else if (wpk >= 3.2) cat = 'Cat 3 / Club racer';
    else if (wpk >= 2.5) cat = 'Cat 4 / Recreational cyclist';
    else cat = 'Beginner / Casual rider';
    document.getElementById('power').textContent = fmt(watts, 0) + ' watts at ' + fmt(effort * 100, 0) + '% FTP';
    document.getElementById('wpk').textContent = fmt(wpk, 2) + ' W/kg';
    document.getElementById('climbSpeed').textContent = fmt(speedMph, 1) + ' mph (' + fmt(speedKmh, 1) + ' km/h) on ' + gradient + '% grade';
    document.getElementById('category').textContent = cat;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['weight', 'ftp', 'gradient', 'effort'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
