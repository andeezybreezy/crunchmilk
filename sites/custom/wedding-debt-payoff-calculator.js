(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var debtAmount = parseFloat(document.getElementById('debtAmount').value) || 0;
    var interestRate = parseFloat(document.getElementById('interestRate').value) || 0;
    var monthlyPayment = parseFloat(document.getElementById('monthlyPayment').value) || 0;
    var extraPayment = parseFloat(document.getElementById('extraPayment').value) || 0;
    var debtType = document.getElementById('debtType').value;

    // Calculation logic
    var rate = debtType === 'family_loan' ? 0 : interestRate; var monthlyRate = rate / 100 / 12; var payment = monthlyPayment; var extraPay = extraPayment; var balance = debtAmount; var months = 0; var totalInt = 0; var maxMonths = 600; while(balance > 0 && months < maxMonths) { var interest = balance * monthlyRate; totalInt += interest; var princPayment = payment + extraPay - interest; if(princPayment <= 0) { months = maxMonths; break; } balance -= princPayment; if(balance < 0) balance = 0; months++; } var balance2 = debtAmount; var months2 = 0; var totalInt2 = 0; while(balance2 > 0 && months2 < maxMonths) { var int2 = balance2 * monthlyRate; totalInt2 += int2; var princ2 = payment - int2; if(princ2 <= 0) { months2 = maxMonths; break; } balance2 -= princ2; if(balance2 < 0) balance2 = 0; months2++; } var totalPaidAmt = debtAmount + totalInt; var interestSaved = totalInt2 - totalInt; var monthsSav = months2 - months; var payoffDate = new Date(); payoffDate.setMonth(payoffDate.getMonth() + months); var dateStr = payoffDate.toLocaleDateString('en-US', {month:'long',year:'numeric'}); document.getElementById('payoffMonths').textContent = months >= maxMonths ? 'Never (increase payment)' : months + ' months'; document.getElementById('payoffDate').textContent = months >= maxMonths ? 'N/A' : dateStr; document.getElementById('totalInterest').textContent = dollar(totalInt); document.getElementById('totalPaid').textContent = dollar(totalPaidAmt); document.getElementById('savedWithExtra').textContent = extraPay > 0 ? dollar(interestSaved) : 'Add extra payment to see'; document.getElementById('monthsSaved').textContent = extraPay > 0 ? monthsSav + ' months faster' : 'N/A';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['debtAmount', 'interestRate', 'monthlyPayment', 'extraPayment', 'debtType'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
