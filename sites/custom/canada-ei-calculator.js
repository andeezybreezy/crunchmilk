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
    var province = document.getElementById('province').value;
    var weeklyEarnings = parseFloat(document.getElementById('weeklyEarnings').value) || 0;
    var hoursWorked = parseFloat(document.getElementById('hoursWorked').value) || 0;

    // Calculation logic
    var mie = 63200;
    var insurable = Math.min(annualEarnings, mie);
    var rate = province === 'QC' ? 0.01312 : 0.0166;
    var empPremium = insurable * rate;
    var erRate = province === 'QC' ? 0.01836 : 0.02324;
    var erPremium = insurable * erRate;
    if (employmentType === 'selfEmployed') {
      empPremium = insurable * rate;
      erPremium = 0;
    }
    var bestWeeks = Math.min(weeklyEarnings, mie / 52);
    var weeklyBen = Math.min(bestWeeks * 0.55, 668);
    var maxWks = 14;
    if (hoursWorked >= 420) maxWks = 14;
    if (hoursWorked >= 700) maxWks = 26;
    if (hoursWorked >= 1260) maxWks = 36;
    if (hoursWorked >= 1820) maxWks = 45;
    var totalBen = weeklyBen * maxWks;
    document.getElementById('annualPremium').textContent = '$' + empPremium.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('employerPremium').textContent = employmentType === 'selfEmployed' ? 'N/A (self-employed)' : '$' + erPremium.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('weeklyBenefit').textContent = '$' + weeklyBen.toFixed(2) + '/wk';
    document.getElementById('maxWeeks').textContent = maxWks + ' weeks';
    document.getElementById('totalBenefits').textContent = '$' + totalBen.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['annualEarnings', 'employmentType', 'province', 'weeklyEarnings', 'hoursWorked'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
