(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var baseline = parseFloat(document.getElementById('baseline').value) || 0;
    var reading = parseFloat(document.getElementById('reading').value) || 0;
    var nearElectronics = document.getElementById('nearElectronics').value;

    // Calculation logic
    var spike = reading - baseline; var significance; if (nearElectronics === 'Yes') significance = 'Likely electronic interference'; else if (spike > 5) significance = 'Significant unexplained spike'; else if (spike > 2) significance = 'Notable deviation - investigate'; else significance = 'Within normal range';     document.getElementById('spike').textContent = fmt(spike,1);
    document.getElementById('significance').textContent = significance;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['baseline', 'reading', 'nearElectronics'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
