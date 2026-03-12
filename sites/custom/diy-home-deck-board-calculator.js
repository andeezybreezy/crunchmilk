(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var length = parseFloat(document.getElementById('length').value) || 0;
    var width = parseFloat(document.getElementById('width').value) || 0;
    var boardWidth = parseFloat(document.getElementById('boardWidth').value) || 0;
    var pricePerFt = parseFloat(document.getElementById('pricePerFt').value) || 0;

    // Calculation logic
    var sqft = length * width; var boardWidthFt = boardWidth / 12; var boardsFt = sqft / boardWidthFt; var boards = Math.ceil(boardsFt / length * 1.1); var screws = Math.ceil(sqft * 2.5); var cost = boardsFt * 1.1 * pricePerFt;     document.getElementById('boards').textContent = fmt(boards,0);
    document.getElementById('screws').textContent = fmt(screws,0);
    document.getElementById('cost').textContent = dollar(cost);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['length', 'width', 'boardWidth', 'pricePerFt'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
