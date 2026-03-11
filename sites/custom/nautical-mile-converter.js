(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var value = parseFloat(document.getElementById('value').value) || 0;
    var fromUnit = document.getElementById('fromUnit').value;

    // Calculation logic
    var nm, mi, km; if (fromUnit === 'nm') { nm = value; mi = value * 1.15078; km = value * 1.852; } else if (fromUnit === 'mi') { mi = value; nm = value / 1.15078; km = value * 1.60934; } else { km = value; nm = value / 1.852; mi = value / 1.60934; } document.getElementById('nautical').textContent = fmt(nm, 4) + ' NM'; document.getElementById('statute').textContent = fmt(mi, 4) + ' mi'; document.getElementById('kilometers').textContent = fmt(km, 4) + ' km';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['value', 'fromUnit'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
