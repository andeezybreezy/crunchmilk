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
    var mortgageRate = parseFloat(document.getElementById('mortgageRate').value) || 0;
    var monthlyRent = parseFloat(document.getElementById('monthlyRent').value) || 0;
    var annualAppreciation = parseFloat(document.getElementById('annualAppreciation').value) || 0;
    var investReturn = parseFloat(document.getElementById('investReturn').value) || 0;

    // Calculation logic
    var dp = homePrice * (downPayment / 100); var loanAmt = homePrice - dp; var monthlyRate = mortgageRate / 100 / 12; var nPayments = 360; var mortgage = loanAmt * (monthlyRate) / (1 - Math.pow(1 + monthlyRate, -nPayments)); var propertyTax = homePrice * 0.012 / 12; var insurance = homePrice * 0.005 / 12; var maintenance = homePrice * 0.01 / 12; var pmi = downPayment < 20 ? loanAmt * 0.007 / 12 : 0; var monthlyOwn = mortgage + propertyTax + insurance + maintenance + pmi; var totalMortgage = mortgage * 360; var totalPropTax = 0; var totalInsurance = 0; var totalMaint = 0; for (var y = 0; y < 30; y++) { var hv = homePrice * Math.pow(1 + annualAppreciation / 100, y); totalPropTax += hv * 0.012; totalInsurance += hv * 0.005; totalMaint += hv * 0.01; } var totalOwnCost = dp + totalMortgage + totalPropTax + totalInsurance + totalMaint; var homeValue30 = homePrice * Math.pow(1 + annualAppreciation / 100, 30); var equity = homeValue30; var totalRent = 0; var investBal = dp; var rentGrowth = 0.03; for (var yr = 0; yr < 30; yr++) { var yearRent = monthlyRent * Math.pow(1 + rentGrowth, yr) * 12; totalRent += yearRent; var monthlySavings = (monthlyOwn - monthlyRent * Math.pow(1 + rentGrowth, yr)); if (monthlySavings > 0) investBal += monthlySavings * 12; investBal *= (1 + investReturn / 100); } var ownNet = equity - totalOwnCost; var rentNet = investBal - totalRent; var winner = ownNet > rentNet ? 'Buying wins by ' + dollar(ownNet - rentNet) : 'Renting wins by ' + dollar(rentNet - ownNet); document.getElementById('monthlyOwn').textContent = dollar(monthlyOwn) + ' (mortgage+tax+ins+maint)'; document.getElementById('totalOwnCost').textContent = dollar(totalOwnCost); document.getElementById('totalRentCost').textContent = dollar(totalRent); document.getElementById('homeEquity').textContent = dollar(equity); document.getElementById('investPortfolio').textContent = dollar(investBal); document.getElementById('winner').textContent = winner;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['homePrice', 'downPayment', 'mortgageRate', 'monthlyRent', 'annualAppreciation', 'investReturn'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
