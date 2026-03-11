(function() {
  'use strict';

  var calcBtn = document.getElementById('calcBtn');
  var resultEl = document.getElementById('result');

  function fmt(n, d) { d = d || 0; return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dollar(n) { return '$' + fmt(n, 2); }
  function pct(n, d) { d = d || 1; return fmt(n, d) + '%'; }

  function calculate() {
    var monthlyAmount = parseFloat(document.getElementById('monthlyAmount').value) || 0;
    var months = parseFloat(document.getElementById('months').value) || 0;
    var startPrice = parseFloat(document.getElementById('startPrice').value) || 0;
    var endPrice = parseFloat(document.getElementById('endPrice').value) || 0;
    var volatility = document.getElementById('volatility').value;

    // Calculation logic
    var totalInv = monthlyAmount * months;
    var volFactor = volatility === 'low' ? 0.1 : volatility === 'medium' ? 0.25 : 0.5;
    var totalCoins = 0;
    var midPrice = (startPrice + endPrice) / 2;
    for (var i = 0; i < months; i++) {
      var progress = i / (months - 1 || 1);
      var price = startPrice + (endPrice - startPrice) * progress;
      var wobble = Math.sin(progress * Math.PI * 4) * volFactor * midPrice;
      var monthPrice = Math.max(price + wobble, startPrice * 0.1);
      totalCoins += monthlyAmount / monthPrice;
    }
    var avgPrice = totalInv / totalCoins;
    var dcaVal = totalCoins * endPrice;
    var lumpCoins = totalInv / startPrice;
    var lumpVal = lumpCoins * endPrice;
    var dcaReturn = ((dcaVal - totalInv) / totalInv) * 100;
    document.getElementById('totalInvested').textContent = dollar(totalInv);
    document.getElementById('avgPrice').textContent = dollar(avgPrice);
    document.getElementById('dcaValue').textContent = dollar(dcaVal);
    document.getElementById('lumpValue').textContent = dollar(lumpVal);
    document.getElementById('dcaReturn').textContent = (dcaReturn >= 0 ? '+' : '') + fmt(dcaReturn, 1) + '%';

    resultEl.classList.add('visible');
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  calcBtn.addEventListener('click', calculate);
  ['monthlyAmount', 'months', 'startPrice', 'endPrice', 'volatility'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
  });
})();
