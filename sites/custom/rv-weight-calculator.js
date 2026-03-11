(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var gvwr = parseFloat(document.getElementById('gvwr').value) || 0;
    var uvw = parseFloat(document.getElementById('uvw').value) || 0;
    var passengers = parseFloat(document.getElementById('passengers').value) || 0;
    var water = parseFloat(document.getElementById('water').value) || 0;

    // Calculation logic
    var totalCCC = gvwr - uvw; var pw = passengers * 154; var ww = water * 8.34; var remaining = totalCCC - pw - ww; document.getElementById('ccc').textContent = fmt(totalCCC, 0) + ' lbs'; document.getElementById('passengerWeight').textContent = fmt(pw, 0) + ' lbs'; document.getElementById('waterWeight').textContent = fmt(ww, 0) + ' lbs'; document.getElementById('remainingCargo').textContent = fmt(Math.max(0, remaining), 0) + ' lbs'; var pctUsed = ((pw + ww) / totalCCC * 100); document.getElementById('resultTip').textContent = remaining < 0 ? 'WARNING: Over GVWR by ' + fmt(Math.abs(remaining), 0) + ' lbs!' : fmt(pctUsed, 0) + '% of capacity used by passengers and water.';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['gvwr', 'uvw', 'passengers', 'water'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
