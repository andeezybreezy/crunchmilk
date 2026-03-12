(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var savings = parseFloat(document.getElementById('savings').value) || 0;
    var reserveDecline = parseFloat(document.getElementById('reserveDecline').value) || 0;
    var yearsToDecline = parseFloat(document.getElementById('yearsToDecline').value) || 0;
    var goldAllocation = parseFloat(document.getElementById('goldAllocation').value) || 0;

    // Calculation logic
    var dollarImpact=reserveDecline*0.6; var annualImpact=dollarImpact/yearsToDecline; var cashSavings=savings*(1-goldAllocation/100); var goldSavings=savings*(goldAllocation/100); var cashLoss=cashSavings*(dollarImpact/100); var goldGain=goldSavings*(dollarImpact/100)*1.5; var netImpact=goldGain-cashLoss;     document.getElementById('dollarImpact').textContent = fmt(dollarImpact,1)+'% weaker';
    document.getElementById('savingsImpact').textContent = '-'+dollar(cashLoss)+' in purchasing power';
    document.getElementById('goldHedgeValue').textContent = '+'+dollar(goldGain)+' in gold appreciation';
    document.getElementById('netPosition').textContent = dollar(netImpact);
    document.getElementById('annualDrag').textContent = fmt(annualImpact,1)+'% per year';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['savings', 'reserveDecline', 'yearsToDecline', 'goldAllocation'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
