(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = (d === undefined) ? 2 : d; if (d > 2) d = 2; var p = n.toFixed(d).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); if (p[1]) p[1] = p[1].replace(/0+$/, ''); return p[1] ? p.join('.') : p[0]; }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var avgOrderValue = parseFloat(document.getElementById('avgOrderValue').value) || 0;
    var avgShipCost = parseFloat(document.getElementById('avgShipCost').value) || 0;
    var packagingCost = parseFloat(document.getElementById('packagingCost').value) || 0;
    var laborMinutes = parseFloat(document.getElementById('laborMinutes').value) || 0;
    var laborRate = parseFloat(document.getElementById('laborRate').value) || 0;
    var returnRate = parseFloat(document.getElementById('returnRate').value) || 0;
    var monthlyOrders = parseFloat(document.getElementById('monthlyOrders').value) || 0;

    // Calculation logic
    var labor = (laborMinutes / 60) * laborRate; var fulfillment = labor + packagingCost; var returnCost = avgShipCost * 0.7 * (returnRate / 100); var totalPerOrder = avgShipCost + fulfillment + returnCost; var pct = (totalPerOrder / avgOrderValue) * 100; var monthly = totalPerOrder * monthlyOrders; document.getElementById('fulfillCost').textContent = dollar(fulfillment); document.getElementById('totalLastMile').textContent = dollar(totalPerOrder); document.getElementById('pctOfOrder').textContent = fmt(pct, 1) + '%'; document.getElementById('monthlyTotal').textContent = dollar(monthly);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['avgOrderValue', 'avgShipCost', 'packagingCost', 'laborMinutes', 'laborRate', 'returnRate', 'monthlyOrders'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
