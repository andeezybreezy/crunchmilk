(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var salePrice = parseFloat(document.getElementById('salePrice').value) || 0;
    var royaltyPct = parseFloat(document.getElementById('royaltyPct').value) || 0;
    var numSales = parseFloat(document.getElementById('numSales').value) || 0;
    var ethPrice = parseFloat(document.getElementById('ethPrice').value) || 0;

    // Calculation logic
    var royaltyPerSale=salePrice*(royaltyPct/100); var royaltyUSD=royaltyPerSale*ethPrice; var totalETH=royaltyPerSale*numSales; var totalUSD=totalETH*ethPrice;     document.getElementById('royaltyPerSale').textContent = fmt(royaltyPerSale,4)+' ETH';
    document.getElementById('royaltyUSD').textContent = dollar(royaltyUSD);
    document.getElementById('totalRoyaltyETH').textContent = fmt(totalETH,4)+' ETH';
    document.getElementById('totalRoyaltyUSD').textContent = dollar(totalUSD);

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['salePrice', 'royaltyPct', 'numSales', 'ethPrice'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
