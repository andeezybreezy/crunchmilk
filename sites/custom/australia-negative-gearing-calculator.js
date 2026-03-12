(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var weeklyRent = parseFloat(document.getElementById('weeklyRent').value) || 0;
    var loanAmount = parseFloat(document.getElementById('loanAmount').value) || 0;
    var interestRate = parseFloat(document.getElementById('interestRate').value) || 0;
    var annualExpenses = parseFloat(document.getElementById('annualExpenses').value) || 0;
    var depreciationYear = parseFloat(document.getElementById('depreciationYear').value) || 0;
    var marginalRate = parseFloat(document.getElementById('marginalRate').value) || 0;

    // Calculation logic
    var annualRentVal = weeklyRent * 52;
    var annualInterestVal = loanAmount * (interestRate / 100);
    var totalDeductionsVal = annualInterestVal + annualExpenses + depreciationYear;
    var netRental = annualRentVal - totalDeductionsVal;
    var taxBenefitVal = 0;
    var afterTaxCostWeekly = 0;
    if (netRental < 0) {
      taxBenefitVal = Math.abs(netRental) * (marginalRate / 100);
      var outOfPocket = Math.abs(netRental) - taxBenefitVal + depreciationYear;
      afterTaxCostWeekly = outOfPocket / 52;
    }
    document.getElementById('annualRent').textContent = 'A$' + annualRentVal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('annualInterest').textContent = 'A$' + annualInterestVal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('totalDeductions').textContent = 'A$' + totalDeductionsVal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('netRentalLoss').textContent = (netRental < 0 ? '-' : '') + 'A$' + Math.abs(netRental).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('taxBenefit').textContent = netRental < 0 ? 'A$' + taxBenefitVal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : 'A$0 (positively geared)';
    document.getElementById('afterTaxCost').textContent = netRental < 0 ? 'A$' + afterTaxCostWeekly.toFixed(0) + '/wk' : 'A$0 (cash flow positive)';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['weeklyRent', 'loanAmount', 'interestRate', 'annualExpenses', 'depreciationYear', 'marginalRate'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
