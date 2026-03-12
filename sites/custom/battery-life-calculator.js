(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var capacity = parseFloat(document.getElementById('capacity').value) || 0;
    var loadMa = parseFloat(document.getElementById('loadMa').value) || 0;
    var efficiency = parseFloat(document.getElementById('efficiency').value) || 0;

    // Calculation logic
    var effectiveCapacity = capacity * (efficiency/100); var hours = effectiveCapacity / loadMa; var days = hours / 24;     document.getElementById('hours').textContent = fmt(hours,1);
    document.getElementById('days').textContent = fmt(days,1);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['capacity', 'loadMa', 'efficiency'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
