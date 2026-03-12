(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var salary = parseFloat(document.getElementById('salary').value) || 0;
    var employeeRate = parseFloat(document.getElementById('employeeRate').value) || 0;
    var employerRate = parseFloat(document.getElementById('employerRate').value) || 0;
    var currentPot = parseFloat(document.getElementById('currentPot').value) || 0;
    var yearsToRetirement = parseFloat(document.getElementById('yearsToRetirement').value) || 0;
    var growthRate = parseFloat(document.getElementById('growthRate').value) || 0;

    // Calculation logic
    var qualifyingEarnings = Math.max(0, Math.min(salary, 50270) - 6240);
    var empContrib = qualifyingEarnings * (employeeRate / 100);
    var erContrib = qualifyingEarnings * (employerRate / 100);
    var totalAnnual = empContrib + erContrib;
    var taxRelief20 = empContrib * 0.25;
    var totalWithRelief = totalAnnual + taxRelief20;
    var monthlyEmp = empContrib / 12;
    var monthlyEr = erContrib / 12;
    var monthlyTotal = totalWithRelief / 12;
    var monthlyGrowth = growthRate / 100 / 12;
    var months = yearsToRetirement * 12;
    var futureVal = currentPot * Math.pow(1 + monthlyGrowth, months);
    for (var m = 0; m < months; m++) {
      futureVal += monthlyTotal * Math.pow(1 + monthlyGrowth, months - m - 1);
    }
    var annualIncome = futureVal * 0.04;
    document.getElementById('monthlyYou').textContent = '\u00A3' + monthlyEmp.toFixed(2);
    document.getElementById('monthlyEmployer').textContent = '\u00A3' + monthlyEr.toFixed(2);
    document.getElementById('monthlyTotal').textContent = '\u00A3' + monthlyTotal.toFixed(2);
    document.getElementById('taxRelief').textContent = '\u00A3' + taxRelief20.toFixed(2);
    document.getElementById('projectedPot').textContent = '\u00A3' + futureVal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('annualDrawdown').textContent = '\u00A3' + annualIncome.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['salary', 'employeeRate', 'employerRate', 'currentPot', 'yearsToRetirement', 'growthRate'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
