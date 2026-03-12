(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var propertyPrice = parseFloat(document.getElementById('propertyPrice').value) || 0;
    var deposit = parseFloat(document.getElementById('deposit').value) || 0;
    var interestRate = parseFloat(document.getElementById('interestRate').value) || 0;
    var term = parseFloat(document.getElementById('term').value) || 0;
    var buyerType = document.getElementById('buyerType').value;

    // Calculation logic
    var loan = propertyPrice - deposit;
    var ltv = (loan / propertyPrice * 100);
    var monthlyRate = interestRate / 100 / 12;
    var numPayments = term * 12;
    var monthlyPmt = loan * monthlyRate * Math.pow(1 + monthlyRate, numPayments) / (Math.pow(1 + monthlyRate, numPayments) - 1);
    var totalRepaidVal = monthlyPmt * numPayments;
    var totalInterestVal = totalRepaidVal - loan;
    var price = propertyPrice;
    var sdlt = 0;
    var surcharge = buyerType === 'additional' ? 0.03 : 0;
    if (buyerType === 'ftb' && price <= 625000) {
      if (price > 425000) sdlt = (price - 425000) * 0.05;
    } else {
      if (price > 250000) sdlt += (Math.min(price, 925000) - 250000) * 0.05;
      if (price > 925000) sdlt += (Math.min(price, 1500000) - 925000) * 0.10;
      if (price > 1500000) sdlt += (price - 1500000) * 0.12;
    }
    sdlt += price * surcharge;
    var totalUpfrontVal = deposit + sdlt;
    document.getElementById('loanAmount').textContent = '\u00A3' + loan.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('monthlyPayment').textContent = '\u00A3' + monthlyPmt.toFixed(2);
    document.getElementById('stampDuty').textContent = '\u00A3' + sdlt.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('totalUpfront').textContent = '\u00A3' + totalUpfrontVal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('totalRepaid').textContent = '\u00A3' + totalRepaidVal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('totalInterest').textContent = '\u00A3' + totalInterestVal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['propertyPrice', 'deposit', 'interestRate', 'term', 'buyerType'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
