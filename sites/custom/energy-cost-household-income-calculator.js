(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var annualIncome = parseFloat(document.getElementById('annualIncome').value) || 0;
    var monthlyGas = parseFloat(document.getElementById('monthlyGas').value) || 0;
    var monthlyElectric = parseFloat(document.getElementById('monthlyElectric').value) || 0;
    var monthlyHeating = parseFloat(document.getElementById('monthlyHeating').value) || 0;

    // Calculation logic
    var annual = (monthlyGas + monthlyElectric + monthlyHeating) * 12; var pct = (annual / annualIncome * 100); var status = pct > 10 ? 'Energy Poverty — exceeds 10% threshold' : pct > 6 ? 'High Energy Burden' : pct > 3 ? 'Moderate — within normal range' : 'Low Energy Burden'; var natAvg = 3.5; var doubled = annual * 2; var doubledPct = (doubled / annualIncome * 100);     document.getElementById('annualEnergy').textContent = '$' + Math.round(annual).toLocaleString() + '/year';
    document.getElementById('incomePercent').textContent = pct.toFixed(1) + '%';
    document.getElementById('status').textContent = status;
    document.getElementById('nationalAvg').textContent = 'National average: ' + natAvg + '% (yours: ' + (pct > natAvg ? 'above' : 'below') + ')';
    document.getElementById('crisisImpact').textContent = doubledPct.toFixed(1) + '% of income ($' + Math.round(doubled).toLocaleString() + '/yr)';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['annualIncome', 'monthlyGas', 'monthlyElectric', 'monthlyHeating'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
