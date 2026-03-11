(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var billionaire = document.getElementById('billionaire').value;
    var customWealth = parseFloat(document.getElementById('customWealth').value) || 0;
    var yourIncome = parseFloat(document.getElementById('yourIncome').value) || 0;

    // Calculation logic
    var wealths = {musk: 240, bezos: 200, zuckerberg: 180, gates: 130, buffett: 130, ellison: 145, custom: v.customWealth}; var wealth = wealths[v.billionaire] * 1e9; var annualGain = wealth * 0.15; var perSecond = annualGain / (365.25 * 24 * 3600); var perMinute = perSecond * 60; var yourPerSecond = v.yourIncome / (365.25 * 24 * 3600); var ratio = Math.round(perSecond / yourPerSecond); var timeForSalary = v.yourIncome / perSecond; var timeStr = timeForSalary < 60 ? Math.round(timeForSalary) + ' seconds' : timeForSalary < 3600 ? (timeForSalary / 60).toFixed(1) + ' minutes' : (timeForSalary / 3600).toFixed(1) + ' hours'; var yearsToWealth = Math.round(wealth / v.yourIncome); var yearsStr = yearsToWealth > 1e6 ? (yearsToWealth / 1e6).toFixed(1) + ' million years' : yearsToWealth.toLocaleString() + ' years';     document.getElementById('wealthPerSecond').textContent = '$' + Math.round(perSecond).toLocaleString() + '/sec';
    document.getElementById('wealthPerMinute').textContent = '$' + Math.round(perMinute).toLocaleString() + '/min';
    document.getElementById('yourPerSecond').textContent = '$' + yourPerSecond.toFixed(4) + '/sec';
    document.getElementById('ratio').textContent = ratio.toLocaleString() + 'x your rate';
    document.getElementById('timeToEarnYourSalary').textContent = timeStr;
    document.getElementById('youToEarnTheirs').textContent = yearsStr + ' (no spending)';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['billionaire', 'customWealth', 'yourIncome'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
