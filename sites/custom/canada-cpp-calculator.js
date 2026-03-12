(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var annualEarnings = parseFloat(document.getElementById('annualEarnings').value) || 0;
    var employmentType = document.getElementById('employmentType').value;
    var startAge = document.getElementById('startAge').value;
    var yearsContributing = parseFloat(document.getElementById('yearsContributing').value) || 0;
    var currentAge = parseFloat(document.getElementById('currentAge').value) || 0;

    // Calculation logic
    var ympe = 68500;
    var ympe2 = 73200;
    var basicExemption = 3500;
    var pensionableEarnings = Math.min(annualEarnings, ympe) - basicExemption;
    pensionableEarnings = Math.max(0, pensionableEarnings);
    var cpp1Rate = 0.0595;
    var empContrib = pensionableEarnings * cpp1Rate;
    var erContrib = empContrib;
    if (employmentType === 'selfEmployed') {
      empContrib = pensionableEarnings * cpp1Rate * 2;
      erContrib = 0;
    }
    var cpp2 = 0;
    if (annualEarnings > ympe) {
      var cpp2Earnings = Math.min(annualEarnings, ympe2) - ympe;
      cpp2 = cpp2Earnings * 0.04;
      if (employmentType === 'selfEmployed') cpp2 *= 2;
    }
    var maxMonthly2024 = 1364.60;
    var contributionFraction = Math.min(1, yearsContributing / 39);
    var baseMonthly = maxMonthly2024 * contributionFraction * Math.min(1, pensionableEarnings / (ympe - basicExemption));
    var ageAdj = 1;
    if (startAge === '60') ageAdj = 0.64;
    if (startAge === '70') ageAdj = 1.42;
    var monthlyBenefit = baseMonthly * ageAdj;
    var annualBenefit = monthlyBenefit * 12;
    document.getElementById('annualContrib').textContent = '$' + empContrib.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('employerContrib').textContent = employmentType === 'selfEmployed' ? 'Included above (self-employed)' : '$' + erContrib.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('cpp2Contrib').textContent = cpp2 > 0 ? '$' + cpp2.toFixed(2) : 'N/A (earnings under YMPE)';
    document.getElementById('estMonthlyBenefit').textContent = '$' + monthlyBenefit.toFixed(2) + '/mo';
    document.getElementById('estAnnualBenefit').textContent = '$' + annualBenefit.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '/yr';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['annualEarnings', 'employmentType', 'startAge', 'yearsContributing', 'currentAge'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
