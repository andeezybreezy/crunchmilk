(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var savings = parseFloat(document.getElementById('savings').value) || 0;
    var annualIncome = parseFloat(document.getElementById('annualIncome').value) || 0;
    var inflationRate = parseFloat(document.getElementById('inflationRate').value) || 0;
    var annualRaise = parseFloat(document.getElementById('annualRaise').value) || 0;
    var monthlyContrib = parseFloat(document.getElementById('monthlyContrib').value) || 0;

    // Calculation logic
    var inf = inflationRate / 100; var raise = annualRaise / 100; function realPower(yrs) { var nominalSavings = savings; for (var i = 0; i < yrs; i++) { nominalSavings += monthlyContrib * 12; } var realVal = nominalSavings / Math.pow(1 + inf, yrs); return realVal; } var rp1 = realPower(1); var rp5 = realPower(5); var rp10 = realPower(10); var rp20 = realPower(20); var nomSav20 = savings + monthlyContrib * 12 * 20; var erosion20 = nomSav20 - rp20; var incomeNeeded10 = annualIncome * Math.pow(1 + inf, 10); var incomeActual10 = annualIncome * Math.pow(1 + raise, 10); var gap10 = incomeNeeded10 - incomeActual10; document.getElementById('power1yr').textContent = dollar(rp1) + ' (of ' + dollar(savings + monthlyContrib * 12) + ')'; document.getElementById('power5yr').textContent = dollar(rp5); document.getElementById('power10yr').textContent = dollar(rp10); document.getElementById('power20yr').textContent = dollar(rp20); document.getElementById('incomeGap10').textContent = gap10 > 0 ? '-' + dollar(gap10) + '/yr shortfall' : '+' + dollar(Math.abs(gap10)) + '/yr surplus'; document.getElementById('totalErosion20').textContent = dollar(erosion20) + ' lost to inflation';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['savings', 'annualIncome', 'inflationRate', 'annualRaise', 'monthlyContrib'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
