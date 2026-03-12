(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var patternLength = parseFloat(document.getElementById('patternLength').value) || 0;
    var patternWidth = parseFloat(document.getElementById('patternWidth').value) || 0;
    var seamAllowance = parseFloat(document.getElementById('seamAllowance').value) || 0;
    var pieces = parseFloat(document.getElementById('pieces').value) || 0;

    // Calculation logic
    var cutLength = patternLength + (seamAllowance * 2); var cutWidth = patternWidth + (seamAllowance * 2); var totalFabric = cutLength * cutWidth * pieces;     document.getElementById('cutLength').textContent = fmt(cutLength,2);
    document.getElementById('cutWidth').textContent = fmt(cutWidth,2);
    document.getElementById('totalFabric').textContent = fmt(totalFabric,0);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['patternLength', 'patternWidth', 'seamAllowance', 'pieces'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
