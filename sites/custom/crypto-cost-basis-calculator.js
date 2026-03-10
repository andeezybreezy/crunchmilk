(function() {
  'use strict';

  var totalCoins = document.getElementById('totalCoins');
  var totalSpent = document.getElementById('totalSpent');
  var currentPriceCb = document.getElementById('currentPriceCb');
  var coinsToSell = document.getElementById('coinsToSell');
  var holdingPeriod = document.getElementById('holdingPeriod');
  var taxBracket = document.getElementById('taxBracket');
  var calcBtn = document.getElementById('calcBtn');
  var result = document.getElementById('result');

  function calculate() {
    var coins = parseFloat(totalCoins.value);
    var spent = parseFloat(totalSpent.value);
    var price = parseFloat(currentPriceCb.value);
    var sellCoins = parseFloat(coinsToSell.value) || 0;
    var taxRate = parseFloat(taxBracket.value) / 100;

    if (isNaN(coins) || coins <= 0 || isNaN(spent) || spent <= 0 || isNaN(price) || price <= 0) return;

    var costBasis = spent / coins;
    var currentValue = coins * price;
    var unrealizedGain = currentValue - spent;
    var roi = (unrealizedGain / spent) * 100;

    var effectiveSell = Math.min(sellCoins, coins);
    var taxableGain = effectiveSell > 0 ? (price - costBasis) * effectiveSell : unrealizedGain;
    var taxOwed = taxableGain > 0 ? taxableGain * taxRate : 0;

    document.getElementById('rCostBasis').textContent = '$' + costBasis.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('rCurrentVal').textContent = '$' + Math.round(currentValue).toLocaleString();

    var gainSign = unrealizedGain >= 0 ? '+' : '';
    document.getElementById('rGainLoss').textContent = gainSign + '$' + Math.round(Math.abs(unrealizedGain)).toLocaleString();
    document.getElementById('rGainLoss').style.color = unrealizedGain >= 0 ? '#16a34a' : '#dc2626';
    document.getElementById('rROI').textContent = gainSign + roi.toFixed(1) + '%';
    document.getElementById('rROI').style.color = roi >= 0 ? '#16a34a' : '#dc2626';

    if (effectiveSell > 0) {
      var sellGainSign = taxableGain >= 0 ? '+' : '-';
      document.getElementById('rTaxGain').textContent = sellGainSign + '$' + Math.round(Math.abs(taxableGain)).toLocaleString();
    } else {
      document.getElementById('rTaxGain').textContent = gainSign + '$' + Math.round(Math.abs(taxableGain)).toLocaleString() + ' (all)';
    }
    document.getElementById('rTaxOwed').textContent = taxOwed > 0 ? '$' + Math.round(taxOwed).toLocaleString() : '$0';

    var period = holdingPeriod.value === 'long' ? 'long-term' : 'short-term';
    var netProceeds = effectiveSell > 0 ? (effectiveSell * price - taxOwed) : (currentValue - taxOwed);
    document.getElementById('resultTip').textContent = 'At ' + (taxRate * 100) + '% ' + period + ' rate. Net after tax: $' + Math.round(netProceeds).toLocaleString();

    result.classList.add('visible');
  }

  calcBtn.addEventListener('click', calculate);
  [totalCoins, totalSpent, currentPriceCb, coinsToSell, holdingPeriod, taxBracket].forEach(function(el) {
    el.addEventListener('change', calculate);
    el.addEventListener('input', calculate);
  });

  calculate();
})();
