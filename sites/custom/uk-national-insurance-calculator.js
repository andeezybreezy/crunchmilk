(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var annualIncome = parseFloat(document.getElementById('annualIncome').value) || 0;
    var employmentType = document.getElementById('employmentType').value;
    var payPeriod = document.getElementById('payPeriod').value;
    var ageOver = document.getElementById('ageOver').value;

    // Calculation logic
    var annual = annualIncome;
    if (payPeriod === 'monthly') annual = annualIncome * 12;
    if (payPeriod === 'weekly') annual = annualIncome * 52;
    var ni = 0;
    if (ageOver === 'no') {
      if (employmentType === 'employed') {
        var threshold = 12570;
        var upperLimit = 50270;
        if (annual > threshold) {
          ni += Math.min(annual, upperLimit) > threshold ? (Math.min(annual, upperLimit) - threshold) * 0.08 : 0;
        }
        if (annual > upperLimit) {
          ni += (annual - upperLimit) * 0.02;
        }
      } else {
        var class2 = 3.45 * 52;
        var lowerProfits = 12570;
        var upperProfits = 50270;
        var class4 = 0;
        if (annual > lowerProfits) {
          class4 += (Math.min(annual, upperProfits) - lowerProfits) * 0.06;
        }
        if (annual > upperProfits) {
          class4 += (annual - upperProfits) * 0.02;
        }
        ni = (annual >= 6725 ? class2 : 0) + class4;
      }
    }
    var monthlyNIval = ni / 12;
    var weeklyNIval = ni / 52;
    var effRate = annual > 0 ? (ni / annual * 100) : 0;
    var takeHome = annual - ni;
    document.getElementById('annualNI').textContent = '\u00A3' + ni.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('monthlyNI').textContent = '\u00A3' + monthlyNIval.toFixed(2);
    document.getElementById('weeklyNI').textContent = '\u00A3' + weeklyNIval.toFixed(2);
    document.getElementById('effectiveNIRate').textContent = effRate.toFixed(2) + '%';
    document.getElementById('takeHomePay').textContent = '\u00A3' + takeHome.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['annualIncome', 'employmentType', 'payPeriod', 'ageOver'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
