(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var currentGPF = parseFloat(document.getElementById('currentGPF').value) || 0;
    var newGPF = parseFloat(document.getElementById('newGPF').value) || 0;
    var flushesDay = parseFloat(document.getElementById('flushesDay').value) || 0;
    var waterRate = parseFloat(document.getElementById('waterRate').value) || 0;

    // Calculation logic
    var dailySavings = flushesDay * (currentGPF - newGPF); var annualSavings = dailySavings * 365; var costSavings = (annualSavings / 1000) * waterRate;     document.getElementById('dailySavings').textContent = fmt(dailySavings,1);
    document.getElementById('annualSavings').textContent = fmt(annualSavings,0);
    document.getElementById('costSavings').textContent = dollar(costSavings);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['currentGPF', 'newGPF', 'flushesDay', 'waterRate'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
