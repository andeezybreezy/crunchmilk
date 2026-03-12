(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var length = parseFloat(document.getElementById('length').value) || 0;
    var gravity = parseFloat(document.getElementById('gravity').value) || 0;
    var amplitude = parseFloat(document.getElementById('amplitude').value) || 0;

    // Calculation logic
    var T = 2 * Math.PI * Math.sqrt(length / gravity);
    var freq = 1 / T;
    var thetaRad = amplitude * Math.PI / 180;
    var correction = 1 + (1/16) * Math.pow(thetaRad, 2) + (11/3072) * Math.pow(thetaRad, 2);
    var Tcorrected = T * correction;
    var oneSecLen = gravity / (4 * Math.PI * Math.PI);
    document.getElementById('period').textContent = fmt(T, 2) + ' seconds (small angle approx.)';
    document.getElementById('frequency').textContent = fmt(freq, 2) + ' Hz';
    document.getElementById('correctedPeriod').textContent = fmt(Tcorrected, 2) + ' seconds (at ' + amplitude + '°)';
    document.getElementById('equivalentLength').textContent = fmt(oneSecLen, 2) + ' m (' + fmt(oneSecLen * 100, 2) + ' cm)';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['length', 'gravity', 'amplitude'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
