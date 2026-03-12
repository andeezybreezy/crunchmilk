(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var balance401k = parseFloat(document.getElementById('balance401k').value) || 0;
    var stockAllocation = parseFloat(document.getElementById('stockAllocation').value) || 0;
    var marketDrop = parseFloat(document.getElementById('marketDrop').value) || 0;
    var yearsToRetirement = parseFloat(document.getElementById('yearsToRetirement').value) || 0;
    var monthlyContrib = parseFloat(document.getElementById('monthlyContrib').value) || 0;
    var avgReturn = parseFloat(document.getElementById('avgReturn').value) || 0;

    // Calculation logic
    var stockPortion = balance401k * (stockAllocation / 100); var bondPortion = balance401k - stockPortion; var todayLoss = stockPortion * (marketDrop / 100); var newBalance = balance401k - todayLoss; var recoveryMonths = marketDrop <= 5 ? 2 : marketDrop <= 10 ? 4 : marketDrop <= 20 ? 14 : marketDrop <= 30 ? 24 : 48; var futureWithLoss = newBalance * Math.pow(1 + avgReturn / 100, yearsToRetirement); for (var m = 0; m < yearsToRetirement * 12; m++) { futureWithLoss += monthlyContrib * Math.pow(1 + avgReturn / 100, (yearsToRetirement * 12 - m) / 12); } var futureWithout = balance401k * Math.pow(1 + avgReturn / 100, yearsToRetirement); for (var m2 = 0; m2 < yearsToRetirement * 12; m2++) { futureWithout += monthlyContrib * Math.pow(1 + avgReturn / 100, (yearsToRetirement * 12 - m2) / 12); } var futureDiff = futureWithout - futureWithLoss; var dailyContrib = monthlyContrib / 22; var daysOfContribs = todayLoss > 0 ? todayLoss / dailyContrib : 0; document.getElementById('todayLoss').textContent = dollar(todayLoss); document.getElementById('actualExposure').textContent = dollar(stockPortion) + ' (' + stockAllocation + '% of portfolio)'; document.getElementById('recoveryTime').textContent = recoveryMonths + ' months (historical average for ' + fmt(marketDrop, 1) + '% drops)'; document.getElementById('futureImpact').textContent = dollar(futureDiff) + ' less at retirement (if never recovered)'; document.getElementById('withRecovery').textContent = dollar(futureWithout) + ' (markets historically recover)'; document.getElementById('perspective').textContent = fmt(daysOfContribs, 0) + ' days of contributions (you will make it back)';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['balance401k', 'stockAllocation', 'marketDrop', 'yearsToRetirement', 'monthlyContrib', 'avgReturn'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
