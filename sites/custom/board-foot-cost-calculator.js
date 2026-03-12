(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var thickness = parseFloat(document.getElementById('thickness').value) || 0;
    var width = parseFloat(document.getElementById('width').value) || 0;
    var length = parseFloat(document.getElementById('length').value) || 0;
    var numBoards = parseFloat(document.getElementById('numBoards').value) || 0;
    var pricePerBF = parseFloat(document.getElementById('pricePerBF').value) || 0;
    var wasteFactor = document.getElementById('wasteFactor').value;

    // Calculation logic
    var wf = parseFloat(wasteFactor); var bf = (thickness * width * length) / 144; var totalBf = bf * numBoards; var adjBf = totalBf * wf; var cost = adjBf * pricePerBF; document.getElementById('bfPerBoard').textContent = fmt(bf, 2) + ' bf'; document.getElementById('totalBF').textContent = fmt(totalBf, 2) + ' bf'; document.getElementById('adjBF').textContent = fmt(adjBf, 2) + ' bf'; document.getElementById('totalCost').textContent = dollar(cost);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['thickness', 'width', 'length', 'numBoards', 'pricePerBF', 'wasteFactor'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
