(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var purchasePrice = parseFloat(document.getElementById('purchasePrice').value) || 0;
    var downPay = parseFloat(document.getElementById('downPay').value) || 0;
    var monthlyRent = parseFloat(document.getElementById('monthlyRent').value) || 0;
    var monthlyExpenses = parseFloat(document.getElementById('monthlyExpenses').value) || 0;
    var mortgagePayment = parseFloat(document.getElementById('mortgagePayment').value) || 0;

    // Calculation logic
    var cashFlow = monthlyRent - monthlyExpenses - mortgagePayment; var annual = cashFlow * 12; var cashReturn = (annual / downPay) * 100; var noi = (monthlyRent - monthlyExpenses) * 12; var capRate2 = (noi / purchasePrice) * 100; document.getElementById('monthlyCashFlow').textContent = dollar(cashFlow); document.getElementById('annualCashFlow').textContent = dollar(annual); document.getElementById('cashOnCash').textContent = pct(cashReturn); document.getElementById('capRate').textContent = pct(capRate2);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['purchasePrice', 'downPay', 'monthlyRent', 'monthlyExpenses', 'mortgagePayment'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
