(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var min = parseFloat(document.getElementById('min').value) || 0;
    var max = parseFloat(document.getElementById('max').value) || 0;
    var count = parseFloat(document.getElementById('count').value) || 0;

    // Calculation logic
    var results = []; for (var i = 0; i < Math.min(count, 20); i++) { results.push(Math.floor(Math.random() * (max - min + 1)) + min); } var result = results.join(', '); var range = min + ' to ' + max;     document.getElementById('result').textContent = result;
    document.getElementById('range').textContent = range;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['min', 'max', 'count'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
