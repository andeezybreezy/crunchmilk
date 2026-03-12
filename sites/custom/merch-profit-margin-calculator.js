(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var productType = document.getElementById('productType').value;
    var unitCost = parseFloat(document.getElementById('unitCost').value) || 0;
    var salePrice = parseFloat(document.getElementById('salePrice').value) || 0;
    var quantity = parseFloat(document.getElementById('quantity').value) || 0;
    var shippingPerUnit = parseFloat(document.getElementById('shippingPerUnit').value) || 0;
    var platformFee = parseFloat(document.getElementById('platformFee').value) || 0;

    // Calculation logic
    var fees = salePrice * (platformFee / 100);
    var totalUnitCost = unitCost + shippingPerUnit + fees;
    var profitUnit = salePrice - totalUnitCost;
    var margin = salePrice > 0 ? (profitUnit / salePrice * 100) : 0;
    var totalRev = salePrice * quantity;
    var totalCostVal = totalUnitCost * quantity;
    var totalProfitVal = profitUnit * quantity;
    document.getElementById('profitPerUnit').textContent = '$' + profitUnit.toFixed(2);
    document.getElementById('marginPct').textContent = margin.toFixed(1) + '%';
    document.getElementById('totalRevenue').textContent = '$' + totalRev.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('totalCost').textContent = '$' + totalCostVal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('totalProfit').textContent = '$' + totalProfitVal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['productType', 'unitCost', 'salePrice', 'quantity', 'shippingPerUnit', 'platformFee'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
