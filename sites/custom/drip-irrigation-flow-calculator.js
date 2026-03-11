(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var emitters = parseFloat(document.getElementById('emitters').value) || 0;
    var gph = parseFloat(document.getElementById('gph').value) || 0;
    var runtime = parseFloat(document.getElementById('runtime').value) || 0;

    // Calculation logic
    var totalFlow = emitters * gph; var waterUsed = totalFlow * (runtime / 60); var monthlyWater = waterUsed * 30;     document.getElementById('totalFlow').textContent = fmt(totalFlow,1);
    document.getElementById('waterUsed').textContent = fmt(waterUsed,1);
    document.getElementById('monthlyWater').textContent = fmt(monthlyWater,0);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['emitters', 'gph', 'runtime'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
