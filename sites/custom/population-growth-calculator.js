(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var currentPop = parseFloat(document.getElementById('currentPop').value) || 0;
    var growthRate = parseFloat(document.getElementById('growthRate').value) || 0;
    var years = parseFloat(document.getElementById('years').value) || 0;

    // Calculation logic
    var future = currentPop * Math.pow(1 + growthRate/100, years); var gain = future - currentPop; var doubleYears = growthRate > 0 ? 70 / growthRate : Infinity; document.getElementById('futurePop').textContent = fmt(future, 0); document.getElementById('popGain').textContent = '+' + fmt(gain, 0) + ' (' + pct(gain/currentPop*100, 1) + ')'; document.getElementById('doubleTime').textContent = growthRate > 0 ? fmt(doubleYears, 1) + ' years' : 'N/A (no growth)';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['currentPop', 'growthRate', 'years'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
