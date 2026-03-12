(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var quantity = parseFloat(document.getElementById('quantity').value) || 0;
    var basePrice = parseFloat(document.getElementById('basePrice').value) || 0;
    var doubleSided = document.getElementById('doubleSided').value;
    var finish = document.getElementById('finish').value;

    // Calculation logic
    var sides = parseFloat(doubleSided);
    var fin = parseFloat(finish);
    var baseCost = (quantity / 100) * basePrice;
    var total = baseCost * sides * fin;
    var perCard = total / quantity;
    var per100 = total / (quantity / 100);
    document.getElementById('totalCost').textContent = dollar(total);
    document.getElementById('costPerCard').textContent = '$' + perCard.toFixed(3);
    document.getElementById('costPer100').textContent = dollar(per100);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['quantity', 'basePrice', 'doubleSided', 'finish'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
