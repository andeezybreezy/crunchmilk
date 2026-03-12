(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var income = parseFloat(document.getElementById('income').value) || 0;
    var monthlyDebts = parseFloat(document.getElementById('monthlyDebts').value) || 0;
    var downPayment = parseFloat(document.getElementById('downPayment').value) || 0;
    var rate = parseFloat(document.getElementById('rate').value) || 0;
    var term = document.getElementById('term').value;
    var taxRate = parseFloat(document.getElementById('taxRate').value) || 0;
    var insurance = parseFloat(document.getElementById('insurance').value) || 0;

    // Calculation logic
    var monthlyIncome = income / 12; var maxHousing28 = monthlyIncome * 0.28; var maxTotal36 = monthlyIncome * 0.36; var maxHousingByDTI = maxTotal36 - monthlyDebts; var maxHousingPayment = Math.min(maxHousing28, maxHousingByDTI); var piAvailable = maxHousingPayment - insurance; var r = (rate / 100) / 12; var n = parseInt(term) * 12; var tempLoan = 100000; var tempTax = (tempLoan * (taxRate / 100)) / 12; piAvailable = maxHousingPayment - insurance; var iterations = 0; var loanAmount = 200000; while(iterations < 50) { var tax = ((loanAmount + downPayment) * (taxRate / 100)) / 12; var piNeeded = maxHousingPayment - insurance - tax; if(piNeeded <= 0) { loanAmount = 0; break; } var newLoan = r > 0 ? piNeeded / ((r * Math.pow(1+r,n)) / (Math.pow(1+r,n)-1)) : piNeeded * n; if(Math.abs(newLoan - loanAmount) < 100) { loanAmount = newLoan; break; } loanAmount = newLoan; iterations++; } loanAmount = Math.max(0, loanAmount); var homePrice = loanAmount + downPayment; var pi = r > 0 ? loanAmount * (r * Math.pow(1+r,n)) / (Math.pow(1+r,n)-1) : loanAmount / n; var propTax = (homePrice * (taxRate / 100)) / 12; var totalMo = pi + propTax + insurance; var dti = monthlyIncome > 0 ? ((totalMo + monthlyDebts) / monthlyIncome) * 100 : 0; var dtiText = dti <= 28 ? 'Excellent — comfortably within guidelines' : dti <= 33 ? 'Good — within most lender limits' : dti <= 36 ? 'Acceptable — at the conventional limit' : dti <= 43 ? 'Stretched — may qualify for FHA only' : 'High risk — may have difficulty qualifying'; document.getElementById('maxHome').textContent = dollar(homePrice); document.getElementById('maxPayment').textContent = dollar(maxHousingPayment); document.getElementById('piPayment').textContent = dollar(pi); document.getElementById('propTaxMo').textContent = dollar(propTax); document.getElementById('insuranceMo').textContent = dollar(insurance); document.getElementById('totalMonthly').textContent = dollar(totalMo); document.getElementById('dtiRatio').textContent = pct(dti, 1); document.getElementById('dtiAssessment').textContent = dtiText;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['income', 'monthlyDebts', 'downPayment', 'rate', 'term', 'taxRate', 'insurance'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
