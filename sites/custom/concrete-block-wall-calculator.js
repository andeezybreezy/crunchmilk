(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var length = parseFloat(document.getElementById('length').value) || 0;
    var height = parseFloat(document.getElementById('height').value) || 0;
    var blockSize = document.getElementById('blockSize').value;

    // Calculation logic
    var sqft = length * height; var blocksPerSqFt = 1.125; var blocks = Math.ceil(sqft * blocksPerSqFt * 1.05); var mortarBags = Math.ceil(blocks / 30); var verticals = Math.ceil(length / 4) + 1; var rebarLength = verticals * (height + 2);     document.getElementById('blocks').textContent = fmt(blocks,0);
    document.getElementById('mortarBags').textContent = fmt(mortarBags,0);
    document.getElementById('rebarLength').textContent = fmt(rebarLength,0);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['length', 'height', 'blockSize'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
