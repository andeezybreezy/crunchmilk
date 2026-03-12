(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var systemCost = parseFloat(document.getElementById('systemCost').value) || 0;
    var taxCredit = parseFloat(document.getElementById('taxCredit').value) || 0;
    var monthlyBill = parseFloat(document.getElementById('monthlyBill').value) || 0;
    var offsetPct = parseFloat(document.getElementById('offsetPct').value) || 0;

    // Calculation logic
    var netCost = systemCost * (1 - taxCredit/100); var annualSavings = monthlyBill * 12 * (offsetPct/100); var paybackYears = netCost / annualSavings;     document.getElementById('netCost').textContent = dollar(netCost);
    document.getElementById('annualSavings').textContent = dollar(annualSavings);
    document.getElementById('paybackYears').textContent = fmt(paybackYears,1);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['systemCost', 'taxCredit', 'monthlyBill', 'offsetPct'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
