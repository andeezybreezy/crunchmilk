(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var truckPrice = parseFloat(document.getElementById('truckPrice').value) || 0;
    var downPayment = parseFloat(document.getElementById('downPayment').value) || 0;
    var loanRate = parseFloat(document.getElementById('loanRate').value) || 0;
    var loanTerm = parseFloat(document.getElementById('loanTerm').value) || 0;
    var leasePayment = parseFloat(document.getElementById('leasePayment').value) || 0;
    var leaseTerm = parseFloat(document.getElementById('leaseTerm').value) || 0;

    // Calculation logic
    var principal = truckPrice - downPayment; var monthlyRate = (loanRate / 100) / 12; var payment = monthlyRate > 0 ? principal * monthlyRate / (1 - Math.pow(1 + monthlyRate, -loanTerm)) : principal / loanTerm; var totalLoan = payment * loanTerm + downPayment; var interest = totalLoan - truckPrice; var monthLease = leasePayment * 52 / 12; var totalLease = monthLease * leaseTerm; var diff = totalLease - totalLoan; var label = diff > 0 ? 'Buying saves ' + dollar(diff) : 'Leasing saves ' + dollar(Math.abs(diff)); document.getElementById('monthlyLoan').textContent = dollar(payment); document.getElementById('monthlyLease').textContent = dollar(monthLease); document.getElementById('totalLoanCost').textContent = dollar(totalLoan); document.getElementById('totalLeaseCost').textContent = dollar(totalLease); document.getElementById('loanInterest').textContent = dollar(interest); document.getElementById('savings').textContent = label;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['truckPrice', 'downPayment', 'loanRate', 'loanTerm', 'leasePayment', 'leaseTerm'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
