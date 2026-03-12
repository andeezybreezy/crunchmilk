(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var inkCost = parseFloat(document.getElementById('inkCost').value) || 0;
    var pretreamentCost = parseFloat(document.getElementById('pretreamentCost').value) || 0;
    var garmentCost = parseFloat(document.getElementById('garmentCost').value) || 0;
    var laborMinutes = parseFloat(document.getElementById('laborMinutes').value) || 0;
    var laborRate = parseFloat(document.getElementById('laborRate').value) || 0;
    var quantity = parseFloat(document.getElementById('quantity').value) || 0;
    var sellPrice = parseFloat(document.getElementById('sellPrice').value) || 0;

    // Calculation logic
    var laborCost = (laborMinutes / 60) * laborRate; var cps = inkCost + pretreamentCost + garmentCost + laborCost; var tc = cps * quantity; var profitPer = sellPrice - cps; var tp = profitPer * quantity; document.getElementById('costPerShirt').textContent = dollar(cps); document.getElementById('totalCost').textContent = dollar(tc); document.getElementById('profitPerShirt').textContent = dollar(profitPer); document.getElementById('totalProfit').textContent = dollar(tp);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['inkCost', 'pretreamentCost', 'garmentCost', 'laborMinutes', 'laborRate', 'quantity', 'sellPrice'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
