(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var premium500 = parseFloat(document.getElementById('premium500').value) || 0;
    var premium1000 = parseFloat(document.getElementById('premium1000').value) || 0;
    var claimFreq = parseFloat(document.getElementById('claimFreq').value) || 0;

    // Calculation logic
    var savings = premium500 - premium1000; var deductibleDiff = 500; var breakeven = savings > 0 ? Math.ceil(deductibleDiff / savings) : 0; var fiveYearSavings = (savings * 60) - (claimFreq * deductibleDiff); var recommendation = fiveYearSavings > 0 ? 'Higher deductible saves ' + dollar(fiveYearSavings) + ' over 5 years' : 'Lower deductible is better with your claim frequency';     document.getElementById('savings').textContent = dollar(savings);
    document.getElementById('breakeven').textContent = fmt(breakeven,0);
    document.getElementById('recommendation').textContent = recommendation;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['premium500', 'premium1000', 'claimFreq'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
