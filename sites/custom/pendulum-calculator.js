(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
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
    var correction = 1 + (1/16) * Math.pow(thetaRad, 2) + (11/3072) * Math.pow(thetaRad, 4);
    var Tcorrected = T * correction;
    var oneSecLen = gravity / (4 * Math.PI * Math.PI);
    document.getElementById('period').textContent = fmt(T, 4) + ' seconds (small angle approx.)';
    document.getElementById('frequency').textContent = fmt(freq, 4) + ' Hz';
    document.getElementById('correctedPeriod').textContent = fmt(Tcorrected, 4) + ' seconds (at ' + amplitude + '°)';
    document.getElementById('equivalentLength').textContent = fmt(oneSecLen, 4) + ' m (' + fmt(oneSecLen * 100, 2) + ' cm)';

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
