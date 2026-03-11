(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var weight = parseFloat(document.getElementById('weight').value) || 0;
    var reps = parseFloat(document.getElementById('reps').value) || 0;

    // Calculation logic
    var oneRM = Math.round(weight * (1 + reps/30)); var pct90 = Math.round(oneRM * 0.9); var pct80 = Math.round(oneRM * 0.8); var pct70 = Math.round(oneRM * 0.7);     document.getElementById('oneRM').textContent = fmt(oneRM,0);
    document.getElementById('pct90').textContent = fmt(pct90,0);
    document.getElementById('pct80').textContent = fmt(pct80,0);
    document.getElementById('pct70').textContent = fmt(pct70,0);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['weight', 'reps'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
