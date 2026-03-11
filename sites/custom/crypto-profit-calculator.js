(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var buyPrice = parseFloat(document.getElementById('buyPrice').value) || 0;
    var sellPrice = parseFloat(document.getElementById('sellPrice').value) || 0;
    var amount = parseFloat(document.getElementById('amount').value) || 0;
    var buyFee = parseFloat(document.getElementById('buyFee').value) || 0;
    var sellFee = parseFloat(document.getElementById('sellFee').value) || 0;

    // Calculation logic
    var afterBuyFee = amount * (1 - buyFee / 100);
    var coins = afterBuyFee / buyPrice;
    var grossValue = coins * sellPrice;
    var afterSellFee = grossValue * (1 - sellFee / 100);
    var profit = afterSellFee - amount;
    var roi = (profit / amount) * 100;
    document.getElementById('coinsOwned').textContent = coins.toFixed(8);
    document.getElementById('currentValue').textContent = dollar(afterSellFee);
    document.getElementById('profitLoss').textContent = (profit >= 0 ? '+' : '') + dollar(profit);
    document.getElementById('roi').textContent = (roi >= 0 ? '+' : '') + fmt(roi, 2) + '%';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['buyPrice', 'sellPrice', 'amount', 'buyFee', 'sellFee'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
