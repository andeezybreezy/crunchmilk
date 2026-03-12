(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var quantity = document.getElementById('quantity').value;
    var format = document.getElementById('format').value;
    var color = document.getElementById('color').value;
    var jacket = document.getElementById('jacket').value;
    var salePrice = parseFloat(document.getElementById('salePrice').value) || 0;
    var insert = document.getElementById('insert').value;

    // Calculation logic
    var qty = parseInt(quantity);
    var baseCosts = {
      '7single':  {100: 6.00, 300: 4.00, 500: 3.00, 1000: 2.25, 2000: 1.75},
      '10ep':     {100: 8.00, 300: 5.50, 500: 4.00, 1000: 3.00, 2000: 2.50},
      '12lp':     {100: 10.00, 300: 7.00, 500: 5.50, 1000: 4.00, 2000: 3.00},
      '12double': {100: 16.00, 300: 11.00, 500: 8.50, 1000: 6.50, 2000: 5.00}
    };
    var pressCost = baseCosts[format][qty] || 5.50;
    var colorAdj = color === 'color' ? 0.50 : (color === 'splatter' ? 1.50 : 0);
    pressCost += colorAdj;
    var jacketCost = jacket === 'generic' ? 0.25 : (jacket === 'gatefold' ? 2.50 : 1.00);
    var insertCost = insert === 'yes' ? 0.30 : 0;
    var pkgCost = jacketCost + insertCost;
    var totalUnit = pressCost + pkgCost;
    var totalOrder = totalUnit * qty;
    var profitUnit = salePrice - totalUnit;
    var breakEven = totalUnit > 0 ? Math.ceil(totalOrder / salePrice) : 0;
    document.getElementById('unitPressCost').textContent = '$' + pressCost.toFixed(2);
    document.getElementById('unitPackageCost').textContent = '$' + pkgCost.toFixed(2);
    document.getElementById('totalUnitCost').textContent = '$' + totalUnit.toFixed(2);
    document.getElementById('totalOrderCost').textContent = '$' + totalOrder.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('profitPerUnit').textContent = '$' + profitUnit.toFixed(2);
    document.getElementById('breakEvenUnits').textContent = breakEven + ' units';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['quantity', 'format', 'color', 'jacket', 'salePrice', 'insert'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
