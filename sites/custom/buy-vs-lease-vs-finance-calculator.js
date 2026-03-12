(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var vehiclePrice = parseFloat(document.getElementById('vehiclePrice').value) || 0;
    var downPayment = parseFloat(document.getElementById('downPayment').value) || 0;
    var loanRate = parseFloat(document.getElementById('loanRate').value) || 0;
    var loanTermMonths = parseFloat(document.getElementById('loanTermMonths').value) || 0;
    var leaseMonthly = parseFloat(document.getElementById('leaseMonthly').value) || 0;
    var ownershipYears = parseFloat(document.getElementById('ownershipYears').value) || 0;

    // Calculation logic
    var depRates = [0.20, 0.15, 0.12, 0.10, 0.09, 0.08, 0.07, 0.06, 0.05, 0.05]; var residualValue = vehiclePrice; for (var d = 0; d < ownershipYears && d < depRates.length; d++) { residualValue -= vehiclePrice * depRates[d]; } residualValue = Math.max(residualValue, vehiclePrice * 0.1); var annualInsurance = vehiclePrice * 0.04; var annualMaintenance = 0; var maintCosts = [400, 500, 700, 900, 1100, 1300, 1500, 1700, 1900, 2100]; for (var mi = 0; mi < ownershipYears && mi < maintCosts.length; mi++) { annualMaintenance += maintCosts[mi]; } var cashTotal = vehiclePrice + (annualInsurance * ownershipYears) + annualMaintenance; var cashNetCost = cashTotal - residualValue; var opportunityCost = vehiclePrice * Math.pow(1.05, ownershipYears) - vehiclePrice; cashNetCost += opportunityCost; var loanAmount = vehiclePrice - downPayment; var monthlyRate = (loanRate / 100) / 12; var financePayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, loanTermMonths)) / (Math.pow(1 + monthlyRate, loanTermMonths) - 1); var totalFinancePayments = financePayment * loanTermMonths + downPayment; var interestPaid = totalFinancePayments - vehiclePrice; var financeInsurance = annualInsurance * ownershipYears; var financeMaintenance = annualMaintenance; var financeTotalCost = totalFinancePayments + financeInsurance + financeMaintenance; var financeNetCost = financeTotalCost - residualValue; var leaseTermMonths = 36; var numLeases = Math.ceil(ownershipYears / 3); var leaseDownPerLease = 2000; var leaseDispositionFee = 350; var leaseTotalCost = 0; for (var li = 0; li < numLeases; li++) { var leaseMonths = Math.min(36, (ownershipYears - li * 3) * 12); leaseTotalCost += (leaseMonthly * leaseMonths) + leaseDownPerLease + leaseDispositionFee; } var leaseInsurance = (annualInsurance * 1.1) * ownershipYears; leaseTotalCost += leaseInsurance; var leaseNetCost = leaseTotalCost; var bestLabel = 'Cash Buy'; var bestCost = cashNetCost; if (financeNetCost < bestCost) { bestLabel = 'Finance'; bestCost = financeNetCost; } if (leaseNetCost < bestCost) { bestLabel = 'Lease'; bestCost = leaseNetCost; } document.getElementById('cashBuyTotal').textContent = '$' + cashNetCost.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','); document.getElementById('financeTotal').textContent = '$' + financeNetCost.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','); document.getElementById('leaseTotal').textContent = '$' + leaseNetCost.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','); document.getElementById('cashEquity').textContent = '$' + residualValue.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','); document.getElementById('financeEquity').textContent = '$' + residualValue.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','); document.getElementById('leaseEquity').textContent = '$0 (no ownership)'; document.getElementById('financeMonthly').textContent = '$' + financePayment.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '/mo'; document.getElementById('bestValue').textContent = bestLabel + ' (net $' + bestCost.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ')';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['vehiclePrice', 'downPayment', 'loanRate', 'loanTermMonths', 'leaseMonthly', 'ownershipYears'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
