(function() {
  'use strict';

  var stakingAmount = document.getElementById('stakingAmount');
  var coinPrice = document.getElementById('coinPrice');
  var apyRate = document.getElementById('apyRate');
  var stakingDays = document.getElementById('stakingDays');
  var compoundFreq = document.getElementById('compoundFreq');
  var calcBtn = document.getElementById('calcBtn');
  var result = document.getElementById('result');

  function calculate() {
    var principal = parseFloat(stakingAmount.value);
    var price = parseFloat(coinPrice.value);
    var apy = parseFloat(apyRate.value) / 100;
    var days = parseInt(stakingDays.value, 10);
    var n = parseInt(compoundFreq.value, 10);

    if (isNaN(principal) || principal <= 0 || isNaN(apy) || apy < 0 || isNaN(days) || days <= 0) return;

    var years = days / 365;
    var periods = n * years;
    var ratePerPeriod = apy / n;
    var finalCoins = principal * Math.pow(1 + ratePerPeriod, periods);
    var rewardCoins = finalCoins - principal;

    var initialUSD = principal * price;
    var finalUSD = finalCoins * price;
    var rewardUSD = rewardCoins * price;

    var effectiveAPY = (Math.pow(1 + apy / n, n) - 1) * 100;
    var dailyRewardCoins = rewardCoins / days;
    var monthlyRewardCoins = dailyRewardCoins * 30.44;
    var yearlyRewardCoins = dailyRewardCoins * 365;

    document.getElementById('rInitial').textContent = '$' + Math.round(initialUSD).toLocaleString();
    document.getElementById('rFinal').textContent = '$' + Math.round(finalUSD).toLocaleString();
    document.getElementById('rRewardCoins').textContent = rewardCoins.toFixed(6) + ' coins';
    document.getElementById('rRewardUSD').textContent = '$' + Math.round(rewardUSD).toLocaleString();
    document.getElementById('rEffAPY').textContent = effectiveAPY.toFixed(2) + '%';
    document.getElementById('rDaily').textContent = dailyRewardCoins.toFixed(6) + ' ($' + (dailyRewardCoins * price).toFixed(2) + ')';
    document.getElementById('rMonthly').textContent = monthlyRewardCoins.toFixed(4) + ' ($' + Math.round(monthlyRewardCoins * price).toLocaleString() + ')';
    document.getElementById('rYearly').textContent = yearlyRewardCoins.toFixed(4) + ' ($' + Math.round(yearlyRewardCoins * price).toLocaleString() + ')';

    var compLabel = n === 365 ? 'daily' : n === 52 ? 'weekly' : n === 12 ? 'monthly' : 'annual';
    document.getElementById('resultTip').textContent = principal.toFixed(2) + ' coins at ' + (apy * 100) + '% APY with ' + compLabel + ' compounding over ' + days + ' days.';

    result.classList.add('visible');
  }

  calcBtn.addEventListener('click', calculate);
  [stakingAmount, coinPrice, apyRate, stakingDays, compoundFreq].forEach(function(el) {
    el.addEventListener('change', calculate);
    el.addEventListener('input', calculate);
  });

  calculate();
})();
