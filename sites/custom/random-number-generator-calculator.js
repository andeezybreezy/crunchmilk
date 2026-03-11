(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var min = parseFloat(document.getElementById('min').value) || 0;
    var max = parseFloat(document.getElementById('max').value) || 0;
    var count = parseFloat(document.getElementById('count').value) || 0;

    // Calculation logic
    var results = []; for (var i = 0; i < Math.min(count, 20); i++) { results.push(Math.floor(Math.random() * (max - min + 1)) + min); } var result = results.join(', '); var range = min + ' to ' + max; return {result: result, range: range};

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
