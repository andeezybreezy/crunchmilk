(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var originalPrice = parseFloat(document.getElementById('originalPrice').value) || 0;
    var salePrice = parseFloat(document.getElementById('salePrice').value) || 0;
    var shippingCost = parseFloat(document.getElementById('shippingCost').value) || 0;
    var driveTime = parseFloat(document.getElementById('driveTime').value) || 0;
    var waitTime = parseFloat(document.getElementById('waitTime').value) || 0;
    var hourlyWage = parseFloat(document.getElementById('hourlyWage').value) || 0;

    // Calculation logic
    var dollarSaved = originalPrice - salePrice; var pctOff = originalPrice > 0 ? (dollarSaved / originalPrice) * 100 : 0; var totalMinutes = driveTime + waitTime; var timeCostValue = (totalMinutes / 60) * hourlyWage; var realSavings = dollarSaved - shippingCost - timeCostValue; var hoursSpent = totalMinutes / 60; var hourlyReturn = hoursSpent > 0 ? realSavings / hoursSpent : realSavings; var verdict = realSavings > hourlyWage * 2 ? 'Great deal! Worth your time' : realSavings > 0 ? 'Marginal — savings barely cover your time' : 'Skip it — you lose money factoring in time'; document.getElementById('dollarSaved').textContent = dollar(dollarSaved); document.getElementById('pctOff').textContent = fmt(pctOff, 1) + '% off'; document.getElementById('timeCost').textContent = dollar(timeCostValue) + ' (' + fmt(totalMinutes, 0) + ' min)'; document.getElementById('realSavings').textContent = dollar(realSavings); document.getElementById('hourlyReturn').textContent = dollar(hourlyReturn) + '/hour'; document.getElementById('verdict').textContent = verdict;

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['originalPrice', 'salePrice', 'shippingCost', 'driveTime', 'waitTime', 'hourlyWage'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
