(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var homePrice = parseFloat(document.getElementById('homePrice').value) || 0;
    var downPaymentPct = parseFloat(document.getElementById('downPaymentPct').value) || 0;
    var mortgageRate = parseFloat(document.getElementById('mortgageRate').value) || 0;
    var monthlyRent = parseFloat(document.getElementById('monthlyRent').value) || 0;
    var annualAppreciation = parseFloat(document.getElementById('annualAppreciation').value) || 0;
    var investReturnPct = parseFloat(document.getElementById('investReturnPct').value) || 0;

    // Calculation logic
    var downPayment = homePrice * (downPaymentPct / 100); var loanAmount = homePrice - downPayment; var monthlyRate = (mortgageRate / 100) / 12; var nPayments = 360; var monthlyMortgagePayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, nPayments)) / (Math.pow(1 + monthlyRate, nPayments) - 1); var monthlyPropertyTax = (homePrice * 0.012) / 12; var monthlyInsurance = (homePrice * 0.005) / 12; var monthlyMaintenance = (homePrice * 0.01) / 12; var totalMonthlyBuy = monthlyMortgagePayment + monthlyPropertyTax + monthlyInsurance + monthlyMaintenance; var totalBuyPayments = 0; var remainingBalance = loanAmount; for (var m = 0; m < 120; m++) { var interestPart = remainingBalance * monthlyRate; var principalPart = monthlyMortgagePayment - interestPart; remainingBalance -= principalPart; totalBuyPayments += totalMonthlyBuy; } var homeValueAt10 = homePrice * Math.pow(1 + annualAppreciation / 100, 10); var equityBuilt = homeValueAt10 - remainingBalance; var totalBuyAll = totalBuyPayments + downPayment; var buyNet = totalBuyAll - equityBuilt; var annualRentIncrease = 0.03; var totalRentPaid = 0; var rentSavingsInvested = 0; var currentRent = monthlyRent; var monthlyInvestReturn = Math.pow(1 + investReturnPct / 100, 1/12) - 1; for (var m2 = 0; m2 < 120; m2++) { if (m2 > 0 && m2 % 12 === 0) currentRent *= (1 + annualRentIncrease); totalRentPaid += currentRent; var monthlySavings = totalMonthlyBuy - currentRent + (m2 === 0 ? downPayment / 120 : downPayment / 120); rentSavingsInvested = (rentSavingsInvested + Math.max(0, monthlySavings)) * (1 + monthlyInvestReturn); } var rentNet = totalRentPaid - rentSavingsInvested; document.getElementById('totalBuyCost').textContent = '$' + totalBuyAll.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','); document.getElementById('totalRentCost').textContent = '$' + totalRentPaid.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','); document.getElementById('buyEquity').textContent = '$' + equityBuilt.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','); document.getElementById('rentInvestGrowth').textContent = '$' + rentSavingsInvested.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','); document.getElementById('buyNetCost').textContent = '$' + buyNet.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','); document.getElementById('rentNetCost').textContent = '$' + rentNet.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','); document.getElementById('monthlyMortgage').textContent = '$' + monthlyMortgagePayment.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '/mo'; document.getElementById('verdict').textContent = buyNet < rentNet ? 'Buying saves $' + (rentNet - buyNet).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : 'Renting saves $' + (buyNet - rentNet).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['homePrice', 'downPaymentPct', 'mortgageRate', 'monthlyRent', 'annualAppreciation', 'investReturnPct'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
