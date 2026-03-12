(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var nominalReturn = parseFloat(document.getElementById('nominalReturn').value) || 0;
    var inflation = parseFloat(document.getElementById('inflation').value) || 0;
    var years = parseFloat(document.getElementById('years').value) || 0;
    var investment = parseFloat(document.getElementById('investment').value) || 0;

    // Calculation logic
    var realReturn = ((1 + nominalReturn/100) / (1 + inflation/100) - 1) * 100; var nominalValue = investment * Math.pow(1 + nominalReturn/100, years); var realValue = investment * Math.pow(1 + realReturn/100, years); var purchasingPowerLoss = nominalValue - realValue;     document.getElementById('realReturn').textContent = fmt(realReturn,2);
    document.getElementById('nominalValue').textContent = dollar(nominalValue);
    document.getElementById('realValue').textContent = dollar(realValue);
    document.getElementById('purchasingPowerLoss').textContent = dollar(purchasingPowerLoss);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['nominalReturn', 'inflation', 'years', 'investment'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
