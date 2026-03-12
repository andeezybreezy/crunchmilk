(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var width = parseFloat(document.getElementById('width').value) || 0;
    var riserHeight = parseFloat(document.getElementById('riserHeight').value) || 0;
    var treadDepth = parseFloat(document.getElementById('treadDepth').value) || 0;
    var numSteps = parseFloat(document.getElementById('numSteps').value) || 0;

    // Calculation logic
    var totalCuFt = 0; for (var i = 1; i <= numSteps; i++) { totalCuFt += width * (treadDepth/12) * (riserHeight/12 * i); } totalCuFt *= 1.1; var cuYd = totalCuFt / 27; var bags80 = Math.ceil(totalCuFt / 0.6); var cost = cuYd * 150;     document.getElementById('cuYd').textContent = fmt(cuYd,2);
    document.getElementById('bags80').textContent = fmt(bags80,0);
    document.getElementById('cost').textContent = dollar(cost);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['width', 'riserHeight', 'treadDepth', 'numSteps'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
