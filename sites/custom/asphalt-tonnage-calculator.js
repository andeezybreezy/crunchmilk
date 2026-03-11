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
    var thickness = parseFloat(document.getElementById('thickness').value) || 0;
    var costPerTon = parseFloat(document.getElementById('costPerTon').value) || 0;

    // Calculation logic
    var area = length * width; var vol = area * (thickness / 12); var tons = vol * 145 / 2000; tons = Math.ceil(tons * 10) / 10; var cost = tons * costPerTon; document.getElementById('sqft').textContent = fmt(area, 0); document.getElementById('cubicFeet').textContent = fmt(vol, 1); document.getElementById('tons').textContent = fmt(tons, 1); document.getElementById('totalCost').textContent = dollar(cost);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['length', 'width', 'thickness', 'costPerTon'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
