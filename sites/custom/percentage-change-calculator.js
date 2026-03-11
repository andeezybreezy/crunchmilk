(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var oldValue = parseFloat(document.getElementById('oldValue').value) || 0;
    var newValue = parseFloat(document.getElementById('newValue').value) || 0;

    // Calculation logic
    var difference = newValue - oldValue; var change = oldValue !== 0 ? (difference / oldValue) * 100 : 0; var ratio = oldValue !== 0 ? (newValue / oldValue) * 100 : 0;     document.getElementById('change').textContent = (change >= 0 ? '+' : '') + fmt(change,1);
    document.getElementById('difference').textContent = fmt(difference,2);
    document.getElementById('ratio').textContent = fmt(ratio,1);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['oldValue', 'newValue'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
