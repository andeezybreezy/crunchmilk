(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var surfaceArea = parseFloat(document.getElementById('surfaceArea').value) || 0;
    var spreadRate = document.getElementById('spreadRate').value;
    var numGluings = parseFloat(document.getElementById('numGluings').value) || 0;
    var bottleSize = parseFloat(document.getElementById('bottleSize').value) || 0;

    // Calculation logic
    var rate = parseFloat(spreadRate); var sqFt = surfaceArea / 144; var ozNeeded = sqFt * rate * 1.2 * numGluings; var bottles = Math.ceil(ozNeeded / bottleSize); var cost = bottles * (bottleSize <= 8 ? 6.50 : bottleSize <= 16 ? 9.00 : 18.00); document.getElementById('totalGlue').textContent = fmt(ozNeeded, 1) + ' oz'; document.getElementById('bottles').textContent = bottles + ' x ' + bottleSize + 'oz'; document.getElementById('cost').textContent = dollar(cost);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['surfaceArea', 'spreadRate', 'numGluings', 'bottleSize'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
