(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var newPrice = parseFloat(document.getElementById('newPrice').value) || 0;
    var usedPrice = parseFloat(document.getElementById('usedPrice').value) || 0;
    var annualMiles = parseFloat(document.getElementById('annualMiles').value) || 0;
    var mpg = parseFloat(document.getElementById('mpg').value) || 0;
    var gasPrice = parseFloat(document.getElementById('gasPrice').value) || 0;
    var loanRate = parseFloat(document.getElementById('loanRate').value) || 0;

    // Calculation logic
    var newDepr = [0.20, 0.15, 0.12, 0.10, 0.09]; var usedDepr = [0.12, 0.10, 0.09, 0.08, 0.07]; var newValueEnd = newPrice; var newTotalDepr = 0; for (var i = 0; i < 5; i++) { var loss = newPrice * newDepr[i]; newTotalDepr += loss; newValueEnd = newPrice - newTotalDepr; } var usedValueEnd = usedPrice; var usedTotalDepr = 0; for (var j = 0; j < 5; j++) { var loss2 = usedPrice * usedDepr[j]; usedTotalDepr += loss2; usedValueEnd = usedPrice - usedTotalDepr; } var fuelCostPerYear = (annualMiles / mpg) * gasPrice; var totalFuel5yr = fuelCostPerYear * 5; var newInsPerYear = newPrice * 0.045; var usedInsPerYear = usedPrice * 0.04; var newInsTotal = newInsPerYear * 5; var usedInsTotal = usedInsPerYear * 5; var newMaintPerYear = [300, 400, 500, 700, 900]; var usedMaintPerYear = [700, 900, 1100, 1300, 1500]; var newMaintTotal = 0; var usedMaintTotal = 0; for (var k = 0; k < 5; k++) { newMaintTotal += newMaintPerYear[k]; usedMaintTotal += usedMaintPerYear[k]; } var newMonthlyRate = (loanRate / 100) / 12; var usedMonthlyRate = ((loanRate + 1.5) / 100) / 12; var newLoanPmt = newPrice * 0.9 * (newMonthlyRate * Math.pow(1 + newMonthlyRate, 60)) / (Math.pow(1 + newMonthlyRate, 60) - 1); var usedLoanPmt = usedPrice * 0.9 * (usedMonthlyRate * Math.pow(1 + usedMonthlyRate, 60)) / (Math.pow(1 + usedMonthlyRate, 60) - 1); var newInterestPaid = (newLoanPmt * 60) - (newPrice * 0.9); var usedInterestPaid = (usedLoanPmt * 60) - (usedPrice * 0.9); var newTotal = newPrice + newInterestPaid + newInsTotal + newMaintTotal + totalFuel5yr - newValueEnd; var usedTotal = usedPrice + usedInterestPaid + usedInsTotal + usedMaintTotal + totalFuel5yr - usedValueEnd; var savings = Math.abs(newTotal - usedTotal); document.getElementById('newTotal5yr').textContent = '$' + newTotal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','); document.getElementById('usedTotal5yr').textContent = '$' + usedTotal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','); document.getElementById('newDepreciation').textContent = '$' + newTotalDepr.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','); document.getElementById('usedDepreciation').textContent = '$' + usedTotalDepr.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','); document.getElementById('newInsurance5yr').textContent = '$' + newInsTotal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','); document.getElementById('usedInsurance5yr').textContent = '$' + usedInsTotal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','); document.getElementById('totalSavings').textContent = '$' + savings.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','); document.getElementById('betterDeal').textContent = newTotal < usedTotal ? 'New Car' : 'Used Car';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['newPrice', 'usedPrice', 'annualMiles', 'mpg', 'gasPrice', 'loanRate'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
