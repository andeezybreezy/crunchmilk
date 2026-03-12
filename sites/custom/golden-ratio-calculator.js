(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var value = parseFloat(document.getElementById('value').value) || 0;
    var mode = document.getElementById('mode').value;

    // Calculation logic
    var phi = 1.6180339887;
    var longVal, shortVal;
    if (mode === 'longer') { shortVal = value; longVal = value * phi; }
    else if (mode === 'shorter') { longVal = value; shortVal = value / phi; }
    else { longVal = value / (1 + 1/phi); shortVal = value - longVal; }
    document.getElementById('longSide').textContent = fmt(longVal, 2);
    document.getElementById('shortSide').textContent = fmt(shortVal, 2);
    document.getElementById('ratio').textContent = fmt(longVal / shortVal, 10) + ' (φ = 1.6180339887...)';
    document.getElementById('spiralPoints').textContent = 'Place subject at ' + fmt(longVal * 0.382, 1) + ' or ' + fmt(longVal * 0.618, 1) + ' from edge';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['value', 'mode'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
