(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var mass1 = parseFloat(document.getElementById('mass1').value) || 0;
    var mass2 = parseFloat(document.getElementById('mass2').value) || 0;
    var distance = parseFloat(document.getElementById('distance').value) || 0;

    // Calculation logic
    var G = 6.674e-11; var force = G * mass1 * mass2 / (distance * distance); var accel = force / mass2;     document.getElementById('force').textContent = fmt(force,4);
    document.getElementById('accel').textContent = fmt(accel,4);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['mass1', 'mass2', 'distance'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
