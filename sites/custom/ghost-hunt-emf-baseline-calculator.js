(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var baseline = parseFloat(document.getElementById('baseline').value) || 0;
    var reading = parseFloat(document.getElementById('reading').value) || 0;
    var nearElectronics = document.getElementById('nearElectronics').value;

    // Calculation logic
    var spike = reading - baseline; var significance; if (nearElectronics === 'Yes') significance = 'Likely electronic interference'; else if (spike > 5) significance = 'Significant unexplained spike'; else if (spike > 2) significance = 'Notable deviation - investigate'; else significance = 'Within normal range'; return {spike: fmt(spike,1), significance: significance};

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
