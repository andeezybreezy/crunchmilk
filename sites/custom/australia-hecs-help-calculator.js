(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var repaymentIncome = parseFloat(document.getElementById('repaymentIncome').value) || 0;
    var helpBalance = parseFloat(document.getElementById('helpBalance').value) || 0;
    var salaryGrowth = parseFloat(document.getElementById('salaryGrowth').value) || 0;
    var indexationRate = parseFloat(document.getElementById('indexationRate').value) || 0;

    // Calculation logic
    var rates = [
      {min: 0, max: 54435, rate: 0},
      {min: 54435, max: 62850, rate: 0.01},
      {min: 62850, max: 66620, rate: 0.02},
      {min: 66620, max: 70618, rate: 0.025},
      {min: 70618, max: 74855, rate: 0.03},
      {min: 74855, max: 79346, rate: 0.035},
      {min: 79346, max: 84107, rate: 0.04},
      {min: 84107, max: 89154, rate: 0.045},
      {min: 89154, max: 94503, rate: 0.05},
      {min: 94503, max: 100174, rate: 0.055},
      {min: 100174, max: 106185, rate: 0.06},
      {min: 106185, max: 112556, rate: 0.065},
      {min: 112556, max: 119310, rate: 0.07},
      {min: 119310, max: 126467, rate: 0.075},
      {min: 126467, max: 134056, rate: 0.08},
      {min: 134056, max: 142100, rate: 0.085},
      {min: 142100, max: 150626, rate: 0.09},
      {min: 150626, max: 159663, rate: 0.095},
      {min: 159663, max: Infinity, rate: 0.10}
    ];
    var currentRate = 0;
    for (var i = 0; i < rates.length; i++) {
      if (repaymentIncome >= rates[i].min && repaymentIncome < rates[i].max) {
        currentRate = rates[i].rate;
        break;
      }
    }
    var annualRepay = repaymentIncome * currentRate;
    var monthlyRepay = annualRepay / 12;
    var balance = helpBalance;
    var totalPaid = 0;
    var years = 0;
    var sal = repaymentIncome;
    while (balance > 0 && years < 50) {
      balance = balance * (1 + indexationRate / 100);
      var rateForYear = 0;
      for (var j = 0; j < rates.length; j++) {
        if (sal >= rates[j].min && sal < rates[j].max) { rateForYear = rates[j].rate; break; }
      }
      var yearRepay = Math.min(sal * rateForYear, balance);
      balance -= yearRepay;
      totalPaid += yearRepay;
      years++;
      sal *= (1 + salaryGrowth / 100);
    }
    document.getElementById('repaymentRate').textContent = (currentRate * 100).toFixed(1) + '%';
    document.getElementById('annualRepayment').textContent = 'A$' + annualRepay.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('monthlyRepayment').textContent = 'A$' + monthlyRepay.toFixed(0) + '/mo';
    document.getElementById('yearsToRepay').textContent = balance <= 0 ? years + ' years' : 'Over 50 years';
    document.getElementById('totalRepaid').textContent = 'A$' + totalPaid.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['repaymentIncome', 'helpBalance', 'salaryGrowth', 'indexationRate'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
