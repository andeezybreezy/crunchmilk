(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var earnedIncome = parseFloat(document.getElementById('earnedIncome').value) || 0;
    var contribution = parseFloat(document.getElementById('contribution').value) || 0;
    var marginalRate = parseFloat(document.getElementById('marginalRate').value) || 0;
    var currentRRSP = parseFloat(document.getElementById('currentRRSP').value) || 0;
    var yearsToRetirement = parseFloat(document.getElementById('yearsToRetirement').value) || 0;
    var returnRate = parseFloat(document.getElementById('returnRate').value) || 0;

    // Calculation logic
    var maxRoom = Math.min(earnedIncome * 0.18, 31560);
    var actualContrib = Math.min(contribution, maxRoom);
    var taxSaved = actualContrib * (marginalRate / 100);
    var effectCost = actualContrib - taxSaved;
    var monthlyReturn = returnRate / 100 / 12;
    var months = yearsToRetirement * 12;
    var futureVal = currentRRSP * Math.pow(1 + monthlyReturn, months);
    var monthlyContrib = actualContrib / 12;
    for (var i = 0; i < months; i++) {
      futureVal += monthlyContrib * Math.pow(1 + monthlyReturn, months - i - 1);
    }
    var monthlyIncome = futureVal * 0.04 / 12;
    document.getElementById('contribRoom').textContent = '$' + maxRoom.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('taxSavings').textContent = '$' + taxSaved.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('effectiveCost').textContent = '$' + effectCost.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('projectedBalance').textContent = '$' + futureVal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('monthlyRetirement').textContent = '$' + monthlyIncome.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '/mo';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['earnedIncome', 'contribution', 'marginalRate', 'currentRRSP', 'yearsToRetirement', 'returnRate'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
