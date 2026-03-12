(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var major = document.getElementById('major').value;
    var totalCost = parseFloat(document.getElementById('totalCost').value) || 0;
    var yearsToGraduate = parseFloat(document.getElementById('yearsToGraduate').value) || 0;
    var scholarships = parseFloat(document.getElementById('scholarships').value) || 0;
    var loanRate = parseFloat(document.getElementById('loanRate').value) || 0;

    // Calculation logic
    var salaries = {engineering: 78000, cs: 80000, nursing: 62000, business: 58000, education: 42000, arts: 40000, biology: 45000, psychology: 38000}; var growthRates = {engineering: 0.04, cs: 0.045, nursing: 0.035, business: 0.035, education: 0.025, arts: 0.025, biology: 0.03, psychology: 0.03}; var startSalary = salaries[major] || 50000; var growth = growthRates[major] || 0.03; var netCost = totalCost - scholarships; var loanAmount = netCost; var hsAvgSalary = 35000; var forgoneIncome = hsAvgSalary * yearsToGraduate; var totalInvestment = netCost + forgoneIncome; var lifetimeCollege = 0; var lifetimeHS = 0; for (var y = 0; y < 30; y++) { lifetimeCollege += startSalary * Math.pow(1 + growth, y); lifetimeHS += hsAvgSalary * Math.pow(1.02, y); } var premium = lifetimeCollege - lifetimeHS; var annualPremium = (startSalary - hsAvgSalary); var breakEven = annualPremium > 0 ? totalInvestment / annualPremium : 99; var roi = totalInvestment > 0 ? ((premium - totalInvestment) / totalInvestment) * 100 : 0; var monthlyPayment = loanAmount > 0 ? (loanAmount * (loanRate / 1200)) / (1 - Math.pow(1 + loanRate / 1200, -120)) : 0; var payoffYears = monthlyPayment > 0 ? 10 : 0; document.getElementById('netCost').textContent = dollar(netCost) + ' (+ ' + dollar(forgoneIncome) + ' forgone income)'; document.getElementById('startingSalary').textContent = dollar(startSalary) + '/year'; document.getElementById('lifetimeEarnings').textContent = dollar(premium) + ' over 30 years'; document.getElementById('breakEvenYears').textContent = fmt(breakEven, 1) + ' years after graduation'; document.getElementById('thirtyYearROI').textContent = fmt(roi, 0) + '%'; document.getElementById('loanPayoff').textContent = dollar(monthlyPayment) + '/month for ' + payoffYears + ' years';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['major', 'totalCost', 'yearsToGraduate', 'scholarships', 'loanRate'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
