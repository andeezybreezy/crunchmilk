(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var thickness = parseFloat(document.getElementById('thickness').value) || 0;
    var width = parseFloat(document.getElementById('width').value) || 0;
    var length = parseFloat(document.getElementById('length').value) || 0;
    var numBoards = parseFloat(document.getElementById('numBoards').value) || 0;
    var pricePerBF = parseFloat(document.getElementById('pricePerBF').value) || 0;

    // Calculation logic
    var bf = (thickness * width * length) / 144;
    var totalBF = bf * numBoards;
    var total = totalBF * pricePerBF;
    var costPer = total / numBoards;
    document.getElementById('boardFeet').textContent = fmt(bf, 2) + ' BF';
    document.getElementById('totalBF').textContent = fmt(totalBF, 2) + ' BF';
    document.getElementById('totalCost').textContent = dollar(total);
    document.getElementById('costPerBoard').textContent = dollar(costPer);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['thickness', 'width', 'length', 'numBoards', 'pricePerBF'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
