(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var currentGPF = parseFloat(document.getElementById('currentGPF').value) || 0;
    var newGPF = parseFloat(document.getElementById('newGPF').value) || 0;
    var flushesPerDay = parseFloat(document.getElementById('flushesPerDay').value) || 0;
    var waterRate = parseFloat(document.getElementById('waterRate').value) || 0;

    // Calculation logic
    var dailyOld = currentGPF * flushesPerDay;
    var dailyNew = newGPF * flushesPerDay;
    var dailySave = dailyOld - dailyNew;
    var annualGal = dailySave * 365;
    var annualSave = (annualGal / 1000) * waterRate;
    var payback = annualSave > 0 ? 300 / annualSave : 999;
    document.getElementById('dailySavings').textContent = fmt(dailySave, 1) + ' gallons/day';
    document.getElementById('annualGallons').textContent = fmt(annualGal, 0) + ' gallons/year';
    document.getElementById('annualCost').textContent = dollar(annualSave) + '/year';
    document.getElementById('payback').textContent = payback < 20 ? fmt(payback, 1) + ' years' : 'Over 20 years';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['currentGPF', 'newGPF', 'flushesPerDay', 'waterRate'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
