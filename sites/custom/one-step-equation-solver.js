(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var coefficient = parseFloat(document.getElementById('coefficient').value) || 0;
    var result = parseFloat(document.getElementById('result').value) || 0;

    // Calculation logic
    var c=parseFloat(coefficient),r=parseFloat(result);if(c===0){document.getElementById('answer').textContent=r===0?'Infinite solutions (0x = 0)':'No solution (0x ≠ '+r+')';document.getElementById('steps').textContent=c+'x = '+r;return;}var x=r/c;document.getElementById('answer').textContent=fmt(x, 2);document.getElementById('steps').textContent=c+'x = '+r+' → Divide both sides by '+c+' → x = '+r+' ÷ '+c+' = '+fmt(x, 2);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['coefficient', 'result'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
