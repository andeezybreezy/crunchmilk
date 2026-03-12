(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var salary = parseFloat(document.getElementById('salary').value) || 0;
    var loanPlan = document.getElementById('loanPlan').value;
    var loanBalance = parseFloat(document.getElementById('loanBalance').value) || 0;
    var interestRate = parseFloat(document.getElementById('interestRate').value) || 0;
    var salaryGrowth = parseFloat(document.getElementById('salaryGrowth').value) || 0;

    // Calculation logic
    var thresholds = {plan1: 22015, plan2: 27295, plan4: 27660, plan5: 25000, postgrad: 21000};
    var rates = {plan1: 0.09, plan2: 0.09, plan4: 0.09, plan5: 0.09, postgrad: 0.06};
    var writeOffYears = {plan1: 25, plan2: 30, plan4: 30, plan5: 40, postgrad: 30};
    var threshold = thresholds[loanPlan];
    var repayRate = rates[loanPlan];
    var excess = Math.max(0, salary - threshold);
    var annualRepay = excess * repayRate;
    var monthlyRepay = annualRepay / 12;
    var balance = loanBalance;
    var totalPaid = 0;
    var years = 0;
    var maxYears = writeOffYears[loanPlan];
    var currentSal = salary;
    while (balance > 0 && years < maxYears) {
      var yearExcess = Math.max(0, currentSal - threshold);
      var yearRepay = Math.min(yearExcess * repayRate, balance + balance * (interestRate / 100));
      balance = balance * (1 + interestRate / 100) - yearRepay;
      totalPaid += yearRepay;
      years++;
      currentSal *= (1 + salaryGrowth / 100);
      if (balance <= 0) break;
    }
    if (balance > 0) { totalPaid = totalPaid; years = maxYears; }
    document.getElementById('monthlyRepayment').textContent = '\u00A3' + monthlyRepay.toFixed(2);
    document.getElementById('annualRepayment').textContent = '\u00A3' + annualRepay.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('repaymentThreshold').textContent = '\u00A3' + threshold.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '/year';
    document.getElementById('yearsToRepay').textContent = balance > 0 ? years + ' (written off)' : years + ' years';
    document.getElementById('totalRepaid').textContent = '\u00A3' + totalPaid.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['salary', 'loanPlan', 'loanBalance', 'interestRate', 'salaryGrowth'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
