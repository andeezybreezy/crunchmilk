(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var amount = parseFloat(document.getElementById('amount').value) || 0;
    var fromUnit = document.getElementById('fromUnit').value;
    var toUnit = document.getElementById('toUnit').value;

    // Calculation logic
    var toGrams={oz:31.1035,g:1,kg:1000,dwt:1.55517,avoz:28.3495}; var grams=amount*(toGrams[fromUnit]||1); var result=grams/(toGrams[toUnit]||1); var factor=(toGrams[fromUnit]||1)/(toGrams[toUnit]||1);     document.getElementById('result').textContent = fmt(result, 2);
    document.getElementById('factor').textContent = '1 '+fromUnit+' = '+fmt(factor, 2)+' '+toUnit;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['amount', 'fromUnit', 'toUnit'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
