(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var length = parseFloat(document.getElementById('length').value) || 0;
    var width = parseFloat(document.getElementById('width').value) || 0;
    var spacing = document.getElementById('spacing').value;
    var rebarSize = document.getElementById('rebarSize').value;

    // Calculation logic
    var sp = parseInt(spacing) / 12; var barsL = Math.floor(width / sp) + 1; var barsW = Math.floor(length / sp) + 1; var totalB = barsL + barsW; var linFt = (barsL * length) + (barsW * width); var weightPerFt = {3:0.376, 4:0.668, 5:1.043, 6:1.502}; var wt = linFt * (weightPerFt[rebarSize] || 0.668); document.getElementById('barsLong').textContent = fmt(barsL, 0); document.getElementById('barsWide').textContent = fmt(barsW, 0); document.getElementById('totalBars').textContent = fmt(totalB, 0); document.getElementById('linearFeet').textContent = fmt(linFt, 0); document.getElementById('weight').textContent = fmt(wt, 0);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['length', 'width', 'spacing', 'rebarSize'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
