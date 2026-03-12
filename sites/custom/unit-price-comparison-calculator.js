(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var price1 = parseFloat(document.getElementById('price1').value) || 0;
    var qty1 = parseFloat(document.getElementById('qty1').value) || 0;
    var price2 = parseFloat(document.getElementById('price2').value) || 0;
    var qty2 = parseFloat(document.getElementById('qty2').value) || 0;

    // Calculation logic
    var unitA = price1 / qty1; var unitB = price2 / qty2; var winner = unitA <= unitB ? 'Option A' : 'Option B'; var savings = Math.abs(unitA - unitB);     document.getElementById('unitA').textContent = dollar(unitA);
    document.getElementById('unitB').textContent = dollar(unitB);
    document.getElementById('winner').textContent = winner;
    document.getElementById('savings').textContent = dollar(savings);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['price1', 'qty1', 'price2', 'qty2'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
