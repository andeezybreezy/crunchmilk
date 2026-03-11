(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var altitude = parseFloat(document.getElementById('altitude').value) || 0;
    var bodyMass = document.getElementById('bodyMass').value;

    // Calculation logic
    var G = 6.674e-11; var bodies = {earth: {M: 5.972e24, R: 6371}, moon: {M: 7.348e22, R: 1737}, mars: {M: 6.417e23, R: 3390}}; var b = bodies[bodyMass] || bodies.earth; var r = (b.R + altitude) * 1000; var v = Math.sqrt(G * b.M / r); var T = 2 * Math.PI * r / v; var orbits = 86400 / T; document.getElementById('velocity').textContent = fmt(v, 0) + ' m/s (' + fmt(v * 3.6, 0) + ' km/h)'; document.getElementById('period').textContent = fmt(T / 60, 1) + ' minutes'; document.getElementById('orbitsPerDay').textContent = fmt(orbits, 2);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['altitude', 'bodyMass'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
