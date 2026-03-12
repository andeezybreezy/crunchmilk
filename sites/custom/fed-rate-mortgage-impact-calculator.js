(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var homePrice = parseFloat(document.getElementById('homePrice').value) || 0;
    var downPayment = parseFloat(document.getElementById('downPayment').value) || 0;
    var currentRate = parseFloat(document.getElementById('currentRate').value) || 0;
    var fedChange = document.getElementById('fedChange').value;
    var loanTerm = parseFloat(document.getElementById('loanTerm').value) || 0;

    // Calculation logic
    var dp = homePrice * (downPayment / 100); var loan = homePrice - dp; var n = loanTerm * 12; var fedChg = parseFloat(fedChange); var passthrough = 0.65; var newRate = currentRate + (fedChg * passthrough); var r1 = currentRate / 100 / 12; var r2 = newRate / 100 / 12; var pmt1 = loan * (r1 * Math.pow(1 + r1, n)) / (Math.pow(1 + r1, n) - 1); var pmt2 = loan * (r2 * Math.pow(1 + r2, n)) / (Math.pow(1 + r2, n) - 1); var monthDiff = pmt2 - pmt1; var yearDiff = monthDiff * 12; var lifeDiff = monthDiff * n; var samePmt = pmt1; var newLoanAmt = samePmt * (Math.pow(1 + r2, n) - 1) / (r2 * Math.pow(1 + r2, n)); var buyingPowerChg = newLoanAmt - loan + dp; document.getElementById('currentPayment').textContent = dollar(pmt1) + '/month'; document.getElementById('newPayment').textContent = dollar(pmt2) + '/month (at ' + fmt(newRate, 2) + '%)'; document.getElementById('monthlyDiff').textContent = (monthDiff >= 0 ? '+' : '') + dollar(monthDiff) + '/month'; document.getElementById('yearlyDiff').textContent = (yearDiff >= 0 ? '+' : '') + dollar(yearDiff) + '/year'; document.getElementById('lifetimeDiff').textContent = (lifeDiff >= 0 ? '+' : '') + dollar(lifeDiff) + ' over ' + loanTerm + ' years'; document.getElementById('buyingPower').textContent = (fedChg < 0 ? '+' : '') + dollar(buyingPowerChg - homePrice) + ' buying power at same payment';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['homePrice', 'downPayment', 'currentRate', 'fedChange', 'loanTerm'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
