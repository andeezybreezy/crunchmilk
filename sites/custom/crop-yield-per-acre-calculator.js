(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var acres = parseFloat(document.getElementById('acres').value) || 0;
    var baseYield = parseFloat(document.getElementById('baseYield').value) || 0;
    var soilFactor = document.getElementById('soilFactor').value;
    var weatherFactor = document.getElementById('weatherFactor').value;

    // Calculation logic
    var sf = parseFloat(soilFactor); var wf = parseFloat(weatherFactor); var adjYield = baseYield * sf * wf; var total = adjYield * acres; var tons = total * 56 / 2000; document.getElementById('yieldPerAcre').textContent = fmt(adjYield, 1) + ' bu/acre'; document.getElementById('totalYield').textContent = fmt(total, 0) + ' bushels'; document.getElementById('totalTons').textContent = fmt(tons, 1) + ' tons';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['acres', 'baseYield', 'soilFactor', 'weatherFactor'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
