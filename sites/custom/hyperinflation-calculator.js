(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var savings = parseFloat(document.getElementById('savings').value) || 0;
    var monthlyRate = parseFloat(document.getElementById('monthlyRate').value) || 0;
    var months = parseFloat(document.getElementById('months').value) || 0;

    // Calculation logic
    var cumulative=Math.pow(1+monthlyRate/100,months); var finalPurchasing=savings/cumulative; var annualRate=(Math.pow(1+monthlyRate/100,12)-1)*100; var breadPrice=5*cumulative; var gasPrice=3.50*cumulative; var lostPct=((savings-finalPurchasing)/savings)*100;     document.getElementById('finalPurchasing').textContent = dollar(finalPurchasing);
    document.getElementById('annualRate').textContent = fmt(annualRate,0)+'%';
    document.getElementById('breadPrice').textContent = dollar(breadPrice);
    document.getElementById('gasPrice').textContent = dollar(gasPrice);
    document.getElementById('lostPct').textContent = fmt(lostPct,2)+'%';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['savings', 'monthlyRate', 'months'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
