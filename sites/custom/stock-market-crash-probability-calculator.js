(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var portfolioValue = parseFloat(document.getElementById('portfolioValue').value) || 0;
    var timeHorizon = parseFloat(document.getElementById('timeHorizon').value) || 0;
    var stockPct = parseFloat(document.getElementById('stockPct').value) || 0;
    var capeBasis = parseFloat(document.getElementById('capeBasis').value) || 0;
    var monthlyContrib = parseFloat(document.getElementById('monthlyContrib').value) || 0;

    // Calculation logic
    var yrs = timeHorizon; var capeAdj = capeBasis > 25 ? 1.15 : capeBasis > 20 ? 1.0 : 0.85; var base10 = 1 - Math.pow(0.40, yrs); var base20 = 1 - Math.pow(0.70, yrs); var base30 = 1 - Math.pow(0.85, yrs); var base50 = 1 - Math.pow(0.94, yrs); var p10 = Math.min(99, base10 * 100 * capeAdj); var p20 = Math.min(95, base20 * 100 * capeAdj); var p30 = Math.min(80, base30 * 100 * capeAdj); var p50 = Math.min(50, base50 * 100 * capeAdj); var stockExposure = portfolioValue * (stockPct / 100); var bondExposure = portfolioValue * (1 - stockPct / 100); var at30 = stockExposure * 0.70 + bondExposure * 1.05; var avgReturn = 0.07; var expectedVal = portfolioValue; for (var i = 0; i < yrs; i++) { expectedVal = expectedVal * (1 + avgReturn * stockPct / 100 + 0.03 * (1 - stockPct / 100)) + monthlyContrib * 12; } var recoveryTime = '30% drops: ~2-4 years avg recovery'; document.getElementById('prob10').textContent = fmt(p10, 0) + '% over ' + yrs + ' years'; document.getElementById('prob20').textContent = fmt(p20, 0) + '% over ' + yrs + ' years'; document.getElementById('prob30').textContent = fmt(p30, 0) + '% over ' + yrs + ' years'; document.getElementById('prob50').textContent = fmt(p50, 0) + '% over ' + yrs + ' years'; document.getElementById('maxDrawdown').textContent = dollar(at30); document.getElementById('recoveryNote').textContent = recoveryTime; document.getElementById('stayInvested').textContent = dollar(expectedVal) + ' (avg historical)';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['portfolioValue', 'timeHorizon', 'stockPct', 'capeBasis', 'monthlyContrib'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
