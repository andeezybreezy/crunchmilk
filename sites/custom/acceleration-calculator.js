(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var force = parseFloat(document.getElementById('force').value) || 0;
    var mass = parseFloat(document.getElementById('mass').value) || 0;
    var vi = parseFloat(document.getElementById('vi').value) || 0;
    var time = parseFloat(document.getElementById('time').value) || 0;

    // Calculation logic
    var a = force / mass; var vf = vi + a * time; var d = vi * time + 0.5 * a * time * time; var g = a / 9.81; document.getElementById('accel').textContent = fmt(a, 2) + ' m/s²'; document.getElementById('finalV').textContent = fmt(vf, 2) + ' m/s (' + fmt(vf * 3.6, 1) + ' km/h)'; document.getElementById('distance').textContent = fmt(d, 2) + ' m'; document.getElementById('gForce').textContent = fmt(g, 2) + ' g';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['force', 'mass', 'vi', 'time'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
