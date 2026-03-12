(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var ftp = parseFloat(document.getElementById('ftp').value) || 0;
    var weight = parseFloat(document.getElementById('weight').value) || 0;

    // Calculation logic
    var weightKg = weight * 0.453592; var wpk = ftp / weightKg; var level = wpk >= 5.5 ? 'World Class' : wpk >= 4.5 ? 'Cat 1/Pro' : wpk >= 3.7 ? 'Cat 2/3' : wpk >= 3.0 ? 'Cat 4/5' : wpk >= 2.5 ? 'Recreational' : 'Beginner'; var climbSpeed = (wpk * 2.5) - 1;     document.getElementById('wpk').textContent = fmt(wpk,2);
    document.getElementById('level').textContent = level;
    document.getElementById('climbSpeed').textContent = fmt(Math.max(climbSpeed,2),1);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['ftp', 'weight'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
