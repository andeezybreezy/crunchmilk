(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var length = parseFloat(document.getElementById('length').value) || 0;
    var width = parseFloat(document.getElementById('width').value) || 0;
    var shrinkPct = parseFloat(document.getElementById('shrinkPct').value) || 0;

    // Calculation logic
    var cutLength = length / (1 - shrinkPct/100); var cutWidth = width / (1 - shrinkPct/100); var extraFabric = (cutLength * cutWidth) - (length * width);     document.getElementById('cutLength').textContent = fmt(cutLength,1);
    document.getElementById('cutWidth').textContent = fmt(cutWidth,1);
    document.getElementById('extraFabric').textContent = fmt(extraFabric,0);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['length', 'width', 'shrinkPct'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
