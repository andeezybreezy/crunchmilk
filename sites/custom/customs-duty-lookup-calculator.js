(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var productCategory = document.getElementById('productCategory').value;
    var declaredValue = parseFloat(document.getElementById('declaredValue').value) || 0;
    var originCountry = document.getElementById('originCountry').value;

    // Calculation logic
    var rates = {electronics:[0,5], clothing:[12,32], furniture:[0,5], automotive:[2.5,5], food:[0,20], toys:[0,6.5], steel:[0,25], machinery:[0,5]};
    var r = rates[productCategory];
    var avgRate = (r[0] + r[1]) / 2;
    var baseDuty = declaredValue * (avgRate / 100);
    var addRate = parseFloat(originCountry);
    var addDuty = declaredValue * (addRate / 100);
    var total = baseDuty + addDuty;
    document.getElementById('baseDutyRate').textContent = r[0] + '-' + r[1] + '% (avg ' + fmt(avgRate, 1) + '%)';
    document.getElementById('baseDuty').textContent = dollar(baseDuty) + ' (at avg rate)';
    document.getElementById('additionalDuty').textContent = addRate > 0 ? dollar(addDuty) + ' (' + addRate + '% additional)' : 'None';
    document.getElementById('totalDuty').textContent = dollar(total);
    document.getElementById('disclaimer').textContent = 'Rates are estimates. Actual duty depends on specific HTS code. Consult a customs broker for exact rates.';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['productCategory', 'declaredValue', 'originCountry'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
