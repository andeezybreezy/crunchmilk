(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var principal = parseFloat(document.getElementById('principal').value) || 0;
    var apy = parseFloat(document.getElementById('apy').value) || 0;
    var compoundFreq = document.getElementById('compoundFreq').value;
    var duration = parseFloat(document.getElementById('duration').value) || 0;
    var impLoss = parseFloat(document.getElementById('impLoss').value) || 0;

    // Calculation logic
    var n = parseInt(compoundFreq);
    var years = duration / 12;
    var rate = apy / 100;
    var finalVal = principal * Math.pow(1 + rate / n, n * years);
    var earnings = finalVal - principal;
    var effectiveRate = (Math.pow(finalVal / principal, 1 / years) - 1) * 100;
    var ilLoss = finalVal * (impLoss / 100);
    var afterILVal = finalVal - ilLoss;
    document.getElementById('finalValue').textContent = dollar(finalVal);
    document.getElementById('totalEarnings').textContent = dollar(earnings);
    document.getElementById('effectiveAPY').textContent = fmt(effectiveRate, 2) + '%';
    document.getElementById('afterIL').textContent = impLoss > 0 ? dollar(afterILVal) + ' (-' + dollar(ilLoss) + ' IL)' : 'No IL risk (single-sided staking)';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['principal', 'apy', 'compoundFreq', 'duration', 'impLoss'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
