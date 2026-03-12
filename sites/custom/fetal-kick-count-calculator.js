(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var kicks = parseFloat(document.getElementById('kicks').value) || 0;
    var minutes = parseFloat(document.getElementById('minutes').value) || 0;
    var weeksPregnant = parseFloat(document.getElementById('weeksPregnant').value) || 0;

    // Calculation logic
    var rate = (kicks / minutes) * 60; var status = kicks >= 10 && minutes <= 120 ? 'Normal' : kicks >= 10 ? 'Slow but reached 10' : 'Below threshold'; var action = kicks < 10 && minutes >= 120 ? 'Contact your healthcare provider' : kicks < 10 ? 'Keep counting - try for 10 in 2 hours' : 'Normal - no action needed';     document.getElementById('rate').textContent = fmt(rate,1);
    document.getElementById('status').textContent = status;
    document.getElementById('action').textContent = action;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['kicks', 'minutes', 'weeksPregnant'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
