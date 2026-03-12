(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var focalLength = parseFloat(document.getElementById('focalLength').value) || 0;
    var cropFactor = document.getElementById('cropFactor').value;
    var maxAperture = parseFloat(document.getElementById('maxAperture').value) || 0;

    // Calculation logic
    var cf = parseFloat(cropFactor);
    var equiv = focalLength * cf;
    var equivAp = maxAperture * cf;
    var fovRad = 2 * Math.atan(36 / (2 * equiv));
    var fovDeg = fovRad * 180 / Math.PI;
    var minShut = 1 / equiv;
    var shutStr = equiv <= 1 ? fmt(1/minShut, 0) + 's' : '1/' + fmt(equiv, 0) + 's';
    document.getElementById('equivFL').textContent = fmt(equiv, 0) + 'mm equivalent';
    document.getElementById('equivAperture').textContent = 'f/' + fmt(equivAp, 1) + ' (depth of field equivalent)';
    document.getElementById('fov').textContent = fmt(fovDeg, 1) + '°';
    document.getElementById('minShutter').textContent = shutStr + ' (reciprocal rule)';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['focalLength', 'cropFactor', 'maxAperture'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
